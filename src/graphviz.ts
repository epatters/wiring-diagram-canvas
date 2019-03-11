import * as _ from 'lodash';

import { Point } from './interfaces/graph';
import * as Graph from './interfaces/graph';
import * as Graphviz from './interfaces/graphviz';
import { mergeGraphData } from './graph';


/** Parse graph layout from Graphviz dot output in JSON format.
 *
 * All information unrelated to layout, such as node and edge labels, is
 * ignored.
 */
export function parseGraphvizLayout(graphviz: Graphviz.Graph): Graph.FlowGraph {
  const graph: Graph.FlowGraph = {
    id: "root",
    ports: [],
    children: [],
    edges: [],
  };

  /* Use bounding box to transform coordinates.

     Graphviz uses the standard Cartesian coordinate system (origin in bottom
     left corner), while Konva uses the HTML canvas coordinate system (origin in
     top left corner). It seems (but is not documented) that the first two
     numbers in the Graphviz bounding box are always (0,0).
   */
  const bb = parseFloatArray(graphviz.bb);
  const transformPoint = (point: Point): Point => (
    { x: point.x, y: bb[3] - point.y }
  );

  /* Parse nodes of graph, ignoring any subgraphs. Note that this does not
     exclude any nodes, only the subgraph structure.
   */
  const offset = graphviz._subgraph_cnt;
  const nodeIDs: [string,string?][] = [];
  const mapNodeID = (id: number) => nodeIDs[id - offset];
  for (let obj of graphviz.objects.slice(offset)) {
    const node = parseGraphvizNode(obj as Graphviz.Node, transformPoint);
    if (obj.style === "invis") {
      // Invisible nodes are ports of the outer box.
      graph.ports.push({ id: node.id, x: node.x, y: node.y });
      nodeIDs.push(["root", node.id]);
    } else {
      // All other nodes are boxes in the wiring diagram.
      graph.children.push(node);
      nodeIDs.push([node.id, undefined]);
    }
  }

  /* Parses edges of graph. */
  for (let edge of graphviz.edges) {
    if (edge.style === "invis") {
      // Omit invisible edges, which are used to tweak the layout in Graphviz.
      continue;
    }
    graph.edges.push(parseGraphvizEdge(edge, mapNodeID, transformPoint));
  }
  
  return graph;
}

/* Parse Graphviz node in JSON format.
 */
function parseGraphvizNode(node: Graphviz.Node,
    transformPoint: (point: Point) => Point): Graph.Box {
  const position = transformPoint(parsePoint(node.pos));
  return {
    id: node.id || node.name,
    x: position.x,
    y: position.y,
    width: _.round(inchesToPoints(parseFloat(node.width)), 3),
    height: _.round(inchesToPoints(parseFloat(node.height)), 3),
  };
}

/* Parse Graphviz edge in JSON format.
 */
function parseGraphvizEdge(edge: Graphviz.Edge,
    mapNodeID: (id: number) => [string,string?],
    transformPoint: (point: Point) => Point): Graph.Wire {
  // Get source and targets.
  let [source, sourcePort] = mapNodeID(edge.tail);
  let [target, targetPort] = mapNodeID(edge.head);
  if (!sourcePort && edge.tailport) {
    sourcePort = parseGraphvizPort(edge.tailport);
  }
  if (!targetPort && edge.headport) {
    targetPort = parseGraphvizPort(edge.headport);
  }

  // Parse cubic B-spline representing the edge.
  const spline = parseSpline(edge.pos).map(transformPoint);
  
  return {
    id: edge.id,
    source, sourcePort,
    target, targetPort,
    sourcePoint: _.first(spline),
    targetPoint: _.last(spline),
    bendPoints: spline,
  };
}

/* Parse Graphviz port specification.

   https://www.graphviz.org/doc/info/attrs.html#k:portPos
 */
function parseGraphvizPort(port: string) {
  let components = port.split(":");
  if (compassPoints.includes(_.last(components))) {
    // Discard the compass point, if present.
    components.pop();
  }
  return _.isEmpty(components) ? undefined : components.join(":");
}
const compassPoints = ["n","ne","e","se","s","sw","w","nw","c","_"];

/* Parse array of floats in Graphviz's comma-separated format.
 */
function parseFloatArray(s: string): number[] {
  return s.split(",").map(parseFloat);
}

/* Parse Graphviz point.

   http://www.graphviz.org/doc/info/attrs.html#k:point
 */
function parsePoint(s: string): Point {
  const point = parseFloatArray(s);
  return { x: point[0], y: point[1] }
}

/* Parse Graphviz spline.

   In Graphviz, a "spline" is a cubic B-spline of overlapping cubic Bezier
   curves. It consists of 3n+1 points, where n is the number of Bezier curves.

   http://www.graphviz.org/doc/info/attrs.html#k:splineType
   http://www.graphviz.org/content/how-convert-b-spline-bezier
 */
function parseSpline(spline: string): Point[] {
  let points: Point[] = [];
  let startPoint: Point = null;
  let endPoint: Point = null;
  
  spline.split(" ").forEach((s) => {
    if (s.startsWith("s,")) {
      startPoint = parsePoint(s.slice(2));
    } else if (s.startsWith("e,")) {
      endPoint = parsePoint(s.slice(2));
    } else {
      points.push(parsePoint(s));
    }
  });
  
  /* Prefer explicit start or end points to the spline start and end points.
     Thus, endpoints may pass into the node shape but should not fall short. */
  if (startPoint !== null) {
    points[0] = startPoint;
  }
  if (endPoint !== null) {
    points[points.length - 1] = endPoint;
  }
  
  return points;    
}

// 72 points per inch in Graphviz.
const inchesToPoints = (x: number) => 72*x;
