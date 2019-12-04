import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class UnconnectedSingleListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      eventHost: undefined,
      title: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      city: "",
      location: "",
      banner: undefined,
      categories: []
    };
  }

  componentDidMount = async () => {
    console.log("Did you mount?");
    await this.getSingleEvent();
    this.getEventHost();
  };

  getSingleEvent = async () => {
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

  getEventHost = () => {
    console.log("THIS PROPS HOSTS", this.props.hosts);
    console.log("THIS STATE EVENT", this.state.event);

    let eventHost = this.props.hosts.find(host => {
      console.log("value of host and event: ", this.state.event, host);

      return this.state.event.hostId === host._id;
    });
    console.log("Value of eventHost: ", eventHost);
    this.setState({ eventHost: eventHost });
  };

  showSaveEventButton = () => {
    if (
      this.props.isLoggedIn &&
      this.props.user._id !== this.state.eventHost._id
    ) {
      if (this.props.user.savedEvents.includes(this.state.event._id)) {
        return (
          <div>
            <button onClick={this.discardSavedEvent}>Discard event</button>
          </div>
        );
      }
      console.log("After save button");
      return (
        <div>
          <button onClick={this.saveEvent}>Save event</button>
        </div>
      );
    }
  };

  getUpdatedUser = async data => {
    let userResponse = await fetch("/render-user", {
      method: "POST",
      body: data
    });
    let userResponseBody = await userResponse.text();
    let userParsed = JSON.parse(userResponseBody);
    this.props.dispatch({ type: "update-user", user: userParsed.user });
  };

  saveEvent = async () => {
    let data = new FormData();
    data.append("_id", this.props.user._id);
    data.append("eventId", this.state.event._id);
    let response = await fetch("/save-event", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("parsed resp from save-event endpoint: ", parsed);
    if (parsed.success) {
      window.alert("Event saved");
      this.getUpdatedUser(data);
      return;
    }
    window.alert("Could not complete action");
  };

  discardSavedEvent = async () => {
    let data = new FormData();
    data.append("_id", this.props.user._id);
    data.append("eventId", this.state.event._id);
    let response = await fetch("/discard-saved-event", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (parsed.success) {
      // this.props.dispatch({ type: "update-user", user: parsed.user });
      window.alert("Event discarded successfully");
      this.getUpdatedUser(data);
      return;
    }
    window.alert("Could not discard event save");
  };

  displayEventControls = () => {
    if (
      this.props.isLoggedIn &&
      this.props.user._id === this.state.eventHost._id
    ) {
      return (
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="eventTitle">Title</label>
          <input
            type="text"
            id="eventTitle"
            value={this.state.title}
            onChange={this.titleChangeHandler}
          />
          <label htmlFor="eventDesc">Description</label>
          <textarea
            rows="10"
            cols="20"
            id="eventDesc"
            value={this.state.description}
            onChange={this.descChangeHandler}
          />
          <label htmlFor="startDateTime">Start date</label>
          <DatePicker
            selected={this.state.startDateTime}
            onChange={this.startDateTimeChangeHandler}
            showTimeSelect
            minDate={new Date()}
            timeFormat="HH:mm"
            timeIntervals={30}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
          <label htmlFor="endDateTime">End date</label>
          <DatePicker
            selected={this.state.endDateTime}
            onChange={this.endDateTimeChangeHandler}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
          />
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            value={this.state.city}
            onChange={this.cityChangeHandler}
          />
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={this.state.location}
            onChange={this.locationChangeHandler}
          />
          <label htmlFor="banner">Banner</label>
          <input type="file" id="banner" onChange={this.bannerChangeHandler} />
          <div>Select event categories</div>
          {/* TAGS */}
          <div>Music related</div>
          <div className="flex">
            <label htmlFor="ambientNewAge">Ambient/New Age</label>
            <input
              name="Ambient/New Age"
              type="checkbox"
              id="ambientNewAge"
              checked={this.state.categories.includes("Ambient/New Age")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="altRockPunk">Alt Rock/Punk</label>
            <input
              name="Alt Rock/Punk"
              type="checkbox"
              id="altRockPunk"
              checked={this.state.categories.includes("Alt Rock/Punk")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="avantGarde">Avant Garde</label>
            <input
              name="Avant Garde"
              type="checkbox"
              id="avantGarde"
              checked={this.state.categories.includes("Avant Garde")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="classical">Classical</label>
            <input
              name="Classical"
              type="checkbox"
              id="classical"
              checked={this.state.categories.includes("Classical")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="dance">Dance</label>
            <input
              name="Dance"
              type="checkbox"
              id="dance"
              checked={this.state.categories.includes("Dance")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="hipHopRnB">Hip-Hop/R'n'B</label>
            <input
              name="Hip-Hop/R'n'B"
              type="checkbox"
              id="hipHopRnB"
              checked={this.state.categories.includes("Hip-Hop/R'n'B")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="houseTechno">House/Techno</label>
            <input
              name="House/Techno"
              type="checkbox"
              id="houseTechno"
              checked={this.state.categories.includes("House/Techno")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="industrialNoise">Industrial/Noise</label>
            <input
              name="Industrial/Noise"
              type="checkbox"
              id="industrialNoise"
              checked={this.state.categories.includes("Industrial/Noise")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="jazzSoul">Jazz/Soul</label>
            <input
              name="Jazz/Soul"
              type="checkbox"
              id="jazzSoul"
              checked={this.state.categories.includes("Jazz/Soul")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="metal">Metal</label>
            <input
              name="Metal"
              type="checkbox"
              id="metal"
              checked={this.state.categories.includes("Metal")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="pop">Pop</label>
            <input
              name="Pop"
              type="checkbox"
              id="pop"
              checked={this.state.categories.includes("Pop")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="postPunk">Post Punk/New Wave</label>
            <input
              name="Post Punk/New Wave"
              type="checkbox"
              id="postPunk"
              checked={this.state.categories.includes("Post Punk/New Wave")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="rave">Rave</label>
            <input
              name="Rave"
              type="checkbox"
              id="rave"
              checked={this.state.categories.includes("Rave")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="rockfolk">Rock/Folk</label>
            <input
              name="Rock/Folk"
              type="checkbox"
              id="rockFolk"
              checked={this.state.categories.includes("Rock/Folk")}
              onChange={this.categoryChangeHandler}
            />
          </div>
          <input type="submit" />
        </form>
      );
    }
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

  handleSubmit = async event => {
    event.preventDefault();
    if (this.state.startDateTime > this.state.endDateTime) {
      window.alert("Your event cannot end before it begins");
      return;
    }
    console.log("New edit event form submission");
    let data = new FormData();
    data.append("title", this.state.title);
    data.append("hostId", this.props.user._id);
    data.append("description", this.state.description);
    data.append("startDateTime", this.state.startDateTime);
    data.append("endDateTime", this.state.endDateTime);
    data.append("city", this.state.city);
    data.append("location", this.state.location);
    data.append("img", this.state.banner);
    data.append("categories", JSON.stringify(this.state.categories));
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
    this.setState({
      title: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      city: "",
      location: "",
      banner: "",
      categories: []
    });
  };

  render = () => {
    if (this.state.eventHost === undefined) {
      console.log("Loading block");

      return <div>Loading...</div>;
    }
    return (
      <div>
        <div>
          <Link to={"/user/" + this.state.event.hostId}>
            {this.state.eventHost.username}
          </Link>
        </div>
        <div>{this.state.event.title}</div>
        <div>{this.state.event.description}</div>
        {this.showSaveEventButton()}
        {this.displayEventControls()}
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    isLoggedIn: state.loggedIn,
    hosts: state.hosts,
    user: state.user
  };
};
let SingleListing = connect(mapStateToProps)(UnconnectedSingleListing);

export default SingleListing;
