import React from 'react';
import ChatService from '../services/ChatService'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "https://chat.cs291.com",
      username: "test",
      password: "test"
    };
  }

  onSubmit = event => {
    event.preventDefault();
    console.log('submit')
    ChatService.login(this.state.url, this.state.username, this.state.password)
    // this.setState({ status: `Result: ${this.state.lhs + this.state.rhs}` });
    // this.props.updateCounter();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div> 
        <div className = "title">please login</div>
        <form onSubmit={this.onSubmit}>
          <p>server url:</p>
          <input 
            name="url"
            type="text"
            onChange={this.onChange}
            value={this.state.url}
          />
          <p>username:</p>
          <input 
            name="username"
            type="text"
            onChange={this.onChange}
            value={this.state.username}
          />
          <p>password:</p>
          <input 
            name="password"
            type="text"
            onChange={this.onChange}
            value={this.state.password}
          />
          <button type="submit">connect</button>
        </form>
      </div>
    );
  }
}

export default Login;
