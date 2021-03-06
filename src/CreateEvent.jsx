import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { options, customStyles } from "./ReactSelectConfig.js";

import MessageBanner from "./MessageBanner.jsx";

class UnconnectedCreateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      city: "",
      location: "",
      banner: undefined,
      categories: [],
      eventCreated: false,
      showMessageBanner: false,
      createdEventId: null
    };
  }

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
    this.setState({ startDateTime: date.getTime() });
  };
  endDateTimeChangeHandler = date => {
    console.log("new input value: ", date);
    this.setState({ endDateTime: date.getTime() });
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
  categoryChangeHandler = event => {
    console.log("new categories: ", event.target.name);
    if (this.state.categories.includes(event.target.name)) {
      this.setState({
        categories: this.state.categories.filter(cat => {
          return cat !== event.target.name;
        })
      });
    } else
      this.setState({
        categories: this.state.categories.concat(event.target.name)
      });
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
    console.log("New event form submission");
    let data = new FormData();
    data.append("title", this.state.title);
    data.append("hostId", this.props.user._id);
    data.append("description", this.state.description);
    data.append("startDateTime", this.state.startDateTime);
    data.append("endDateTime", this.state.endDateTime);
    data.append("city", this.state.city);
    data.append("location", this.state.location);
    data.append("img", this.state.banner);
    data.append(
      "categories",
      JSON.stringify(this.state.categories.slice(0, 3))
    );
    let response = await fetch("/new-event", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed response from new-event endpoint: ", parsed);
    if (!parsed.success) {
      //window.alert("Your event could not be created.");
      this.setState({ showMessageBanner: true });
      return;
    }
    //window.alert("Event created.");
    this.setState({
      title: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      city: "",
      location: "",
      banner: "",
      categories: [],
      eventCreated: true,
      createdEventId: parsed.createdEventId
    });
  };

  render = () => {
    if (!this.props.autologinDone) {
      return (
        <div className="header-margin">
          <div className="form-container">
            <h4>Loading...</h4>
          </div>
        </div>
      );
    }
    if (this.props.user) {
      return (
        <div className="header-margin">
          <div className="form-container">
            <h2>Create Event</h2>
            <h4>Event banner</h4>
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="banner">Banner</label>
              <input
                className="form-text-input event-banner-input"
                type="file"
                id="banner"
                onChange={this.bannerChangeHandler}
              />
              <label htmlFor="eventTitle">Title</label>
              <input
                placeholder="Event title"
                className="form-text-input"
                type="text"
                id="eventTitle"
                value={this.state.title}
                onChange={this.titleChangeHandler}
                maxLength="64"
              />
              <label htmlFor="eventDesc">Description</label>
              <textarea
                placeholder="Event information"
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
                  placeholderText="Start date/time"
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
                  placeholderText="End date/time"
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
                placeholder="Event's city"
                className="form-text-input"
                type="text"
                id="city"
                value={this.state.city}
                onChange={this.cityChangeHandler}
              />
              <label htmlFor="location">Location</label>
              <input
                placeholder="A place or address"
                className="form-text-input"
                type="text"
                id="location"
                value={this.state.location}
                onChange={this.locationChangeHandler}
              />

              {/* TAGS */}
              <Select
                onChange={this.handleSelectChange}
                styles={customStyles}
                options={options}
                isMulti="true"
                placeholder="Select up to three categories"
              />
              <input className="form-submit-button" type="submit" />
            </form>
            {this.state.eventCreated && (
              <Redirect to={"/event/" + this.state.createdEventId} />
            )}
            {!this.state.eventCreated && this.state.showMessageBanner && (
              <MessageBanner message={"Your event could not be created."} />
            )}
          </div>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  };
}

let mapStateToProps = state => {
  return {
    user: state.user,
    autologinDone: state.autologinDone
  };
};

let CreateEvent = connect(mapStateToProps)(UnconnectedCreateEvent);

export default CreateEvent;
