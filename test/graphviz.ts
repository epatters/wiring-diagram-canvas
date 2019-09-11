import { strict as assert } from "assert";
import * as fs from "fs";
import * as path from "path";

import * as _ from "lodash";
import "mocha";

import { Graph, Graphviz, mergeGraphLayout, parseGraphvizLayout } from "../src";


const readTestData = (name: string) => {
  const fullname = path.join(__dirname, "data", name);
  return fs.readFileSync(fullname).toString();
}
const readTestJSON = (name: string) => JSON.parse(readTestData(name));


describe("parse and merge layout from output of Graphviz dot", () => {
  let graph: Graph.FlowGraph = readTestJSON("simple_graph.json");
  let graphviz: Graphviz.Graph = readTestJSON("simple_graph.dot.json");
  let graphLayout = parseGraphvizLayout(graphviz);

  it("number of ports", () => {
    assert.equal(graphLayout.ports.length, graph.ports.length);
  });
  it("number of nodes", () => {
    assert.equal(graphLayout.children.length, graph.children.length);
  });
  it("number of edges", () => {
    assert.equal(graphLayout.edges.length, graph.edges.length);
  });
  it("x and y coordinates of nodes", () => {
    // Just check for existence.
    assert.ok(_.every(graphLayout.children, node =>
      node.x !== undefined && node.y !== undefined));
  });
  it("width and height of nodes", () => {
    assert.ok(_.every(graphLayout.children, node => node.width === 40));
    assert.ok(_.every(graphLayout.children, node => node.height === 40));
  });
  it("width and height of outer box", () => {
    assert.equal(graphLayout.width, 190);
    assert.equal(graphLayout.height, 111);
  });
  it("merge layout", () => {
    assert.ok(_.every(graph.children, node =>
      node.x === undefined && node.y === undefined));
    mergeGraphLayout(graph, graphLayout);
    assert.ok(_.every(graph.children, node =>
      node.x !== undefined && node.y !== undefined));
  });
})
