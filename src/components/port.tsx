import * as React from 'react';
import * as Konva from 'konva';
import { KonvaNodeProps, Group, Circle, Label, Tag, Text } from 'react-konva';

import * as style from '../../style/canvas.json';
import { PortSchema } from '../interfaces/graph';
import { moveAncestorsToTop } from './util';


interface PortProps extends PortSchema, Konva.ContainerConfig, KonvaNodeProps {}

interface PortState {
  hovering: boolean;
}

export class Port extends React.Component<PortProps,PortState> {

  constructor(props: PortProps) {
    super(props);
    this.state = {hovering: false};
  }

  render() {
    return (
      <Group {...this.props}>
        <Circle 
          radius={style.port.radius}
          fill={style.port.baseColor}
          stroke={this.state.hovering ? style.stroke.highlightColor : style.stroke.color}
          strokeWidth={style.stroke.width}
          onMouseEnter={evt => {
            moveAncestorsToTop(evt.target, 'Group');
            this.setState({hovering: true});
          }}
          onMouseLeave={() => this.setState({hovering: false})}
        />
        <Label
          x={2*style.port.radius} y={2*style.port.radius}
          visible={this.state.hovering} >
          <Tag cornerRadius={5}
            fill={style.label.baseColor} opacity={style.label.opacity} />
          <Text text={this.props.label} fontSize={style.port.fontSize}
            fill={style.label.textColor} padding={style.label.padding} />
        </Label>
      </Group>
    );
  }
}