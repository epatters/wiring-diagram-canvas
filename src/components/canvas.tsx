import * as React from 'react';
import { Stage, Layer } from 'react-konva';

import * as style from '../../style/canvas.json';
import * as Diagrams from '../interfaces/diagrams';
import { WiringDiagram } from './diagram';


interface CanvasProps {
  diagram: Diagrams.WiringDiagram;
}

/** Konva stage containing a single, possibly nested, wiring diagram.
 */
export const WiringDiagramCanvas = (props: CanvasProps) => {
  const diagram = props.diagram;
  const pad = {
    x: style.port.radius + style.stroke.width/2,
    y: style.stroke.width/2,
  };
  return (
    <Stage width={diagram.width+2*pad.x} height={diagram.height+2*pad.y}>
      <Layer>
        <WiringDiagram x={pad.x} y={pad.y} {...diagram} />
      </Layer>
    </Stage>
  );
};