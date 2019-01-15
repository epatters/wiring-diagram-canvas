/* Top-level interface for Graphviz JSON output (new in Graphviz 2.40).
   http://www.graphviz.org/doc/info/output.html#d:json
   
   JSON is produced using the `json` (`xdot` equivalent) or `json0` (`dot`
   equivalent) Graphviz output formats. The xdot drawing instructions are not
   included in this interface.
 */
export interface Graph {
  /* Name of the top-level graph. */
  name: string;
  
  /* Is the graph directed? */
  directed: boolean;

  /* Is the graph strict, meaning that no two nodes have multiple edges? */
  strict: boolean;
  
  /* Bounding box of graph as rectangle. */
  bb: string;
  
  /* Number of subgraphs in the graph. */
  _subgraph_cnt: number;
  
  /* Nodes and subgraphs in the graph.
     The first `_subgraph_cnt` objects are subgraphs; the rest are nodes.
   */
  objects: GraphObject[];
  
  /* Edges in the graph. */
  edges: Edge[];
}

/* Node or subgraph in Graphviz JSON output.
 */
export interface GraphObject extends GraphElement {
  /* Index of node or subgraph in `objects` array. */
  _gvid: number;
  
  /* Name of node or subgraph in dot file. */
  name: string;
}

export interface Node extends GraphObject {
  /* Position of node as comma-separated pair, in points (72 points/inch). */
  pos?: string;
  
  /* Width of node in inches. */
  width?: string;
  
  /* Height of node in inches. */
  height?: string;
  
  /* External label for node. */
  xlabel?: string;
}

export interface Subgraph extends GraphObject {
  /* Nodes (or subgraphs) in graph that are contained in this subgraph. */
  nodes: number[];
  
  /* Edges in graph that are contained in this subgraph. */
  edges: number[];
}

export interface Edge extends GraphElement {
  /* Index of edge in `edges` array. */
  _gvid: number;
  
  /* Head (target) of edge. */
  head: number;
  
  /* Tail (source) of edge. */
  tail: number;
  
  /* Positions of start, end, and control points of spline. 
     http://www.graphviz.org/doc/info/attrs.html#k:splineType
   */
  pos?: string;
  
  /* External label for edge.
     Except under the dot layout, a synonym for `label`.
   */
  xlabel?: string;
}

export interface GraphElement {
  /* User-defined ID, ignored by Graphviz. */
  id?: string;
  
  /* Text label attached to element. */
  label?: string;
  
  /* Style information. */
  style?: string;
}
