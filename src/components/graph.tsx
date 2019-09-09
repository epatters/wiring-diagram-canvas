import * as React from 'react';
import Konva from 'konva';
import { KonvaNodeEvents, Group } from 'react-konva';

import * as Graph from '../interfaces/graph';
import { Box } from './box';
import { Wire } from './wire';


interface FlowGraphProps extends Graph.FlowGraph, Konva.ContainerConfig, KonvaNodeEvents {}

export const FlowGraph = (props: FlowGraphProps) => {
  return (
    <Group>
      {props.children.map((box, i) => <Box key={i} {...box} />)}
      {props.edges.map((wire, i) => <Wire key={i} {...wire} />)}
    </Group>
  );
};