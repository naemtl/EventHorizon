import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter, Redirect } from "react-router-dom";

import "./styles/signup-login.css";

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
    this.props.dispatch({ type: "login-success", user: this.state.user });
    this.props.history.push("/");
  };

  render = () => {
    if (this.props.isLoggedIn) {
      return <Redirect to="/" />;
    }
    return (
      <div className="header-margin">
        <div className="form-container">
          <h2>Log in below</h2>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="logUsername">Username</label>
            <input
              className="form-text-input"
              placeholder="Username"
              id="logUsername"
              type="text"
              value={this.state.username}
              onChange={this.handleUsernameChange}
            />
            <label htmlFor="logPassword">Password</label>
            <input
              className="form-text-input"
              placeholder="Password"
              id="logPassword"
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
            <input className="form-submit-button" type="submit" />
          </form>
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    isLoggedIn: state.loggedIn
  };
};

let Login = connect(mapStateToProps)(withRouter(UnconnectedLogin));

export default Login;
