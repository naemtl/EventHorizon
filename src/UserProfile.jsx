import React, { Component } from "react";
import { connect } from "react-redux";
import EventCard from "./EventCard.jsx";

import "./styles/profile.css";

class UnconnectedUserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewedUser: {},
      events: []
    };
  }

  componentDidMount = async () => {
    await this.getViewedUserProfile();
    this.getViewedUserEvents();
  };

  getViewedUserProfile = async () => {
    let data = new FormData();
    data.append("_id", this.props.id);
    let response = await fetch("/render-user", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed body of render-user endpoint: ", parsed);

    if (parsed.success) {
      this.setState({ viewedUser: parsed.user });
      return;
    }
    window.alert("Could not find user's profile");
  };

  getViewedUserEvents = async () => {
    let data = new FormData();
    data.append("userId", this.state.viewedUser._id);
    let response = await fetch("/hosting-event", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed res from hosting-event endpoint: ", parsed);
    if (parsed.success) {
      this.setState({ events: parsed.events });
      return;
    }
    window.alert("Could not retrieve viewed user's events");
  };

  showFollowUserButton = () => {
    if (
      this.props.isLoggedIn &&
      this.props.user._id !== this.state.viewedUser._id &&
      !this.props.user.blockUser.includes(this.state.viewedUser._id)
    ) {
      if (this.props.user.followUser.includes(this.state.viewedUser._id)) {
        return (
          <div>
            <button onClick={this.unfollowUser}>Unfollow</button>
          </div>
        );
      }
      return <button onClick={this.followUser}>Follow</button>;
    }
  };

  showBlockUserButton = () => {
    if (
      this.props.isLoggedIn &&
      this.props.user._id !== this.state.viewedUser._id
    ) {
      if (this.props.user.blockUser.includes(this.state.viewedUser._id)) {
        return (
          <div>
            <button onClick={this.unblockUser}>Unblock</button>
          </div>
        );
      }
      return <button onClick={this.blockUser}>Block</button>;
    }
  };

  followUser = async () => {
    let data = new FormData();
    data.append("_id", this.props.user._id);
    data.append("followUserId", this.state.viewedUser._id);
    let response = await fetch("/follow-user", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (parsed.success) {
      window.alert("Follow successful");
      this.getUpdatedUser(data);
      return;
    }
    window.alert("Error");
  };

  unfollowUser = async () => {
    let data = new FormData();
    data.append("_id", this.props.user._id);
    data.append("followUserId", this.state.viewedUser._id);
    let response = await fetch("/unfollow-user", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (parsed.success) {
      window.alert("Unfollow successful");
      this.getUpdatedUser(data);
      return;
    }
    window.alert("Error");
  };

  blockUser = async () => {
    let data = new FormData();
    data.append("_id", this.props.user._id);
    data.append("blockUserId", this.state.viewedUser._id);
    let response = await fetch("/block-user", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (parsed.success) {
      window.alert("Block successful");
      this.getUpdatedUser(data);
      return;
    }
    window.alert("Error");
  };

  unblockUser = async () => {
    let data = new FormData();
    data.append("_id", this.props.user._id);
    data.append("blockUserId", this.state.viewedUser._id);
    let response = await fetch("/unblock-user", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (parsed.success) {
      window.alert("Unblock successful");
      this.getUpdatedUser(data);
      return;
    }
    window.alert("Error");
  };

  getUpdatedUser = async data => {
    let response = await fetch("/render-user", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    this.props.dispatch({ type: "update-user", user: parsed.user });
  };

  displayViewedUserEvents = () => {
    if (this.state.events.length !== 0) {
      return (
        <>
          <h3>{this.state.viewedUser.username}'s upcoming events</h3>
          <div className="ehorizon-grid">
            {this.state.events.map(event => {
              return <EventCard event={event} />;
            })}
          </div>
        </>
      );
    }
  };

  render = () => {
    return (
      <div className="header-margin">
        <div className="profile-info-container">
          <div>{this.state.viewedUser.username}</div>
          <div>{this.state.viewedUser.province}</div>
          <div>{this.state.viewedUser.email}</div>
          {this.props.isLoggedIn && (
            <div>
              <div>Send a message to this user</div>
              <div>{this.showFollowUserButton()}</div>
              {/* <div>{this.showBlockUserButton()}</div> */}
            </div>
          )}
        </div>
        {this.displayViewedUserEvents()}
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    isLoggedIn: state.loggedIn,
    user: state.user
  };
};

let UserProfile = connect(mapStateToProps)(UnconnectedUserProfile);

export default UserProfile;
