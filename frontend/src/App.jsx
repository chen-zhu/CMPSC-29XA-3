import React from 'react';
import './css/App.scss';
import Login from './components/Login'
import ChatWindow from './components/ChatWindow'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false };
  }

  loginCallback = isSuccess => {
    isSuccess && this.setState({isLoggedIn: true})
  }
  onDisconnect = () => {
    this.setState({isLoggedIn: false})
  }

  render() {
    console.log('[App] render')
    let content;
    if (this.state.isLoggedIn) {
      content = <ChatWindow onDisconnect={this.onDisconnect}/>
    } else {
      content = <Login afterLogin={this.loginCallback}/>
    }
    return (
        <div className="App">
          <div className={this.state.isLoggedIn ? "content" : "content snow"}>
           {content}
          </div>
          <div className="logo">@CS291A</div>
        </div>
    );
  }
}

export default App;
