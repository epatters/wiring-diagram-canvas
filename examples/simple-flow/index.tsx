import * as React from 'react';
import { render } from 'react-dom';
import * as Konva from 'konva';
import { Stage, Layer, Group, Rect, Circle } from 'react-konva';

import { Box } from "../../src/box";


class App extends React.Component {
  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Box x={0} y={0} width={100} height={100} nin={3} nout={2} draggable />
        </Layer>
      </Stage>
    );
  }
}

render(<App/>, document.getElementById('react-container'));