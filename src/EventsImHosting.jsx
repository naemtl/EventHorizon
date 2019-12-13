import React, { Component } from "react";
import { connect } from "react-redux";
import EventCard from "./EventCard.jsx";

class UnconnectEventsImHosting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }
  componentDidMount = async () => {
    let data = new FormData();
    console.log("user from props", this.props.user);

    data.append("userId", this.props.user._id);
    let response = await fetch("/hosting-event", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed resp from hosting-event endpoint", parsed);

    if (parsed.success) {
      this.setState({ events: parsed.events });
      return;
    }
  };

  getUpcomingEvents = () => {
    let upcomingEvents = this.state.events.filter(event => {
      return parseInt(event.startDateTime) > Date.now() - 86400000;
    });
    return upcomingEvents.map(event => {
      return <EventCard event={event} />;
    });
  };

  render = () => {
    return <div className="ehorizon-grid">{this.getUpcomingEvents()}</div>;
  };
}

let mapStateToProps = state => {
  return {
    isLoggedIn: state.loggedIn,
    user: state.user
  };
};

let EventsImHosting = connect(mapStateToProps)(UnconnectEventsImHosting);

export default EventsImHosting;
