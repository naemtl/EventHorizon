import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import { options, customStyles } from "./ReactSelectConfig.js";
import "react-datepicker/dist/react-datepicker.css";

class UnconnectedSingleListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.event.title,
      description: this.props.event.description,
      startDateTime: new Date(parseInt(this.props.event.startDateTime)),
      endDateTime: new Date(parseInt(this.props.event.endDateTime)),
      city: this.props.event.city,
      location: this.props.event.location,
      banner: undefined,
      categories: this.props.event.categories
    };
  }

  getUpdatedUser = async data => {
    let userResponse = await fetch("/render-user", {
      method: "POST",
      body: data
    });
    let userResponseBody = await userResponse.text();
    let userParsed = JSON.parse(userResponseBody);
    this.props.dispatch({ type: "update-user", user: userParsed.user });
  };

  titleChangeHandler = event => {
    console.log("new input value: ", event.target.value);
    this.setState({ title: event.target.value });
  };
  descChangeHandler = event => {
    console.log("new input value: ", event.target.value);
    this.setState({ description: event.target.value });
  };
  startDateTimeChangeHandler = date => {
    console.log("new input value: ", date);
    this.setState({ startDateTime: date });
  };
  endDateTimeChangeHandler = date => {
    console.log("new input value: ", date);
    this.setState({ endDateTime: date });
  };
  cityChangeHandler = event => {
    console.log("new input value: ", event.target.value);
    this.setState({ city: event.target.value });
  };
  locationChangeHandler = event => {
    console.log("new input value: ", event.target.value);
    this.setState({ location: event.target.value });
  };
  bannerChangeHandler = event => {
    console.log("new input value: ", event.target.files[0]);
    this.setState({ banner: event.target.files[0] });
  };

  // REACT-SELECT

  handleSelectChange = selectedOptions => {
    let newSelections = [];
    if (selectedOptions !== null) {
      newSelections = selectedOptions.map(option => {
        return option;
      });
    }
    console.log("Options selected: ", selectedOptions);
    this.setState({ categories: newSelections });
    console.log("Options selected: ", newSelections);
  };

  handleSubmit = async event => {
    event.preventDefault();
    if (this.state.startDateTime > this.state.endDateTime) {
      window.alert("Your event cannot end before it begins");
      return;
    }
    console.log("New edit event form submission");
    let data = new FormData();
    data.append("eventId", this.props.event._id);
    data.append("title", this.state.title);
    data.append("hostId", this.props.user._id);
    data.append("description", this.state.description);
    data.append("startDateTime", this.state.startDateTime.getTime());
    data.append("endDateTime", this.state.endDateTime.getTime());
    data.append("city", this.state.city);
    data.append("location", this.state.location);
    if (this.state.banner !== undefined) {
      data.append("img", this.state.banner);
    } else {
      data.append("currentBanner", this.props.event.banner);
    }
    data.append(
      "categories",
      JSON.stringify(this.state.categories.slice(0, 3))
    );
    let response = await fetch("/update-event", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed response from update-event endpoint: ", parsed);
    if (!parsed.success) {
      window.alert("Your event could not be updated.");
      return;
    }
    window.alert("Event updated.");
    this.props.getUpdatedEvent(parsed.event);
  };

  render = () => {
    if (!this.props.autologinDone) {
      return <h4>Loading...</h4>;
    }
    if (this.props.isLoggedIn) {
      if (
        this.props.user._id === this.props.event.hostId ||
        this.props.user.isAdmin
      ) {
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="eventTitle">Title</label>
              <input
                className="form-text-input"
                type="text"
                id="eventTitle"
                value={this.state.title}
                onChange={this.titleChangeHandler}
              />
              <label htmlFor="eventDesc">Description</label>
              <textarea
                className="form-text-input"
                rows="10"
                cols="20"
                id="eventDesc"
                value={this.state.description}
                onChange={this.descChangeHandler}
              />
              <div className="form-input-space-between">
                <label htmlFor="startDateTime">Start date</label>
                <DatePicker
                  className="form-text-input form-date-input"
                  selected={this.state.startDateTime}
                  onChange={this.startDateTimeChangeHandler}
                  showTimeSelect
                  minDate={new Date()}
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  timeCaption="time"
                  dateFormat="MMM d, yyyy H:mm"
                />
                <label htmlFor="endDateTime">End date</label>
                <DatePicker
                  className="form-text-input form-date-input"
                  selected={this.state.endDateTime}
                  onChange={this.endDateTimeChangeHandler}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  timeCaption="time"
                  dateFormat="MMM d, yyyy H:mm"
                />
              </div>
              <label htmlFor="city">City</label>
              <input
                className="form-text-input"
                type="text"
                id="city"
                value={this.state.city}
                onChange={this.cityChangeHandler}
              />
              <label htmlFor="location">Location</label>
              <input
                className="form-text-input"
                type="text"
                id="location"
                value={this.state.location}
                onChange={this.locationChangeHandler}
              />
              <label htmlFor="banner">Banner</label>
              <input
                className="form-text-input"
                type="file"
                id="banner"
                onChange={this.bannerChangeHandler}
              />
              {/* TAGS */}
              <Select
                value={this.state.categories}
                onChange={this.handleSelectChange}
                styles={customStyles}
                options={options}
                isMulti="true"
                placeholder="Select up to three categories"
              />
              <input className="form-submit-button" type="submit" />
            </form>
          </div>
        );
      }
    }
    return <Redirect to="/" />;
  };
}

let mapStateToProps = state => {
  return {
    isLoggedIn: state.loggedIn,
    hosts: state.hosts,
    user: state.user,
    autologinDone: state.autologinDone
  };
};
let SingleListing = connect(mapStateToProps)(UnconnectedSingleListing);

export default SingleListing;
