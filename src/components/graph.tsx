import * as React from 'react';
import Konva from 'konva';
import { KonvaNodeEvents, Group, Rect } from 'react-konva';

import * as style from '../../style/canvas.json';
import * as Graph from '../interfaces/graph';
import { Box } from './box';
import { Port } from './port';
import { Wire } from './wire';


interface FlowGraphProps extends Graph.FlowGraph, Konva.ContainerConfig, KonvaNodeEvents {}

export const FlowGraph = (allProps: FlowGraphProps) => {
  const { id, labels, ports, width, height, children, edges, ...props } = allProps;
  const inputPorts = ports.filter(port => port.portkind === "input");
  const outputPorts = ports.filter(port => port.portkind === "output");
  const inputPortSep = height / (inputPorts.length + 1);
  const outputPortSep = height / (outputPorts.length + 1);

  return (
    <Group {...props} name={id}>
      <Rect x={0} y={0} width={width} height={height}
        cornerRadius={5}
        fill="rgba(0,0,0,0)"
        stroke={style.stroke.color} strokeWidth={style.stroke.width}
      />
      {inputPorts.map((port, i) =>
        <Port {...port} key={i} name={`${id}:${port.id}`}
          x={0} y={(i+1) * inputPortSep}
        />
      )}
      {outputPorts.map((port, i) =>
        <Port {...port} key={i} name={`${id}:${port.id}`}
          x={width} y={(i+1) * outputPortSep}
        />
      )}
      {children.map((box, i) => <Box key={i} {...box} />)}
      {edges.map((wire, i) => <Wire key={i} {...wire} />)}
    </Group>
  );
};