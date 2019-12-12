import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import EventCard from "./EventCard.jsx";

import "./styles/dashboard.css";

class UnconnectedUserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newAvatar: undefined,
      newUsername: "",
      newPassword: "",
      confirmNewPassword: "",
      newEmail: "",
      followedUsers: []
    };
  }

  componentDidMount = async () => {
    let data = new FormData();
    data.append("followedUsers", this.props.user.followUser);
    console.log("followedUsers", this.props.user.followUser);

    let response = await fetch("/render-followed-users", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed res from render-followed-users", parsed);
    if (parsed.success) {
      this.setState({ followedUsers: parsed.users });
      return;
    }
    window.alert("Could not get followed users list");
  };

  renderUser = async () => {
    let dataRenderUser = new FormData();
    dataRenderUser.append("_id", this.props.user._id);
    let responseRenderUser = await fetch("/render-user", {
      method: "POST",
      body: dataRenderUser
    });
    let responseBodyRenderUser = await responseRenderUser.text();
    let parsedRenderUser = JSON.parse(responseBodyRenderUser);
    console.log(
      "parsedRenderUser body of render-user endpoint: ",
      parsedRenderUser
    );
    this.setState({
      newAvatar: undefined,
      newUsername: "",
      newPassword: "",
      confirmNewPassword: "",
      newEmail: ""
    });
    console.log("PARSED USER", parsedRenderUser.user);

    this.props.dispatch({ type: "update-user", user: parsedRenderUser.user });
  };

  newAvatarChangeHandler = event => {
    console.log("new Avatar change input value: ", event.target.files[0]);
    this.setState({ newAvatar: event.target.files[0] });
  };

  newAvatarSubmitHandler = async event => {
    event.preventDefault();
    console.log("Avatar change form submitted");
    let data = new FormData();
    data.append("userId", this.props.user._id);
    data.append("img", this.state.newAvatar);
    let response = await fetch("/update-avatar", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed body from update-avatar endpoint: ", parsed);
    if (parsed.success) {
      this.renderUser();
      window.alert("Avatar updated successfully");
      return;
    }
    window.alert("Something went wrong");
  };

  newUsernameChangeHandler = event => {
    console.log("new username change input value: ", event.target.value);
    this.setState({ newUsername: event.target.value });
  };

  newUsernameSubmitHandler = async event => {
    event.preventDefault();
    console.log("username change form submitted");
    let data = new FormData();
    data.append("userId", this.props.user._id);
    data.append("username", this.state.newUsername);
    let response = await fetch("/update-username", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed body from update-username endpoint: ", parsed);
    if (parsed.success) {
      this.renderUser();
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
    data.append("userId", this.props.user._id);
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
    data.append("userId", this.props.user._id);
    data.append("email", this.state.newEmail);
    let response = await fetch("/update-email", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed response from update-email endpoint", parsed);
    if (parsed.success) {
      this.renderUser();
      window.alert("Email updated successfully");
      return;
    }
    window.alert("Something went wrong");
    console.log("Error from update-email endpoint", parsed.err);
  };

  getFollowedUsers = () => {
    //FIX ME
    if (this.state.followedUsers.length !== 0) {
      return this.state.followedUsers.map(user => {
        return (
          <div className="dashboard-follow-list-item">
            <Link to={"/user/" + user._id}>{user.username}</Link>
          </div>
        );
      });
    }
    return <div>You are not following anyone yet!</div>;
  };

  render = () => {
    if (this.props.user) {
      return (
        <div className="dashboard-container">
          <div>
            <div>Username: {this.props.user.username}</div>
            <div>E-mail: {this.props.user.email}</div>
          </div>
          <h2>Account settings</h2>
          <form onSubmit={this.newAvatarSubmitHandler}>
            <input type="file" onChange={this.newAvatarChangeHandler} />
            <input type="submit" />
          </form>
          <form
            className="dashboard-username"
            onSubmit={this.newUsernameSubmitHandler}
          >
            <input
              type="text"
              onChange={this.newUsernameChangeHandler}
              value={this.state.newUsername}
              placeholder="Update username"
            />
            <input type="submit" />
          </form>
          <form
            className="dashboard-password"
            onSubmit={this.newPasswordSubmitHandler}
          >
            <input
              type="password"
              onChange={this.newPasswordChangeHandler}
              value={this.state.newPassword}
              placeholder="Update password"
            />
            <input
              // className="dashboard-password"
              type="password"
              onChange={this.confirmNewPasswordChangeHandler}
              value={this.state.confirmNewPassword}
              placeholder="Confirm password"
            />
            <input type="submit" />
          </form>
          <form
            className="dashboard-email"
            onSubmit={this.newEmailSubmitHandler}
          >
            <input
              type="email"
              onChange={this.newEmailChangeHandler}
              value={this.state.newEmail}
              placeholder="Update e-mail"
            />
            <input type="submit" />
          </form>
          <div className="dashboard-follow-list-container">
            <h2>Following</h2>
            {this.getFollowedUsers()}
          </div>
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
