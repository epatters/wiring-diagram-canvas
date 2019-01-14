import * as React from 'react';
import * as Konva from 'konva';
import { KonvaNodeProps, Group, Rect } from 'react-konva';

import * as Style from '../style/canvas.json';
import { Port } from './port';


interface BoxProps extends Konva.ContainerConfig, KonvaNodeProps {
  inputPorts: string[];
  outputPorts: string[];
}

interface BoxState {
  hovering: boolean;
}

export class Box extends React.Component<BoxProps,BoxState> {

  constructor(props: BoxProps) {
    super(props);
    this.state = {hovering: false};
  }

  render() {
    const props = this.props;
    const offset = Style.portRadius + Style.strokeWidth / 2;
    const inputPortSep = props.height / (props.inputPorts.length + 1);
    const outputPortSep = props.height / (props.outputPorts.length + 1);
    return (
      <Group name="box" {...props}>
        <Rect
          x={offset} y={offset}
          width={props.width-2*offset} height={props.height-2*offset}
          cornerRadius={5}
          fill={Style.boxBaseColor}
          stroke={this.state.hovering ? Style.strokeHighlightColor : Style.strokeColor}
          strokeWidth={Style.strokeWidth}
          onMouseEnter={() => this.setState({hovering: true})}
          onMouseLeave={() => this.setState({hovering: false})}
        />
        {props.inputPorts.map((label, i) =>
          // Move port to top on hover to ensure tooltip not occluded.
          <Port label={label}
            x={offset} y={(i+1) * inputPortSep}
            onMouseEnter={evt => evt.currentTarget.moveToTop()}
          />
        )}
        {props.outputPorts.map((label, i) =>
          <Port label={label}
            x={props.width-offset} y={(i+1) * outputPortSep}
            onMouseEnter={evt => evt.currentTarget.moveToTop()}
          />
        )}
      </Group>
    );
  }
}