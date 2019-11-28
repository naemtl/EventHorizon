import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedEventCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  componentDidMount = () => {
    this.getAllEvents();
  };

  getAllEvents = async () => {
    let response = await fetch("/render-events", {
      method: "POST"
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed res from render-events endpoint", parsed);
    this.setState({ events: parsed.events });
  };

  render = () => {
    console.log("TEST****************************** COMPONENT");

    return (
      <div className="flex">
        {this.state.events.map(event => {
          return (
            <div>
              <div>{event.title}</div>
              <div>{event.host}</div>
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

let EventCard = connect()(UnconnectedEventCard);

export default EventCard;
