import * as React from 'react';
import { render } from 'react-dom';

import { WiringDiagramCanvas } from '../../src';
import * as diagram from './diagram-with-layout.json';


class App extends React.Component {
  render() {
    return (
      <WiringDiagramCanvas diagram={diagram} />
    );
  }
}

render(<App/>, document.getElementById('react-container'));