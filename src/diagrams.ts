import * as _ from 'lodash';

import * as Diagrams from './interfaces/diagrams';
import { WiringDiagram, isWiringDiagram } from './interfaces/diagrams';


/** Merge diagram, box, and wire data from one wiring diagram into another.
 * 
 * This function mutates its first argument, `diagram`.
 */
export function mergeDiagramData(diagram: WiringDiagram, sourceDiagram: WiringDiagram,
    mergeFunction?: <T>(object: T, source: T) => T): WiringDiagram {
  mergeFunction = mergeFunction || _.merge;
  
  // Create look up tables for boxes and wires.
  const boxIDs = _.fromPairs(sourceDiagram.children.map((box, i) => [box.id, i]));
  const wireIDs = _.fromPairs(sourceDiagram.edges.map((wire, i) => [wire.id, i]));

  // Merge top-level diagram data.
  mergeFunction(diagram, _.omit(sourceDiagram, ["children", "edges"]));

  // Merge box data, possibly recursively.
  for (let box of diagram.children) {
    let sourceBox = sourceDiagram.children[boxIDs[box.id]];
    if (isWiringDiagram(box) && isWiringDiagram(sourceBox)) {
      mergeDiagramData(box, sourceBox, mergeFunction);
    } else {
      mergeFunction(box, sourceBox);
    }
  }

  // Merge wire data.
  for (let wire of diagram.edges) {
    let sourceWire = sourceDiagram.edges[wireIDs[wire.id]];
    mergeFunction(wire, sourceWire);
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


/** Copy layout attributes of wiring diagram stored in `properties` fields.
 * 
 * This function mutates its argument.
 */
export function copyDiagramLayoutProperties(diagram: WiringDiagram) {
  // Copy layout of outer box.
  copyBoxLayoutProperties(diagram);

  // Copy layout of boxes, possibly recursively.
  for (let box of diagram.children) {
    if (isWiringDiagram(box)) {
      copyDiagramLayoutProperties(box);
    } else {
      copyBoxLayoutProperties(box);
    }
  }

  // Copy layout of wires.
  for (let wire of diagram.edges) {
    _.assign(wire, _.pick(wire.properties, 
      ["label","sourcePoint","targetPoint","bendPoints"]));
  }

  return diagram;
}

function copyBoxLayoutProperties(box: Diagrams.Box) {
  // Copy layout of ports.
  for (let port of box.ports) {
    _.assign(port, _.pick(port.properties, ["label","x","y"]));
  }

  // Copy layout of box itself.
  _.assign(box, _.pick(box.properties, ["label","x","y","width","height"]));

  return box;
}
