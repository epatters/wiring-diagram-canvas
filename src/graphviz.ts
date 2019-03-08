import * as _ from 'lodash';

import { Point } from './interfaces/graph';
import * as Graph from './interfaces/graph';
import * as Graphviz from './interfaces/graphviz';


/** Parse graph layout from Graphviz dot output in JSON format.
 *
 * All information unrelated to layout, such as node and edge labels, is
 * ignored.
 */
export function parseGraphvizLayout(graphviz: Graphviz.Graph): Graph.FlowGraph {
  let boxes: Graph.Box[] = [];
  let wires: Graph.Wire[] = [];

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
  for (let obj of graphviz.objects.slice(offset)) {
    boxes.push(parseGraphvizNode(obj as Graphviz.Node, transformPoint));
  }

  /* Parses edges of graph. */
  const getBox = (id: number) => boxes[id - offset];
  for (let edge of graphviz.edges) {
    if (edge.style === "invis") {
      // Omit invisible edges, which are used to tweak the layout in Graphviz.
      continue;
    }
    wires.push(parseGraphvizEdge(edge, getBox, transformPoint));
  }
  
  return {
    children: boxes, 
    edges: wires,
  };
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
    getBox: (id: number) => Graph.Box,
    transformPoint: (point: Point) => Point): Graph.Wire {
  // Get source and target nodes.
  const source = getBox(edge.tail);
  const target = getBox(edge.head);

  // Parse cubic B-spline representing the edge.
  const spline = parseSpline(edge.pos).map(transformPoint);
  
  return {
    id: edge.id,
    source: source.id,
    target: target.id,
    sourcePoint: _.first(spline),
    targetPoint: _.last(spline),
    bendPoints: spline,
  };
}

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
