import * as React from 'react';
import Konva from 'konva';
import { KonvaNodeEvents, Group, Rect, Label, Tag, Text } from 'react-konva';

import * as style from '../../style/canvas.json';
import * as Diagrams from '../interfaces/diagrams';
import { Port } from './port';
import { moveAncestorsToTop } from './util';


interface BoxProps extends Diagrams.Box, Konva.ContainerConfig, KonvaNodeEvents {}

interface BoxState {
  hovering: boolean;
}

export class Box extends React.Component<BoxProps,BoxState> {

  constructor(props: BoxProps) {
    super(props);
    this.state = {hovering: false};
  }

  render() {
    const { id, labels, ports, width, height, ...props } = this.props;
    const label = labels && labels.length > 0 ? labels[0].text : null;
    const inputPorts = ports.filter(port => port.portkind === "input");
    const outputPorts = ports.filter(port => port.portkind === "output");
    const inputPortSep = height / (inputPorts.length + 1);
    const outputPortSep = height / (outputPorts.length + 1);

    /* Precalculate width of text label to center label via x offset.

    The only alternative is to grab the actual Text node via a `ref` and set
    the offset after the component has mounted:
    https://github.com/konvajs/react-konva/issues/6
    */
    const textWidth = new Konva.Text({
      text: label,
      fontSize: style.box.fontSize
    }).getTextWidth();

    return (
      <Group {...props} name={id} offsetX={width/2} offsetY={height/2}>
        <Rect x={0} y={0} width={width} height={height}
          cornerRadius={5}
          fill={style.box.baseColor}
          stroke={this.state.hovering ? style.stroke.highlightColor : style.stroke.color}
          strokeWidth={style.stroke.width}
          onMouseEnter={evt => {
            moveAncestorsToTop(evt.target, 'Group');
            this.setState({hovering: true});
          }}
          onMouseLeave={() => this.setState({hovering: false})}
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
        {label === null ? null :
        <Label x={width/2} y={height + style.label.padding}
          offsetX={textWidth/2 + style.label.padding} >
          <Tag cornerRadius={5}
            fill={style.label.baseColor} opacity={style.label.opacity} />
          <Text text={label} fontSize={style.box.fontSize}
            fill={style.label.textColor} padding={style.label.padding} />
        </Label>}
      </Group>
    );
  }
}