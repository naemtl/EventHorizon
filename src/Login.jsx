import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleUsernameChange = event => {
    console.log("new login username input change: ", event.target.value);
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = event => {
    console.log("new login password input change: ", event.target.value);
    this.setState({ password: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    let data = new FormData();
  };

  render = () => {
    return (
      <div>
        <h2>Log in below</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="logUsername">Username</label>
          <input
            id="logUsername"
            type="text"
            value={this.state.username}
            onChange={this.handleUsernameChange}
          />
          <label htmlFor="logPassword">Password</label>
          <input
            id="logPassword"
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
          <input type="submit" />
        </form>
      </div>
    );
  };
}

let Login = connect()(UnconnectedLogin);

export default Login;
