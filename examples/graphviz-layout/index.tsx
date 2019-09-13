import * as React from 'react';
import { render } from 'react-dom';
import { Stage, Layer } from 'react-konva';

import { WiringDiagram, mergeDiagramLayout, parseGraphvizLayout, copyDiagramLayoutProperties } from '../../src';
import * as diagram from './diagram.json';
import * as graphviz from './graphviz.json';


class App extends React.Component {
  render() {
    copyDiagramLayoutProperties(diagram);
    const layout = parseGraphvizLayout(graphviz);
    mergeDiagramLayout(diagram, layout);
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