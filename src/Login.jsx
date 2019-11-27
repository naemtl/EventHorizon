import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      user: undefined
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

  handleSubmit = async event => {
    event.preventDefault();
    console.log("login form submitted");
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    let response = await fetch("/login", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed response from login endpoint: ", parsed);
    if (!parsed.success) {
      window.alert("Log-in failed, check your credentials");
      return;
    }
    console.log("USER ************", parsed.user);

    this.setState({ username: "", password: "", user: parsed.user });
    window.alert("Log-in successful");
    console.log("Log-in successful");
    this.props.dispatch({ type: "login-success", user: this.state.user });
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
