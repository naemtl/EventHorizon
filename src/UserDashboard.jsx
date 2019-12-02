import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class UnconnectedUserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUsername: "",
      newPassword: "",
      confirmNewPassword: "",
      newEmail: ""
    };
  }

  newUsernameChangeHandler = event => {
    console.log("new username change input value: ", event.target.value);
    this.setState({ newUsername: event.target.value });
  };

  newUsernameSubmitHandler = async event => {
    event.preventDefault();
    console.log("username change form submitted");
    let data = new FormData();
    data.append("userId", this.props.user.userId);
    data.append("username", this.state.newUsername);
    let response = await fetch("/update-username", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed body from update-username endpoint: ", parsed);
    if (parsed.success) {
      this.setState({ newUsername: "" });
      window.alert("Username updated successfully");
      return;
    }
    window.alert("Something went wrong");
  };

  newPasswordChangeHandler = event => {
    console.log("new password change input value: ", event.target.value);
    this.setState({ newPassword: event.target.value });
  };

  confirmNewPasswordChangeHandler = event => {
    console.log(
      "new confirm password change input value: ",
      event.target.value
    );
    this.setState({ confirmNewPassword: event.target.value });
  };

  newPasswordSubmitHandler = async event => {
    event.preventDefault();
    console.log("password change form submitted");
    if (this.state.newPassword !== this.state.confirmNewPassword) {
      window.alert("Password fields do not match");
      this.setState({ newPassword: "", confirmNewPassword: "" });
      return;
    }
    let data = new FormData();
    data.append("userId", this.props.user.userId);
    data.append("password", this.state.newPassword);
    let response = await fetch("/update-password", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed response from update-password endpoint", parsed);
    if (parsed.success) {
      this.setState({ newPassword: "", confirmNewPassword: "" });
      window.alert("Password updated successfully");
      return;
    }
    window.alert("Something went wrong");
    console.log("Error from update-password endpoint", parsed.err);
  };

  newEmailChangeHandler = event => {
    console.log("new email change input value: ", event.target.value);
    this.setState({ newEmail: event.target.value });
  };

  newEmailSubmitHandler = async event => {
    event.preventDefault();
    console.log("email change form submitted");
    let data = new FormData();
    data.append("userId", this.props.user.userId);
    data.append("email", this.state.newEmail);
    let response = await fetch("/update-email", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed response from update-email endpoint", parsed);
    if (parsed.success) {
      this.setState({ newEmail: "" });
      window.alert("Email updated successfully");
      return;
    }
    window.alert("Something went wrong");
    console.log("Error from update-email endpoint", parsed.err);
  };

  render = () => {
    if (this.props.user) {
      return (
        <div>
          <div>
            <div>{this.props.user.username}</div>
            <div>{this.props.user.email}</div>
            <div>{this.props.user.accountType}</div>
            <div>My preferred categories:</div>
            <div>{this.props.user.myCategories.join(", ")}</div>
            <div>{this.props.user.blockUser}</div>
            <div>{this.props.user.friendsList}</div>
          </div>
          <div>Change username</div>
          <form onSubmit={this.newUsernameSubmitHandler}>
            <input
              type="text"
              onChange={this.newUsernameChangeHandler}
              value={this.state.newUsername}
              placeholder="Enter a new username"
            />
            <input type="submit" />
          </form>
          <div>Change password</div>
          <form onSubmit={this.newPasswordSubmitHandler}>
            <input
              type="password"
              onChange={this.newPasswordChangeHandler}
              value={this.state.newPassword}
              placeholder="Enter a new password"
            />
            <input
              type="password"
              onChange={this.confirmNewPasswordChangeHandler}
              value={this.state.confirmNewPassword}
              placeholder="Confirm password"
            />
            <input type="submit" />
          </form>
          <div>Change email</div>
          <form onSubmit={this.newEmailSubmitHandler}>
            <input
              type="email"
              onChange={this.newEmailChangeHandler}
              value={this.state.newEmail}
              placeholder="Enter a new email"
            />
            <input type="submit" />
          </form>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  };
}

let mapStateToProps = state => {
  return {
    user: state.user
  };
};

let UserProfile = connect(mapStateToProps)(UnconnectedUserProfile);

export default UserProfile;
