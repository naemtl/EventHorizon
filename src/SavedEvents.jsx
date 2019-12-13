import React, { Component } from "react";
import { connect } from "react-redux";
import EventCard from "./EventCard.jsx";

class UnconnectSavedEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  componentDidMount = async () => {
    let data = new FormData();
    data.append("userId", this.props.user._id);
    let response = await fetch("/saved-events", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed resp from saved-events endpoint", parsed);

    if (parsed.success) {
      this.setState({ events: parsed.events });
      return;
    }
  };

  render = () => {
    console.log("SAVED EVENTS STATE", this.state.events);

    return (
      <div className="ehorizon-grid">
        {this.state.events.map(event => {
          return <EventCard event={event} />;
        })}
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

let SavedEvents = connect(mapStateToProps)(UnconnectSavedEvents);

export default SavedEvents;
