import React from 'react';
import ChatService from '../services/ChatService'

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      message: '',
      userList: [],
      messageList: []
    };
    ChatService.listen(this.onDataUpdate, this.onDisconnect)
  }

  scrollToBottom = () => {
    console.log('scrollToBottom')
     setTimeout(() => {
       this.messageEnd && this.messagesEnd.scrollIntoView({ behavior: "auto" })
     }, 0)
  }
  onDataUpdate = data => {
    // console.log('[ChatWindow] onDataUpdate:', data)
    this.setState({
      userList: data.userList,
      messageList: data.messageList
    })
    if (data.messageList) {
      this.scrollToBottom()
    }
  }
  onDisconnect = () => {
    this.props.onDisconnect()
  }

  onInputChange = event => {
    this.setState({ message: event.target.value })
  }
  onSend = event => {
    event.preventDefault();

    ChatService.send(this.state.message).then(
      res => {
        this.setState({message: ''})
      }
    )
  }

  render() {
    function Item(props) {
      let item = props.item
      if (item.type == 'status') {
        return (
          <li className="status-item">
              <p className="time">{item.time} </p>
              <p className="message">{item.status}</p>
          </li>
         )
      } else {
        return (
          <li className="item">
            <p className="time">{item.time} {item.user}:</p>
            <p className="message">{item.msg}</p>
          </li>
        )
      }
    }

    return (
      <div className="chat-window">
        <div className="left">
          <div className="top">
            <ul className="message-list">
              {this.state.messageList.map((item, index) => (
                <Item key={index} item={item} />
              ))}
              <div style={{ float:"left", clear: "both" }}
               ref={(el) => { this.messagesEnd = el; }}>
              </div>
            </ul>
          </div>
          <div className="bottom">
            <form className="input-form" onSubmit={this.onSend}>
              <input 
                name="message"
                type="text"
                onChange={this.onInputChange}
                value={this.state.message}
              />
              <button type="submit">send</button>
            </form>
          </div>
        </div>
        <div className="right">
          <ul className="user-list">
            {this.state.userList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default ChatWindow;
