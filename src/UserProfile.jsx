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
    data.append("uid", this.props.id);
    let response = await fetch("/render-user", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed body of render-user endpoint: ", parsed);

    this.setState({ viewedUser: parsed.user });
  };

  render = () => {
    return (
      <div>
        <div>{this.state.viewedUser.username}</div>
        <div></div>
        <div>Send a message to this user</div>
      </div>
    );
  };
}

let UserProfile = connect()(UnconnectedUserProfile);

export default UserProfile;
