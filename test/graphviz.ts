import { strict as assert } from "assert";
import * as fs from "fs";
import * as path from "path";
import "mocha";

import { Graphviz, parseGraphvizLayout } from "../src";


const readTestData = (name: string) => {
  const fullname = path.join(__dirname, "data", name);
  return fs.readFileSync(fullname).toString();
}
const readTestJSON = (name: string) => JSON.parse(readTestData(name));


describe("parse layout from Graphviz dot", () => {
  const dot: Graphviz.Graph = readTestJSON("simple_graph.dot.json");
  const graph = parseGraphvizLayout(dot);

  it("number of nodes", () => {
    // XXX: Should be 3, but for now have 4 outer ports as well.
    assert.equal(graph.children.length, 7);
  });
  it("number of edges", () => {
    assert.equal(graph.edges.length, 5);
  });
})
