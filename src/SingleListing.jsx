import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedSingleListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {}
    };
  }

  componentDidMount = async () => {
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

  render = () => {
    return (
      <div>
        <div>{this.state.event.title}</div>
        <div>{this.state.event.description}</div>
      </div>
    );
  };
}

let SingleListing = connect()(UnconnectedSingleListing);

export default SingleListing;
