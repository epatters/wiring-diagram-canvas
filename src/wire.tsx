import * as React from 'react';
import * as Konva from 'konva';
import { KonvaNodeProps, Group, Path, Label, Tag, Text } from 'react-konva';
import * as d3 from 'd3-path';

import * as Style from '../style/canvas.json';


interface WireProps extends Konva.NodeConfig, KonvaNodeProps {
  /* ID of source box. */
  source: string;

  /* Number of source port. */
  sourcePort: number;

  /* ID of target box. */
  target: string;

  /* Number of target port. */
  targetPort: number;

  /* Wire label, shown as tooltip on hover. */
  label: string;
}

interface WireState {
  x: number;
  y: number;
  pathData: string;
  hovering: boolean;
}

export class Wire extends React.Component<WireProps,WireState> {
  private path: Konva.Path;

  constructor(props: WireProps) {
    super(props);
    this.path = null;
    this.state = {x: 0, y: 0, pathData: "", hovering: false};
  }

  componentDidMount() {
    this.updatePath();
  }

  getPathPoint(rel: number): Konva.Vector2d {
    if (this.path === null)
      return null;
    const path = this.path as any;
    return path.getPointAtLength(rel * path.getLength());
  }

  updatePath() {
    // Get positions of source and target ports, relative to the layer.
    const props = this.props;
    const layer = this.path.getLayer();
    const sourcePort = layer.findOne(`.${props.source}:out${props.sourcePort}`);
    const targetPort = layer.findOne(`.${props.target}:in${props.targetPort}`);
    const start = sourcePort.getAbsolutePosition(layer);
    const end = targetPort.getAbsolutePosition(layer);
    
    // Construct SVG path data.
    let path = d3.path();
    path.moveTo(0, 0);
    path.lineTo(end.x - start.x, end.y - start.y);

    this.setState({ x: start.x, y: start.y, pathData: path.toString() });
  }

  render() {
    const labelPos = this.getPathPoint(0.5);
    return (
      <Group x={this.state.x} y={this.state.y}>
        <Path 
          data={this.state.pathData}
          ref={ref => {this.path = ref}}
          stroke={this.state.hovering ? Style.strokeHighlightColor : Style.strokeColor}
          strokeWidth={Style.strokeWidth}
        />
        {/* Invisible path with wider stroke, to make hovering easier */}
        <Path
          data={this.state.pathData}
          opacity={0}
          stroke="white"
          strokeWidth={3*Style.strokeWidth}
          onMouseEnter={() => this.setState({hovering: true})}
          onMouseLeave={() => this.setState({hovering: false})}
        />
        <Label
          x={labelPos !== null ? labelPos.x + 3*Style.strokeWidth : 0}
          y={labelPos !== null ? labelPos.y + 3*Style.strokeWidth : 0}
          visible={this.state.hovering} >
          <Tag cornerRadius={5}
            fill={Style.labelBaseColor} opacity={Style.labelOpacity} />
          <Text text={this.props.label} fontSize={Style.wireFontSize}
            fill={Style.labelTextColor} padding={Style.labelPadding} />
        </Label>
      </Group>
    )
  }
}