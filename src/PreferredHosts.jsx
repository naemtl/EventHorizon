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

  render = () => {
    return (
      <div>
        <h2>Hosts I'm Following</h2>
        <div>
          {this.state.followedHosts.map(host => {
            return (
              <div className="collection">
                <PreferredHostEvents hostId={host} />
              </div>
            );
          })}
        </div>
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

let MyEvents = connect(mapStateToProps)(UnconnectedMyEvents);

export default MyEvents;
