import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import EditSingleListing from "./EditSingleListing.jsx";

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

  getEventHost = () => {
    console.log("THIS PROPS HOSTS", this.props.hosts);
    console.log("THIS STATE EVENT", this.state.event);

    let eventHost = this.props.hosts.find(host => {
      console.log("value of host and event: ", this.state.event, host);

      return this.state.event.hostId === host._id;
    });
    console.log("Value of eventHost: ", eventHost);
    this.setState({ eventHost: eventHost });
  };

  showSaveEventButton = () => {
    if (
      this.props.isLoggedIn &&
      this.props.user._id !== this.state.eventHost._id
    ) {
      if (this.props.user.savedEvents.includes(this.state.event._id)) {
        return (
          <div>
            <button onClick={this.discardSavedEvent}>Discard event</button>
          </div>
        );
      }
      console.log("After save button");
      return (
        <div>
          <button onClick={this.saveEvent}>Save event</button>
        </div>
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
    if (
      this.props.isLoggedIn &&
      this.props.user._id === this.state.eventHost._id
    ) {
      return (
        <div>
          <button onClick={this.displayEventControls}>Edit event</button>
        </div>
      );
    }
  };

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
      <div>
        <div>
          <Link to={"/user/" + this.state.event.hostId}>
            {this.state.eventHost.username}
          </Link>
        </div>
        <div>{this.state.event.title}</div>
        <div>{this.state.event.description}</div>
        {this.showSaveEventButton()}
        {this.displayEditButton()}
        {eventControls}
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
