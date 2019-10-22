import React from 'react';
import './css/App.css';
import Login from './components/Login'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0, showCalculator: false };
  }

  toggleCalculators = () => {
    this.setState((prevState, props) => ({
      showCalculator: !prevState.showCalculator
    }));
  };

  updateCounter = () => {
    console.log("Update");
    this.setState((prevState, props) => ({
      counter: prevState.counter + 1
    }));
  };

  render() {
    return (
      <div className="App">
        <div className="title">CS291A</div>
        <Login/>
      </div>
    );
  }
}

export default App;
