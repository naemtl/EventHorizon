import React, { Component } from "react";
import { connect } from "react-redux";
import EventCard from "./EventCard.jsx";

class UnconnectedSearchEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
  }

  componentWillMount = async () => {
    let data = new FormData();
    data.append("category", this.props.category);
    let response = await fetch("/sort-category", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed resp from sort-category endpoint: ", parsed);
    if (parsed.success) {
      this.setState({ results: parsed.events });
      return;
    }
    window.alert("Could not render events with desired category");
  };

  displayResults = () => {
    if (this.state.results.length !== 0) {
      return this.state.results.map(event => {
        return <EventCard event={event} />;
      });
    }
    return <div>No events of this nature at this time</div>;
  };

  displayCategoryHeader = () => {
    let reformated = this.props.category.replace("-", "/").toUpperCase();

    return reformated;
  };

  render = () => {
    return (
      <div>
        <h3>{this.displayCategoryHeader()}</h3>
        <div className="flex flex-wrap">{this.displayResults()}</div>
      </div>
    );
  };
}

let SearchEvents = connect()(UnconnectedSearchEvents);

export default SearchEvents;
