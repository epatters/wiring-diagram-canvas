import * as React from 'react';
import * as Konva from 'konva';
import { KonvaNodeProps, Group, Circle, Label, Tag, Text } from 'react-konva';

import * as Style from '../style/canvas.json';


interface PortProps extends Konva.ContainerConfig, KonvaNodeProps {
  label: string;
}

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
      <Group name="port" {...this.props}>
        <Circle 
          radius={Style.portRadius}
          fill={Style.portBaseColor}
          stroke={this.state.hovering ? Style.strokeHighlightColor : Style.strokeColor}
          strokeWidth={Style.strokeWidth}
          onMouseEnter={() => this.setState({hovering: true})}
          onMouseLeave={() => this.setState({hovering: false})}
        />
        <Label
          x={2*Style.portRadius} y={2*Style.portRadius}
          visible={this.state.hovering} >
          <Tag cornerRadius={5}
            fill={Style.labelBaseColor} opacity={Style.labelOpacity} />
          <Text text={this.props.label} 
            fill={Style.labelTextColor} padding={5} />
        </Label>
      </Group>
    );
  }
}