import * as React from 'react';
import { render } from 'react-dom';
import { Stage, Layer } from 'react-konva';

import { Box } from '../../src/box';
import { Wire } from '../../src/wire';


class App extends React.Component {
  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Box name="fit" x={200} y={200} width={60} height={60}
            label="fit supervised model"
            inputPorts={["model", "predictors", "response"]}
            outputPorts={["fitted model"]}
          />
          <Box name="predict" x={400} y={200} width={60} height={60}
            label="predict"
            inputPorts={["model", "predictors"]}
            outputPorts={["response"]}
          />
          <Wire source="fit" sourcePort={1} target="predict" targetPort={1} 
            label="linear model"
          />
        </Layer>
      </Stage>
    );
  }
}

render(<App/>, document.getElementById('react-container'));