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
          <Box x={200} y={200} width={60} height={60} draggable
            label="fit supervised model"
            inputPorts={["model", "predictors", "response"]}
            outputPorts={["fitted model"]}
          />
        </Layer>
      </Stage>
    );
  }
}

render(<App/>, document.getElementById('react-container'));