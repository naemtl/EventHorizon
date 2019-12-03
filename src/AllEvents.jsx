import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import EventCard from "./EventCard.jsx";

class UnconnectedAllEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  componentDidMount = async () => {
    let response = await fetch("/render-events", {
      method: "POST"
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed res from render-events endpoint", parsed);
    if (!parsed.success) {
      window.alert("Could not render events");
      return;
    }
    this.props.dispatch({ type: "get-hosts", hosts: parsed.hosts });
    this.setState({ events: parsed.events });
  };

  // TODO: pass entire user object here when you can.
  // store all users who own events in the store and access them <div>{event.date}</div><div>{event.time}</div>

  render = () => {
    return (
      <div className="flex flex-wrap">
        {this.state.events.map(event => {
          console.log("STATE: ", this.state);

          return <EventCard event={event} />;
        })}
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    user: state.user
  };
};

let AllEvents = connect(mapStateToProps)(UnconnectedAllEvents);

export default AllEvents;
