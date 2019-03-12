import { crypto_box_easy, crypto_box_seed_keypair, crypto_box_NONCEBYTES, crypto_box_open_easy, from_base64, from_string, randombytes_buf, to_base64, to_string } from 'libsodium-wrappers';
import 'materialize-css/dist/css/materialize.min.css';
import React, { Component, Fragment } from 'react';
import io from 'socket.io-client';
import './app.component.css';
import Header from './header.component';
import JoinForm from './join-form.component';
import Messages from './messages.component';
import SendForm from './send-form.component';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      joined: false,
      nickName: null,
      keyPair: null,
      roster: [],
      messages: [],
    }

    this.socketIo = null;
    this.handleJoin = this.handleJoin.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleRoster = this.handleRoster.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  render() {
    if (!this.state.joined) {
      return (
        <JoinForm onJoin={this.handleJoin} />
      );
    } else {
      return (
        <Fragment>
          <Header nickName={this.state.nickName} publicKey={this.state.key} onLeave={this.handleLeave} />
          <Messages messages={this.state.messages} />
          <SendForm roster={this.state.roster} onSend={this.handleSend} />
        </Fragment>
      );
    }
  }

  handleJoin(userInfo) {
    console.log(`App.handleJoin > ${JSON.stringify({ userInfo })}`);

    const keyPair = crypto_box_seed_keypair(from_base64(userInfo.seed));
    const key = to_base64(keyPair.publicKey);
    console.log(`App.handleJoin ? ${JSON.stringify({ keyPair, key })}`)

    this.socketIo = io(":3001", {
      query: {
        nickName: userInfo.nickName,
        key,
      }
    });

    this.socketIo.on('message', this.handleMessage);
    this.socketIo.on('roster', this.handleRoster);

    this.setState({
      nickName: userInfo.nickName,
      key,
      keyPair,
      joined: true,
    });
  }

  handleLeave() {
    console.log(`App.handleLeave >`)

    this.socketIo.close();
    this.socketIo = null;

    this.setState({
      joined: false,
      nickName: null,
      key: null,
      keyPair: null,
      roster: [],
      messages: [],
    });
  }

  handleMessage(msg) {
    console.log(`App.handleMessage > ${JSON.stringify({ msg })}`);

    const { sender, senderNickName: nickName, encryptedMsg, nonce } = msg;

    const wireMsg = to_string(
      crypto_box_open_easy(
        from_base64(encryptedMsg),
        from_base64(nonce),
        from_base64(sender),
        this.state.keyPair.privateKey)
    );

    const { body, timestamp } = JSON.parse(wireMsg);

    console.log(`App.handleMessage ? ${JSON.stringify({ body })}`);

    this.setState({
      messages: [...this.state.messages, {
        nickName,
        key: sender,
        body,
        timestamp,
        outgoing: false,
      }]
    });
  }

  handleRoster(roster) {
    console.log(`App.handleRoster > ${JSON.stringify({ roster })}`);

    this.setState({
      roster: roster.filter((item) => item.key !== this.state.key)
    });
  }

  handleSend(msg) {
    const { body, recepient } = msg;
    const nonce = randombytes_buf(crypto_box_NONCEBYTES);
    const timestamp = new Date().getTime();

    const wireMsg = JSON.stringify({
      body,
      timestamp,
    });

    const encryptedMsg = to_base64(
      crypto_box_easy(
        from_string(wireMsg),
        nonce,
        from_base64(recepient),
        this.state.keyPair.privateKey)
    );

    this.socketIo.emit('message', {
      recepient,
      encryptedMsg,
      nonce: to_base64(nonce),
    });

    let nickName = this.state.roster.find((c) => c.key === recepient).nickName;

    this.setState({
      messages: [...this.state.messages, {
        nickName,
        key: recepient,
        body,
        timestamp,
        outgoing: true,
      }]
    })
  }
}
