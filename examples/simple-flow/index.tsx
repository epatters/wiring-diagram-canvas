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
          <Box x={0} y={0} width={75} height={75} nin={3} nout={1} draggable />
        </Layer>
      </Stage>
    );
  }
}

render(<App/>, document.getElementById('react-container'));