import React, { Component } from "react";
import { connect } from "react-redux";
import EventCard from "./EventCard.jsx";

class UnconnectedSearchEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleSearch: "",
      locationSearch: "",
      results: []
    };
  }

  titleSearchChangeHandler = event => {
    console.log("title search input: ", event.target.value);
    this.setState({ titleSearch: event.target.value });
  };

  titleSearchSubmit = async event => {
    event.preventDefault();
    if (this.state.titleSearch === "" || this.state.titleSearch === " ") {
      window.alert("Please enter a valid search query");
      return;
    }
    let data = new FormData();
    data.append("searchQuery", this.state.titleSearch);
    let response = await fetch("/search-title", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed response from search-text: ", parsed);
    if (parsed.success) {
      this.setState({
        titleSearch: "",
        locationSearch: "",
        results: parsed.events
      });
      return;
    }
    window.alert("Could not complete your search");
  };
  locationSearchChangeHandler = event => {
    console.log("location search input: ", event.target.value);
    this.setState({ locationSearch: event.target.value });
  };

  locationSearchSubmit = async event => {
    event.preventDefault();
    if (this.state.locationSearch === "" || this.state.locationSearch === " ") {
      window.alert("Please enter a valid search query");
      return;
    }
    let data = new FormData();
    data.append("searchQuery", this.state.locationSearch);
    let response = await fetch("/search-location", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed response from search-text: ", parsed);
    if (parsed.success) {
      this.setState({
        titleSearch: "",
        locationSearch: "",
        results: parsed.events
      });
      return;
    }
    window.alert("Could not complete your search");
  };

  displayResults = () => {
    if (this.state.results.length !== 0) {
      return this.state.results.map(event => {
        return <EventCard event={event} />;
      });
    }
    return <div>What are you looking for?</div>;
  };

  render = () => {
    return (
      <div>
        <h2>Search Events</h2>
        <div>
          <form onSubmit={this.titleSearchSubmit}>
            <label htmlFor="searchTitle">Search by title</label>
            <input
              id="searchTitle"
              type="text"
              onChange={this.titleSearchChangeHandler}
              value={this.state.titleSearch}
            />
            <input type="submit" />
          </form>
          <form onSubmit={this.locationSearchSubmit}>
            <label htmlFor="searchLocation">Search by location</label>
            <input
              id="searchLocation"
              type="text"
              onChange={this.locationSearchChangeHandler}
              value={this.state.locationSearch}
            />
            <input type="submit" />
          </form>
        </div>
        {this.displayResults()}
      </div>
    );
  };
}

let SearchEvents = connect()(UnconnectedSearchEvents);

export default SearchEvents;
