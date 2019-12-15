import React, { Component } from "react";
import { connect } from "react-redux";
import PreferredHostEvents from "./PreferredHostEvents.jsx";

class UnconnectedMyEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followedHosts: []
    };
  }

  componentDidMount = async () => {
    let data = new FormData();
    data.append("userId", this.props.user._id);
    let response = await fetch("/followed-hosts", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("Parsed resp from followed-hosts endpoint: ", parsed);
    if (parsed.success) {
      this.setState({ followedHosts: parsed.hosts });
      return;
    }
    window.alert("Could not get followed hosts");
  };

  displayFollowedHosts = () => {
    if (this.state.followedHosts.length !== 0) {
      this.state.followedHosts.map(host => {
        return (
          <div className="collection">
            <PreferredHostEvents hostId={host} />
          </div>
        );
      });
    } else {
      return <div>You are not following any hosts</div>;
    }
  };

  render = () => {
    if (!this.props.autologinDone) {
      return (
        <div className="container header-margin">
          <h4>Loading...</h4>
        </div>
      );
    }
    return (
      <div className="container header-margin">
        <h2>Hosts I'm Following</h2>
        <div>{this.displayFollowedHosts()}</div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    isLoggedIn: state.loggedIn,
    autologinDone: state.autologinDone,
    user: state.user
  };
};

let MyEvents = connect(mapStateToProps)(UnconnectedMyEvents);

export default MyEvents;
