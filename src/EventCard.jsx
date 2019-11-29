import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class UnconnectedEventCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      hosts: []
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
    this.setState({ events: parsed.events, hosts: parsed.hosts });
  };

  // TODO: pass entire user object here when you can.
  // store all users who own events in the store and access them

  render = () => {
    console.log("TEST****************************** COMPONENT");

    return (
      <div className="flex">
        {this.state.events.map(event => {
          console.log("STATE: ", this.state);

          let eventHost = this.state.hosts.find(host => {
            console.log("value of host and event: ", event, host);

            return event.hostId === host._id;
          });
          console.log("Value of eventHost: ", eventHost);

          return (
            <div className="card-padding">
              <div>{event.title}</div>
              <div>
                <Link to={"/user/" + event.hostId}>{eventHost.username}</Link>
              </div>
              <div>{event.description}</div>
              <div>{event.date}</div>
              <div>{event.time}</div>
              <div>{event.location}</div>
              <div>{event.city}</div>
            </div>
          );
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

let EventCard = connect(mapStateToProps)(UnconnectedEventCard);

export default EventCard;
