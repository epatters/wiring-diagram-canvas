/* JSON format for wiring diagrams (flow graphs).
 *
 * We use the same format as Catlab.jl for serializing wiring diagrams in JSON.
 * It is based on the JSON graph format used in the KIELER project and its
 * successor ELK (Eclipse Layout Kernel).
 *
 * References:
 *
 * - KEILER's JSON graph format:
 *   https://rtsys.informatik.uni-kiel.de/confluence/display/KIELER/JSON+Graph+Format
 *
 * - ELK's JSON graph format and coordinate system:
 *   https://www.eclipse.org/elk/documentation/tooldevelopers/graphdatastructure/jsonformat.html
 *   https://www.eclipse.org/elk/documentation/tooldevelopers/graphdatastructure/coordinatesystem.html
 */

/** A wiring diagram (flow graph).
*/
export interface WiringDiagram extends Box {
  /** Boxes in wiring diagram. */
  children: Box[];

  /** Wires in wiring diagram. */
  edges: Wire[];
}

/** Box in a wiring diagram.
 */
export interface Box extends DiagramElement {
  /** Input and output ports of box. */
  ports?: Port[];

  /** x coordinate of box, with origin at box center. */
  x?: number;

  /** y coordinate of box, with origin at box center. */
  y?: number;

  /** Width of box. */
  width?: number;

  /** Height of box. */
  height?: number;
}

/** Port attached to a box.
 */
export interface Port extends DiagramElement {
  /** Is the port an input port or an output port? */
  portkind?: string; // 'input' | 'output';

  /** x coordinate of port, relative to containing box. */
  x?: number;

  /** y coordinate of port, relative to containing box. */
  y?: number;
}

/** Wire between boxes in a wiring diagram.
 */
export interface Wire extends DiagramElement {
  /** ID of source box. */
  source: string;

  /** ID of source port. */
  sourcePort?: string;

  /** ID of target box. */
  target: string;

  /** ID of target port. */
  targetPort?: string;

  /** Source point of wire. */
  sourcePoint?: Point;

  /** Target point of wire. */
  targetPoint?: Point;

  /** Bend points of wire, including source and target points.
   *
   * The points define a cubic B-spline of overlapping cubic Bezier curves.
   */
  bendPoints?: Point[];
}

/** Abstract base interface for elements in a wiring diagram.
 */
interface DiagramElement {
  /** ID of diagram element. */
  id?: string;

  /** Text labels associated with diagram element.
   * 
   * Currently, we allow elements to have at most one label.
   */
  labels?: {
    text: string;
  }[];

  /** Arbitrary JSON data associated with diagram element. */
  properties?: {
    [key: string]: any;
  };
}

/** Point in the Cartesian plane.
 */
export interface Point {
  /** x coordinate of point. */
  x: number;

  /** y coordinate of point. */
  y: number;
}

/** Is the box a wiring diagram, i.e., non-atomic?
 */
export function isWiringDiagram(box: Box): box is WiringDiagram {
  return "children" in box && "edges" in box;
}
