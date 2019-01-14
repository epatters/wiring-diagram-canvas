
export interface PortSchema {
  /* Port label, shown as tooltip on hover. */
  label: string;
}

export interface BoxSchema {
  /* Box label, shown below the box. */
  label: string;

  /* Input ports. */
  inputs: PortSchema[];

  /* Output ports. */
  outputs: PortSchema[];

  /* x coordinate of box, with origin at box center. */
  x?: number;

  /* y coordinate of box, with origin at box center. */
  y?: number;

  /* Width of box. */
  width?: number;

  /* Height of box. */
  height?: number;
}

export interface WireSchema {
  /* Wire label, shown as tooltip on hover. */
  label: string;

  /* ID of source box. */
  source: string;

  /* Number of source port. */
  sourcePort: number;

  /* ID of target box. */
  target: string;

  /* Number of target port. */
  targetPort: number;
}

export interface GraphSchema {
  /* Boxes in flow graph. */
  boxes: BoxSchema[];

  /* Wires in flow graph. */
  wires: WireSchema[];
}