import * as React from 'react';
import { render } from 'react-dom';
import { Stage, Layer } from 'react-konva';

import { Box, Wire } from '../../src';


class App extends React.Component {
  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Box name="lm" x={100} y={100} width={40} height={40}
            label="linear model"
            inputPorts={[]}
            outputPorts={["model"]}
          />
          <Box name="read" x={100} y={300} width={60} height={60}
            label="read data"
            inputPorts={[]}
            outputPorts={["predictors", "response"]}
          />
          <Box name="fit" x={250} y={200} width={60} height={60}
            label="fit supervised model"
            inputPorts={["model", "predictors", "response"]}
            outputPorts={["fitted model"]}
          />
          <Box name="predict" x={400} y={300} width={60} height={60}
            label="predict"
            inputPorts={["model", "predictors"]}
            outputPorts={["response"]}
          />
          <Wire source="lm" sourcePort={1} target="fit" targetPort={1}
            label="linear model"
          />
          <Wire source="read" sourcePort={1} target="fit" targetPort={2}
            label="table"
          />
          <Wire source="read" sourcePort={2} target="fit" targetPort={3}
            label="column"
          />
          <Wire source="fit" sourcePort={1} target="predict" targetPort={1}
            label="linear model"
          />
          <Wire source="read" sourcePort={1} target="predict" targetPort={2}
            label="table"
          />
        </Layer>
      </Stage>
    );
  }
}

render(<App/>, document.getElementById('react-container'));