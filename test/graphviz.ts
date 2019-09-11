import { strict as assert } from "assert";
import * as fs from "fs";
import * as path from "path";

import * as _ from "lodash";
import "mocha";

import { Diagrams, Graphviz, mergeDiagramLayout, parseGraphvizLayout } from "../src";


const readTestData = (name: string) => {
  const fullname = path.join(__dirname, "data", name);
  return fs.readFileSync(fullname).toString();
}
const readTestJSON = (name: string) => JSON.parse(readTestData(name));


describe("parse and merge layout from output of Graphviz dot", () => {
  let diagram: Diagrams.WiringDiagram = readTestJSON("simple_graph.json");
  let graphviz: Graphviz.Graph = readTestJSON("simple_graph.dot.json");
  let diagramLayout = parseGraphvizLayout(graphviz);

  it("number of ports", () => {
    assert.equal(diagramLayout.ports.length, diagram.ports.length);
  });
  it("number of nodes", () => {
    assert.equal(diagramLayout.children.length, diagram.children.length);
  });
  it("number of edges", () => {
    assert.equal(diagramLayout.edges.length, diagram.edges.length);
  });
  it("x and y coordinates of nodes", () => {
    // Just check for existence.
    assert.ok(_.every(diagramLayout.children, node =>
      node.x !== undefined && node.y !== undefined));
  });
  it("width and height of nodes", () => {
    assert.ok(_.every(diagramLayout.children, node => node.width === 40));
    assert.ok(_.every(diagramLayout.children, node => node.height === 40));
  });
  it("width and height of outer box", () => {
    assert.equal(diagramLayout.width, 190);
    assert.equal(diagramLayout.height, 111);
  });
  it("merge layout", () => {
    assert.ok(_.every(diagram.children, node =>
      node.x === undefined && node.y === undefined));
    mergeDiagramLayout(diagram, diagramLayout);
    assert.ok(_.every(diagram.children, node =>
      node.x !== undefined && node.y !== undefined));
  });
})
