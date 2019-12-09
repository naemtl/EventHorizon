import React, { Component } from "react";
import { connect } from "react-redux";
import EventCard from "./EventCard.jsx";

class UnconnectedPreferredHostEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  // TODO: I'm reusing a component down here: hosting-event. Should I?
  // I need to get the host's id and their username, the latter to display on this page.

  componentDidMount = async () => {
    let data = new FormData();
    //console.log("host! :", this.props.host);
    data.append("userId", this.props.host);
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
    return (
      <div>
        {this.state.events.map(event => {
          return <EventCard event={event} />;
        })}
      </div>
    );
  };
}

let PreferredHostEvents = connect()(UnconnectedPreferredHostEvents);

export default PreferredHostEvents;
