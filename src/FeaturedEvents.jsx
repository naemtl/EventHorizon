import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import EventCard from "./EventCard.jsx";

class UnconnectedLatestEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  componentDidMount = async () => {
    let response = await fetch("/render-featured-events", {
      method: "POST"
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed res from render-featured-events endpoint", parsed);
    if (!parsed.success) {
      window.alert("Could not render events");
      return;
    }
    this.props.dispatch({ type: "get-hosts", hosts: parsed.hosts });
    this.setState({ events: parsed.featuredEvents });
  };

  // only display events that are upcoming, events that have passed will be displayed for 24h before being filtered out of the display.

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
    user: state.user
  };
};

let LatestEvents = connect(mapStateToProps)(UnconnectedLatestEvents);

export default LatestEvents;
