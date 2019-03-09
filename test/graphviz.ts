import { strict as assert } from "assert";
import * as fs from "fs";
import * as path from "path";

import * as _ from "lodash";
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

  it("number of ports", () => {
    assert.equal(graph.ports.length, 4);
  });
  it("number of nodes", () => {
    assert.equal(graph.children.length, 3);
  });
  it("number of edges", () => {
    assert.equal(graph.edges.length, 5);
  });
  it("width and height of nodes", () => {
    assert.ok(_.every(graph.children, node => node.width === 40));
    assert.ok(_.every(graph.children, node => node.height === 40));
  });
})
