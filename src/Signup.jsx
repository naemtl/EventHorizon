import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      province: "Quebec",
      accountType: ""
    };
  }

  handleUsernameChange = event => {
    console.log("new username input change: ", event.target.value);
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = event => {
    console.log("new password input change: ", event.target.value);
    this.setState({ password: event.target.value });
  };

  handleEmailChange = event => {
    console.log("new email input change: ", event.target.value);
    this.setState({ email: event.target.value });
  };

  handleAccountType = event => {
    console.log("new account type: ", event.target.value);
    this.setState({ accountType: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    console.log("new signup submission");
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    data.append("email", this.state.email);
    data.append("province", this.state.province);
    data.append("accountType", this.state.accountType);
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
    return (
      <div>
        <h2>Sign up below</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="signUsername">Username</label>
          <input
            id="signUsername"
            type="text"
            value={this.state.username}
            onChange={this.handleUsernameChange}
            required
          />
          <label htmlFor="signPassword">Password</label>
          <input
            id="signPassword"
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            required
          />
          <label htmlFor="signEmail">Email</label>
          <input
            id="signEmail"
            type="email"
            value={this.state.email}
            onChange={this.handleEmailChange}
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
          <span>Account Type: </span>
          <label htmlFor="standardAccountType">Standard</label>
          <input
            id="standardAccountType"
            type="radio"
            value="Standard"
            name="account-type"
            onClick={this.handleAccountType}
            required
          />
          <label htmlFor="businessAccountType">Business</label>
          <input
            id="businessAccountType"
            type="radio"
            value="Business"
            name="account-type"
            onClick={this.handleAccountType}
            required
          />
          <input type="submit" />
        </form>
      </div>
    );
  };
}

let Signup = connect()(withRouter(UnconnectedSignup));

export default Signup;
