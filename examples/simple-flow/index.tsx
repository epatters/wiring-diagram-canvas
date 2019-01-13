import * as _ from 'lodash';
import * as React from 'react';
import { render } from 'react-dom';
import * as Konva from 'konva';
import { Stage, Layer, Group, Rect, Circle } from 'react-konva';

interface BoxProps extends Konva.NodeConfig {
  nin: number;
  nout: number;
}

const Box = (props: BoxProps) => {
  const strokeWidth = 2;
  const radius = 5;
  const xOffset = radius + strokeWidth / 2;
  const yOffset = strokeWidth / 2;
  const inOffset = props.height / (props.nin + 1);
  const outOffset = props.height / (props.nout + 1);
  return (
    <Group {...props}>
      <Rect
        x={xOffset} y={yOffset}
        width={props.width-2*xOffset} height={props.height-2*yOffset}
        cornerRadius={radius}
        stroke="black" strokeWidth={strokeWidth} fill="lightgray"
      />
      {_.range(props.nin).map((_, i) =>
        <Circle x={xOffset} y={(i+1) * inOffset}
          radius={radius} stroke="black" fill="white" />
      )}
      {_.range(props.nout).map((_, i) =>
        <Circle x={props.width-xOffset} y={(i+1) * outOffset}
          radius={radius} stroke="black" fill="white" />
      )}
    </Group>
  );
};

class App extends React.Component {
  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Box width={100} height={100} nin={3} nout={2} draggable />
        </Layer>
      </Stage>
    );
  }
}

render(<App/>, document.getElementById('react-container'));