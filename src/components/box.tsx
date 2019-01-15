import * as React from 'react';
import * as Konva from 'konva';
import { KonvaNodeProps, Group, Rect, Label, Tag, Text } from 'react-konva';

import * as style from '../../style/canvas.json';
import { BoxSchema } from '../schema';
import { Port } from './port';
import { moveAncestorsToTop } from './util';


interface BoxProps extends BoxSchema, Konva.ContainerConfig, KonvaNodeProps {}

interface BoxState {
  hovering: boolean;
}

export class Box extends React.Component<BoxProps,BoxState> {

  constructor(props: BoxProps) {
    super(props);
    this.state = {hovering: false};
  }

  render() {
    const { id, width, height, ...props } = this.props;
    const inputPortSep = height / (props.inputs.length + 1);
    const outputPortSep = height / (props.outputs.length + 1);

    /* Precalculate width of text label to center label via x offset.

    The only alternative is to grab the actual Text node via a `ref` and set
    the offset after the component has mounted:
    https://github.com/konvajs/react-konva/issues/6
    */
    const textWidth = new Konva.Text({
      text: props.label,
      fontSize: style.box.fontSize
    }).getTextWidth();

    return (
      <Group {...props} name={id} offsetX={width/2} offsetY={height/2}>
        <Rect x={0} y={0}
          width={width} height={height}
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
        {props.inputs.map((port, i) =>
          <Port key={i} name={`${id}:in${i+1}`} label={port.label}
            x={0} y={(i+1) * inputPortSep}
          />
        )}
        {props.outputs.map((port, i) =>
          <Port key={i} name={`${id}:out${i+1}`} label={port.label}
            x={width} y={(i+1) * outputPortSep}
          />
        )}
        <Label x={width/2} y={height + style.label.padding}
          offsetX={textWidth/2 + style.label.padding} >
          <Tag cornerRadius={5}
            fill={style.label.baseColor} opacity={style.label.opacity} />
          <Text text={props.label} fontSize={style.box.fontSize}
            fill={style.label.textColor} padding={style.label.padding} />
        </Label>
      </Group>
    );
  }
}