import * as React from 'react';
import { render } from 'react-dom';
import { Stage, Layer } from 'react-konva';

import { WiringDiagram } from '../../src';
import * as diagram from './diagram-with-layout.json';


class App extends React.Component {
  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <WiringDiagram x={25} y={25} {...diagram} />
        </Layer>
      </Stage>
    );
  }
}

render(<App/>, document.getElementById('react-container'));