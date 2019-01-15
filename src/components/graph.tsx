import * as React from 'react';
import * as Konva from 'konva';
import { KonvaNodeProps, Group } from 'react-konva';

import { GraphSchema } from '../schema';
import { Box } from './box';
import { Wire } from './wire';


interface GraphProps extends GraphSchema, Konva.ContainerConfig, KonvaNodeProps {}

export const Graph = (props: GraphProps) => {
  return (
    <Group>
      {props.boxes.map((box, i) => <Box key={i} {...box} />)}
      {props.wires.map((wire, i) => <Wire key={i} {...wire} />)}
    </Group>
  );
};