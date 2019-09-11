import * as _ from 'lodash';

import { WiringDiagram, isWiringDiagram } from './interfaces/diagrams';


/** Merge graph, node, and edge data from one wiring diagram into another.
 * 
 * This function mutates its first argument, `diagram`.
 */
export function mergeDiagramData(diagram: WiringDiagram, sourceDiagram: WiringDiagram,
    mergeFunction?: <T>(object: T, source: T) => T): WiringDiagram {
  mergeFunction = mergeFunction || _.merge;
  
  // Create look up tables for nodes and edges.
  const nodeIDs = _.fromPairs(sourceDiagram.children.map((node, i) => [node.id, i]));
  const edgeIDs = _.fromPairs(sourceDiagram.edges.map((edge, i) => [edge.id, i]));

  // Merge graph data (top-level node data).
  mergeFunction(diagram, _.omit(sourceDiagram, ["children", "edges"]));

  // Merge node data, possibly recursively.
  for (let node of diagram.children) {
    let sourceNode = sourceDiagram.children[nodeIDs[node.id]];
    if (isWiringDiagram(node) && isWiringDiagram(sourceNode)) {
      mergeDiagramData(node, sourceNode, mergeFunction);
    } else {
      mergeFunction(node, sourceNode);
    }
  }

  // Merge edge data.
  for (let edge of diagram.edges) {
    let sourceEdge = sourceDiagram.edges[edgeIDs[edge.id]];
    mergeFunction(edge, sourceEdge);
  }

  return diagram;
}

/** Merge a wiring diagram layout into another diagram.
 * 
 * @see `parseGraphvizLayout`.
 */
export function mergeDiagramLayout(diagram: WiringDiagram, layout: WiringDiagram) {
  return mergeDiagramData(diagram, layout, _.defaults);
}
