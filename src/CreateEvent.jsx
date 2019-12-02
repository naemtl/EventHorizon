import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

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
      banner: null,
      categories: []
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
  dateChangeHandler = event => {
    console.log("new input value: ", event.target.value);
    this.setState({ date: event.target.value });
  };
  timeChangeHandler = event => {
    console.log("new input value: ", event.target.value);
    this.setState({ time: event.target.value });
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
    console.log("New event form submission");
    let data = new FormData();
    data.append("title", this.state.title);
    data.append("hostId", this.props.user.userId);
    data.append("description", this.state.description);
    data.append("date", this.state.date);
    data.append("time", this.state.time);
    data.append("city", this.state.city);
    data.append("location", this.state.location);
    data.append("img", this.state.banner);
    data.append("categories", JSON.stringify(this.state.categories));
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
    this.setState({
      title: "",
      description: "",
      date: "",
      time: "",
      city: "",
      location: "",
      banner: "",
      categories: []
    });
  };

  render = () => {
    if (this.props.user) {
      return (
        <div>
          <h3>Create Event</h3>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="eventTitle">Title</label>
            <input
              type="text"
              id="eventTitle"
              value={this.state.title}
              onChange={this.titleChangeHandler}
            />
            <label htmlFor="eventDesc">Description</label>
            <input
              type="text"
              id="eventDesc"
              value={this.state.description}
              onChange={this.descChangeHandler}
            />
            <label htmlFor="eventDate">Date</label>
            <input
              type="date"
              id=""
              value={this.state.date}
              onChange={this.dateChangeHandler}
            />
            <label htmlFor="eventStartTime">Start time</label>
            <input
              type="time"
              id="eventStartTime"
              value={this.state.time}
              onChange={this.timeChangeHandler}
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
            <input
              type="file"
              id="banner"
              //value={this.state.banner}
              onChange={this.bannerChangeHandler}
            />
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
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  };
}

let mapStateToProps = state => {
  return {
    user: state.user
  };
};

let CreateEvent = connect(mapStateToProps)(UnconnectedCreateEvent);

export default CreateEvent;
