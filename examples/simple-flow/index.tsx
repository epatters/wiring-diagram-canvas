import * as React from 'react';
import { render } from 'react-dom';
import * as Konva from 'konva';
import { Stage, Layer, Rect, Text } from 'react-konva';

class ColoredRect extends React.Component {
  state = {
    color: 'green'
  };
  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  };
  render() {
    return (
      <Rect x={20} y={20} width={50} height={50}
        fill={this.state.color}
        shadowBlur={5}
        onClick={this.handleClick}
      />
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Text text="Click on rect" />
          <ColoredRect />
        </Layer>
      </Stage>
    );
  }
}

render(<App/>, document.getElementById('react-container'));