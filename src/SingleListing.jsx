import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import EditSingleListing from "./EditSingleListing.jsx";
import * as dateformat from "dateformat";

import "./styles/single-listing.css";

class UnconnectedSingleListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      eventHost: undefined,
      displayEventControls: false
    };
  }

  componentDidMount = async () => {
    console.log("Did you mount?");
    await this.getSingleEvent();
    this.getEventHost();
  };

  getSingleEvent = async () => {
    let data = new FormData();
    console.log("EVENT ID PROP", this.props.id);

    data.append("eventId", this.props.id);
    let response = await fetch("/render-single-event", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (parsed.success) {
      console.log("Parsed resp from single-event endpoint: ", parsed.event);
      this.setState({ event: parsed.event });
      return;
    }
    console.log("Could not get single-event");
  };

  getEventHost = async () => {
    console.log("THIS PROPS HOSTS", this.props.hosts);
    console.log("THIS STATE EVENT", this.state.event);

    // here

    let response = await fetch("/get-event-hosts", {
      method: "POST"
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed res from get-event-hosts", parsed);

    if (parsed.success) {
      let eventHost = parsed.hosts.find(host => {
        console.log("value of host and event: ", this.state.event, host);

        return this.state.event.hostId === host;
      });
      console.log("Value of eventHost: ", eventHost);
      this.setState({ eventHost: eventHost });
      return;
    }
    window.alert("Something went wrong");
  };

  showSaveEventButton = () => {
    if (
      this.props.isLoggedIn &&
      this.props.user._id !== this.state.eventHost._id
    ) {
      if (this.props.user.savedEvents.includes(this.state.event._id)) {
        return (
          <button
            className="single-listing-button"
            onClick={this.discardSavedEvent}
          >
            Discard
          </button>
        );
      }
      console.log("After save button");
      return (
        <button className="single-listing-button" onClick={this.saveEvent}>
          Save
        </button>
      );
    }
  };

  getUpdatedUser = async data => {
    let userResponse = await fetch("/render-user", {
      method: "POST",
      body: data
    });
    let userResponseBody = await userResponse.text();
    let userParsed = JSON.parse(userResponseBody);
    this.props.dispatch({ type: "update-user", user: userParsed.user });
  };

  saveEvent = async () => {
    let data = new FormData();
    data.append("_id", this.props.user._id);
    data.append("eventId", this.state.event._id);
    let response = await fetch("/save-event", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed resp from save-event endpoint: ", parsed);
    if (parsed.success) {
      window.alert("Event saved");
      this.getUpdatedUser(data);
      return;
    }
    window.alert("Could not complete action");
  };

  discardSavedEvent = async () => {
    let data = new FormData();
    data.append("_id", this.props.user._id);
    data.append("eventId", this.state.event._id);
    let response = await fetch("/discard-saved-event", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (parsed.success) {
      // this.props.dispatch({ type: "update-user", user: parsed.user });
      window.alert("Event discarded successfully");
      this.getUpdatedUser(data);
      return;
    }
    window.alert("Could not discard event save");
  };

  displayEventControls = () => {
    console.log("DOIT");
    this.setState({ displayEventControls: !this.state.displayEventControls });
  };

  displayEditButton = () => {
    if (this.props.isLoggedIn) {
      if (
        this.props.user._id === this.state.eventHost._id ||
        this.props.user.isAdmin
      ) {
        return (
          <button
            className="single-listing-button"
            onClick={this.displayEventControls}
          >
            Edit
          </button>
        );
      }
    }
  };

  // FIXME: PASS METHOD AS PROP

  getUpdatedEvent = updatedEvent => {
    this.setState({ ...this.state, event: updatedEvent });
  };

  render = () => {
    let eventControls = undefined;
    if (this.state.displayEventControls) {
      eventControls = (
        <EditSingleListing
          event={this.state.event}
          getUpdatedEvent={this.getUpdatedEvent}
        />
      );
    }
    if (this.state.eventHost === undefined) {
      console.log("Loading block");

      return <div>Loading...</div>;
    }
    return (
      <div className="header-margin">
        <div className="single-listing-container">
          <div className="single-listing-head">
            <img
              className="single-listing-banner"
              src={this.state.event.banner}
              alt="event banner"
            />
            <h3 className="single-listing-title listing-info">
              {this.state.event.title}
            </h3>
            {this.showSaveEventButton()}
            {this.displayEditButton()}
          </div>
          <div className="single-listing-host listing-info">
            Hosted by{" "}
            <Link to={"/user/" + this.state.event.hostId}>
              {this.state.eventHost.username}
            </Link>
          </div>
          <div className="single-listing-desc listing-info">
            Taking place at {this.state.event.location} in{" "}
            {this.state.event.city} on{" "}
            {dateformat(
              this.state.event.startDateTime,
              'dddd, mmmm dS "-" h:MM TT'
            )}
          </div>
          <div className="single-listing-desc listing-info">
            <pre>{this.state.event.description}</pre>
          </div>
          {eventControls}
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    isLoggedIn: state.loggedIn,
    hosts: state.hosts,
    user: state.user
  };
};
let SingleListing = connect(mapStateToProps)(UnconnectedSingleListing);

export default SingleListing;
