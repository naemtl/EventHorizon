import React, { Component } from "react";
import { connect } from "react-redux";
import EventCard from "./EventCard.jsx";
import { options } from "./ReactSelectConfig.js";

class UnconnectedSearchEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: []
    };
  }

  componentDidMount = () => {
    this.eventsByCategory();
  };

  componentDidUpdate = prevProps => {
    if (prevProps.category !== this.props.category) {
      this.eventsByCategory();
    }
  };

  eventsByCategory = async () => {
    let data = new FormData();
    data.append("category", this.props.category);
    data.append("options", JSON.stringify(options));
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
    } else {
      window.alert("Could not render events with desired category");
    }
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
    let chosenCategory = options.filter(option => {
      return option.value === this.props.category;
    });
    console.log("chosenCategory", chosenCategory);

    let reformated = chosenCategory[0].label;
    return reformated;
  };

  render = () => {
    return (
      <div>
        <h2>{this.displayCategoryHeader()}</h2>
        <div className="flex flex-wrap">{this.displayResults()}</div>
      </div>
    );
  };
}

let SearchEvents = connect()(UnconnectedSearchEvents);

export default SearchEvents;
