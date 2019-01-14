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

  /* Get point on path.

  Argument is a number between 0 (beginning of path) and 1 (end of path).
  */
  getPathPoint(rel: number): Konva.Vector2d {
    const path = this.path as any;
    if (path === null)
      return null;
    return path.getPointAtLength(rel * path.getLength());
  }

  /* Update path based on positions of source and target ports.
  */
  updatePath() {
    // Get positions of source and target ports, relative to the layer.
    const { source, sourcePort, target, targetPort } = this.props;
    const layer = this.path.getLayer();
    const sourceNode = layer.findOne(`.${source}:out${sourcePort}`);
    const targetNode = layer.findOne(`.${target}:in${targetPort}`);
    const start = sourceNode.getAbsolutePosition(layer);
    const end = targetNode.getAbsolutePosition(layer);
    
    // Construct SVG path data.
    const delta = {x: end.x - start.x, y: end.y - start.y};
    let path = d3.path();
    path.moveTo(Style.portRadius, 0);
    path.bezierCurveTo(
      delta.x/2, 0,
      delta.x/2, delta.y,
      delta.x - Style.portRadius, delta.y
    );

    this.setState({ x: start.x, y: start.y, pathData: path.toString() });
  }

  componentDidMount() {
    this.updatePath();
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
          onMouseEnter={evt => {
            // Move to top on hover to ensure tooltip not occluded.
            evt.target.findAncestors('Group').map(group => group.moveToTop());
            this.setState({hovering: true});
          }}
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