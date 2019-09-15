import * as React from 'react';
import { render } from 'react-dom';

import { mergeDiagramLayout, parseGraphvizLayout, copyDiagramLayoutProperties,
  WiringDiagramCanvas } from '../../src';
import * as diagram from './diagram.json';
import * as graphviz from './graphviz.json';

copyDiagramLayoutProperties(diagram);
const layout = parseGraphvizLayout(graphviz);
mergeDiagramLayout(diagram, layout);


class App extends React.Component {
  render() {
    return (
      <WiringDiagramCanvas diagram={diagram} />
    );
  }
}

render(<App/>, document.getElementById('react-container'));