import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";

import "./styles/signup-login.css";

class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      province: "Quebec",
      avatar: undefined
    };
  }

  usernameChangeHandler = event => {
    console.log("new username input change: ", event.target.value);
    this.setState({ username: event.target.value });
  };

  passwordChangeHandler = event => {
    console.log("new password input change: ", event.target.value);
    this.setState({ password: event.target.value });
  };
  confirmPasswordChangeHandler = event => {
    console.log("new confirm password input change: ", event.target.value);
    this.setState({ confirmPassword: event.target.value });
  };

  emailChangeHandler = event => {
    console.log("new email input change: ", event.target.value);
    this.setState({ email: event.target.value });
  };

  avatarChangeHandler = event => {
    console.log("new avatar file: ", event.target.files[0]);
    this.setState({ avatar: event.target.files[0] });
  };

  handleSubmit = async event => {
    event.preventDefault();
    console.log("new signup submission");
    if (this.state.password !== this.state.confirmPassword) {
      window.alert("Your password fields must match");
      this.setState({ password: "", confirmPassword: "" });
      return;
    }
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    data.append("email", this.state.email);
    data.append("province", this.state.province);
    data.append("img", this.state.avatar);
    // data.append("myCategories", JSON.stringify(this.state.myCategories));
    console.log("Singup FormData: ", data);
    let response = await fetch("/signup", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("Parsed responsebody from signup endpoint: ", parsed);
    if (!parsed.success) {
      window.alert("Username in use");
      return;
    }
    window.alert("Signup successful");
    this.props.dispatch({
      type: "login-success",
      user: parsed.user
    });
    this.props.history.push("/");
  };

  render = () => {
    if (this.props.isLoggedIn) {
      return <Redirect to="/" />;
    }
    return (
      <div className="header-margin">
        <div className="logsign-container">
          <h2>Sign up below</h2>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="signUsername">Username</label>
            <input
              id="signUsername"
              type="text"
              value={this.state.username}
              onChange={this.usernameChangeHandler}
              required
            />
            <label htmlFor="signPassword">Password</label>
            <input
              id="signPassword"
              type="password"
              value={this.state.password}
              onChange={this.passwordChangeHandler}
              placeholder="Enter a password"
              required
            />
            <input
              id="signPassword"
              type="password"
              value={this.state.confirmPassword}
              onChange={this.confirmPasswordChangeHandler}
              placeholder="Confirm password"
              required
            />
            <label htmlFor="signEmail">Email</label>
            <input
              id="signEmail"
              type="email"
              value={this.state.email}
              onChange={this.emailChangeHandler}
              required
            />
            <label htmlFor="signProvince">Province</label>
            <input
              id="signProvince"
              type="text"
              value={this.state.province}
              required
              disabled
            />
            <label for="signAvatar">Avatar</label>
            <input
              id="signAvatar"
              type="file"
              onChange={this.avatarChangeHandler}
            />
            <input type="submit" />
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

let Signup = connect(mapStateToProps)(withRouter(UnconnectedSignup));

export default Signup;
