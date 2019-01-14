import * as React from 'react';
import * as Konva from 'konva';
import { Circle } from 'react-konva';

import * as Style from '../style/canvas.json';


interface PortProps extends Konva.NodeConfig {}

interface PortState {
  highlight: boolean;
}

export class Port extends React.Component<PortProps,PortState> {

  constructor(props: PortProps) {
    super(props);
    this.state = {highlight: false};
  }

  render() {
    return (
      <Circle name="port" {...this.props}
        radius={Style.portRadius}
        fill={Style.portBaseColor}
        stroke={this.state.highlight ? Style.strokeHighlightColor : Style.strokeColor}
        strokeWidth={Style.strokeWidth}
        onMouseEnter={() => this.setState({highlight: true})}
        onMouseLeave={() => this.setState({highlight: false})} />
    );
  }
}