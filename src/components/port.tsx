import * as React from 'react';
import Konva from 'konva';
import { KonvaNodeEvents, Group, Circle, Label, Tag, Text } from 'react-konva';

import * as style from '../../style/canvas.json';
import * as Diagrams from '../interfaces/diagrams';
import { moveAncestorsToTop } from './util';


interface PortProps extends Diagrams.Port, Konva.ContainerConfig, KonvaNodeEvents {}

interface PortState {
  hovering: boolean;
}

export class Port extends React.Component<PortProps,PortState> {

  constructor(props: PortProps) {
    super(props);
    this.state = {hovering: false};
  }

  render() {
    const { id, label, ...props } = this.props;
    const textLabel = label ? label.text : null;
    return (
      <Group {...props}>
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
        {textLabel === null ? null :
        <Label
          x={2*style.port.radius} y={2*style.port.radius}
          visible={this.state.hovering} >
          <Tag cornerRadius={5}
            fill={style.label.baseColor} opacity={style.label.opacity} />
          <Text text={textLabel} fontSize={style.port.fontSize}
            fill={style.label.textColor} padding={style.label.padding} />
        </Label>}
      </Group>
    );
  }
}