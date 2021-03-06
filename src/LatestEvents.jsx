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
    console.log("thisprops.user from latest events", this.props.user);
    let response = await fetch("/render-latest-events", {
      method: "POST"
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed res from render-latest-events endpoint", parsed);
    if (!parsed.success) {
      window.alert("Could not render events");
      return;
    }
    this.props.dispatch({ type: "get-hosts", hosts: parsed.hosts });
    this.setState({ events: parsed.notFeaturedEvents });
  };

  // only display events that are upcoming, events that have passed will be displayed for 24h before being filtered out of the display.

  getUpcomingEvents = () => {
    let upcomingEvents = this.state.events.filter(event => {
      return (
        parseInt(event.startDateTime) > Date.now() - 86400000 &&
        parseInt(event.endDateTime) < Date.now() + 604800000
      );
    });
    if (upcomingEvents.length === 0) {
      return (
        <div className="no-events-message">
          There are no upcoming events at this time
        </div>
      );
    }
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
