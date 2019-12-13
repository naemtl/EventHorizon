import React, { Component } from "react";
import { connect } from "react-redux";
import EventCard from "./EventCard.jsx";

class UnconnectedPreferredHostEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      username: ""
    };
  }

  componentDidMount = async () => {
    await this.getHostUsername();
    this.getHostEvents();
  };

  getHostUsername = async () => {
    let data = new FormData();
    data.append("_id", this.props.hostId);
    let response = await fetch("/render-user", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("Parsed resp from render-username: ", parsed);

    if (parsed.success) {
      this.setState({ username: parsed.user.username });
      return;
    }
    window.alert("Could not get followed host's username");
  };

  getHostEvents = async () => {
    let data = new FormData();
    //console.log("host! :", this.props.hostId);
    data.append("userId", this.props.hostId);
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
    window.alert("Could not retrieve followed host's events");
  };

  render = () => {
    if (!this.props.autologinDone) {
      return <h4>Loading...</h4>;
    }
    return (
      <div>
        <h3>{this.state.username}</h3>
        <div className="ehorizon-grid">
          {this.state.events.map(event => {
            return <EventCard event={event} />;
          })}
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    autologinDone: state.autologinDone
  };
};

let PreferredHostEvents = connect(mapStateToProps)(
  UnconnectedPreferredHostEvents
);

export default PreferredHostEvents;
