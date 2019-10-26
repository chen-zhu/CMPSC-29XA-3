import React from 'react';
import ChatService from '../services/ChatService'

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "http://chat.cs291.com",
      username: "test",
      password: "test"
    };
  }

  onSubmit = event => {
    event.preventDefault();
    console.log('submit')
    ChatService.login(this.state.url, this.state.username, this.state.password).then(
      res => {
        this.props.afterLogin(true)
      },
      err => {
        alert(err)
      }
    )
  };

  onChange = event => {
    console.log(event)
    this.setState({ [event.target.id]: event.target.value });
  };

  render() {
    return (
      <Dialog open>
        <DialogTitle>Enter Server URL to login</DialogTitle>
        <div className="login-modal">
          <form onSubmit={this.onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="url"
              label="URL"
              autoFocus
              defaultValue={this.state.url}
              onChange = {this.onChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              defaultValue={this.state.username}
              onChange = {this.onChange}
            />
            <br/>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              defaultValue={this.state.password}
              onChange = {this.onChange}
            />
            <br/>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              LOGIN
            </Button>
          </form>
        </div>
      </Dialog>
    )
  }
}

export default Login;
