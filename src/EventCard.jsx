import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class UnconnectedEventCard extends Component {
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
    this.setState({ events: parsed.events });
  };

  // TODO: pass entire user object here when you can.
  // store all users who own events in the store and access them

  render = () => {
    console.log("TEST****************************** COMPONENT");

    return (
      <div className="flex">
        {this.state.events.map(event => {
          return (
            <div className="card-padding">
              <div>{event.title}</div>
              <div>
                <Link to={"/user/" + event.hostId}>{event.hostId}</Link>
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
