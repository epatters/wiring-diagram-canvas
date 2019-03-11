import * as _ from 'lodash';

import * as Graph from './interfaces/graph';


/** Merge graph, node, and edge data from one flow graph into another.
 * 
 * This function mutates its first argument, `graph`.
 */
export function mergeGraphData(graph: Graph.FlowGraph, sourceGraph: Graph.FlowGraph,
    mergeFunction?: <T>(object: T, source: T) => T): Graph.FlowGraph {
  mergeFunction = mergeFunction || _.merge;
  
  // Create look up tables for nodes and edges.
  const nodeIDs = _.fromPairs(sourceGraph.children.map((node, i) => [node.id, i]));
  const edgeIDs = _.fromPairs(sourceGraph.edges.map((edge, i) => [edge.id, i]));

  // Merge graph data (top-level node data).
  mergeFunction(graph, _.omit(sourceGraph, ["children", "edges"]));

  // Merge node data, possibly recursively.
  for (let node of graph.children) {
    let sourceNode = sourceGraph.children[nodeIDs[node.id]];
    if (Graph.isFlowGraph(node) && Graph.isFlowGraph(sourceNode)) {
      mergeGraphData(node, sourceNode, mergeFunction);
    } else {
      mergeFunction(node, sourceNode);
    }
  }

  // Merge edge data.
  for (let edge of graph.edges) {
    let sourceEdge = sourceGraph.edges[edgeIDs[edge.id]];
    mergeFunction(edge, sourceEdge);
  }

  return graph;
}

/** Merge a graph layout into another flow graph.
 * 
 * @see `parseGraphvizLayout`.
 */
export function mergeGraphLayout(graph: Graph.FlowGraph, graphLayout: Graph.FlowGraph) {
  return mergeGraphData(graph, graphLayout, _.defaults);
}
