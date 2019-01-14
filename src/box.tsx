import * as _ from 'lodash';
import * as React from 'react';
import * as Konva from 'konva';
import { Group, Rect, Circle } from 'react-konva';

import * as Style from '../style/canvas.json';
import { Port } from './port';


interface BoxProps extends Konva.NodeConfig {
  nin: number;
  nout: number;
}

interface BoxState {
  highlight: boolean;
}

export class Box extends React.Component<BoxProps,BoxState> {

  constructor(props: BoxProps) {
    super(props);
    this.state = {highlight: false};
  }

  render() {
    const props = this.props;
    const xOffset = Style.portRadius + Style.strokeWidth / 2;
    const yOffset = Style.strokeWidth / 2;
    const inOffset = props.height / (props.nin + 1);
    const outOffset = props.height / (props.nout + 1);
    return (
      <Group name="box" {...props}>
        <Rect
          x={xOffset} y={yOffset}
          width={props.width-2*xOffset} height={props.height-2*yOffset}
          cornerRadius={5}
          fill={Style.boxBaseColor}
          stroke={this.state.highlight ? Style.strokeHighlightColor : Style.strokeColor}
          strokeWidth={Style.strokeWidth}
          onMouseEnter={() => this.setState({highlight: true})}
          onMouseLeave={() => this.setState({highlight: false})}
        />
        {_.range(props.nin).map(i =>
          <Port x={xOffset} y={(i+1) * inOffset} />
        )}
        {_.range(props.nout).map(i =>
          <Port x={props.width-xOffset} y={(i+1) * outOffset} />
        )}
      </Group>
    );
  }
}