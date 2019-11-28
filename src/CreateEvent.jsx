import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedCreateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      date: "",
      time: "",
      city: "",
      location: "",
      banner: ""
    };
  }

  handleTitleChange = event => {
    console.log("new input value: ", event.target.value);
    this.setState({ title: event.target.value });
  };
  handleDescChange = event => {
    console.log("new input value: ", event.target.value);
    this.setState({ description: event.target.value });
  };
  handleDateChange = event => {
    console.log("new input value: ", event.target.value);
    this.setState({ date: event.target.value });
  };
  handleTimeChange = event => {
    console.log("new input value: ", event.target.value);
    this.setState({ time: event.target.value });
  };
  handleCityChange = event => {
    console.log("new input value: ", event.target.value);
    this.setState({ city: event.target.value });
  };
  handleLocationChange = event => {
    console.log("new input value: ", event.target.value);
    this.setState({ location: event.target.value });
  };
  handleBannerChange = event => {
    console.log("new input value: ", event.target.value);
    this.setState({ banner: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    console.log("New event form submission");
    let data = new FormData();
    data.append("title", this.state.title);
    data.append("host", this.props.user.username);
    data.append("description", this.state.description);
    data.append("date", this.state.date);
    data.append("time", this.state.time);
    data.append("city", this.state.city);
    data.append("location", this.state.location);
    data.append("img", this.state.banner);
    let response = await fetch("/new-event", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed response from new-event endpoint: ", parsed);
    if (!parsed.success) {
      window.alert("Your event could not be created.");
      return;
    }
    window.alert("Event created.");
  };

  render = () => {
    return (
      <div>
        <h3>Create Event</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="eventTitle">Title</label>
          <input
            type="text"
            id="eventTitle"
            value={this.state.title}
            onChange={this.handleTitleChange}
          />
          <label htmlFor="eventDesc">Description</label>
          <input
            type="text"
            id="eventDesc"
            value={this.state.description}
            onChange={this.handleDescChange}
          />
          <label htmlFor="eventDate">Date</label>
          <input
            type="date"
            id=""
            value={this.state.date}
            onChange={this.handleDateChange}
          />
          <label htmlFor="eventStartTime">Start time</label>
          <input
            type="time"
            id="eventStartTime"
            value={this.state.time}
            onChange={this.handleTimeChange}
          />
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            value={this.state.city}
            onChange={this.handleCityChange}
          />
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={this.state.location}
            onChange={this.handleLocationChange}
          />
          <label htmlFor="banner">Banner</label>
          <input
            type="file"
            id="banner"
            value={this.state.banner}
            onChange={this.handleBannerChange}
          />
          <input type="submit" />
        </form>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    user: state.user
  };
};

let CreateEvent = connect(mapStateToProps)(UnconnectedCreateEvent);

export default CreateEvent;
