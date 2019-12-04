import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedUserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewedUser: {}
    };
  }

  componentDidMount = async () => {
    let data = new FormData();
    data.append("_id", this.props.id);
    let response = await fetch("/render-user", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed body of render-user endpoint: ", parsed);

    this.setState({ viewedUser: parsed.user });
  };

  followUser = async () => {
    let data = new FormData();
    data.append("userId", this.props.user._id);
    data.append("followUser", this.state.viewedUser.username);
    let response = await fetch("/follow-user", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (parsed.success) {
      window.alert("You are now following " + this.state.viewedUser.username);
      return;
    }
    window.alert("Error");
  };

  blockUser = async () => {
    let data = new FormData();
    data.append("userId", this.props.user._id);
    data.append("blockUser", this.state.viewedUser.username);
    let response = await fetch("/block-user", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (parsed.success) {
      window.alert("You are now blocking " + this.state.viewedUser.username);
      return;
    }
    window.alert("Error");
  };

  render = () => {
    return (
      <div>
        <div>{this.state.viewedUser.username}</div>
        <div>{this.state.viewedUser.province}</div>
        <div>{this.state.viewedUser.email}</div>
        <div>Send a message to this user</div>
        <div>
          <button onClick={this.followUser}>Follow user</button>
        </div>
        <div>
          <button onClick={this.blockUser}>Block user</button>
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    user: state.user
  };
};

let UserProfile = connect(mapStateToProps)(UnconnectedUserProfile);

export default UserProfile;
