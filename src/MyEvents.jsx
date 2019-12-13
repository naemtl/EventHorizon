import React, { Component } from "react";
import { connect } from "react-redux";
import EventsImHosting from "./EventsImHosting.jsx";
import SavedEvents from "./SavedEvents.jsx";

class UnconnectedMyEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render = () => {
    return (
      <div className="container">
        <div className="collection">
          <h2>Events I'm Hosting</h2>
          <div>
            <EventsImHosting />
          </div>
        </div>
        <div className="collection">
          <h2>My Saved Events</h2>
          <div>
            <SavedEvents />
          </div>
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
