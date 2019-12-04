import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class UnconnectedSingleListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      eventHost: {}
    };
  }

  componentDidMount = async () => {
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
    if (this.props.user._id !== this.state.eventHost._id) {
      return (
        <div>
          <button onClick={this.saveEvent()}>Save event</button>
        </div>
      );
    }
  };

  saveEvent = async () => {
    let data = new FormData();
    data.append("userId", this.props.user._id);
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
      return;
    }
    window.alert("Could not complete action");
  };

  render = () => {
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
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    hosts: state.hosts,
    user: state.user
  };
};
let SingleListing = connect(mapStateToProps)(UnconnectedSingleListing);

export default SingleListing;
