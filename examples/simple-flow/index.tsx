import * as React from 'react';
import { render } from 'react-dom';
import { Stage, Layer } from 'react-konva';

import { FlowGraph } from '../../src';
import * as flow from './flow.json';


class App extends React.Component {
  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <FlowGraph x={50} y={50} {...flow} />
        </Layer>
      </Stage>
    );
  }
}

render(<App/>, document.getElementById('react-container'));