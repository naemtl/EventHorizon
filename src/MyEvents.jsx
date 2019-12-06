import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedMyEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render = () => {
    return (
      <div>
        <h3>Events I'm Hosting</h3>
        <div>
          <EventsImHosting />
        </div>
        <h3>My Saved Events</h3>
        <div>
          <MySavedEvents />
        </div>
        <h3>Hosts I'm Following</h3>
        <div>
          <FollowedUsers />
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
