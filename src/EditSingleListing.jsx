import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import { Redirect } from "react-router-dom";
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

  componentWillMount = async () => {
    // console.log([
    //   "DATE OBJECTS: ",
    //   new Date(parseInt(this.props.event.startDateTime)),
    //   new Date(parseInt(this.props.event.endDateTime)),
    //   this.props.event.startDateTime,
    //   this.props.event.endDateTime
    // ]);
    //this.getEventHost();
  };

  //   getEventHost = () => {
  //     console.log("THIS PROPS HOSTS", this.props.hosts);
  //     console.log("THIS STATE EVENT", this.state.event);

  //     let eventHost = this.props.hosts.find(host => {
  //       console.log("value of host and event: ", this.state.event, host);

  //       return this.state.event.hostId === host._id;
  //     });
  //     console.log("Value of eventHost: ", eventHost);
  //     this.setState({ eventHost: eventHost });
  //   };

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
    // this.setState({
    //   title: parsed.event.title,
    //   description: parsed.event.description,
    //   startDateTime: new Date(parseInt(this.props.event.startDateTime)),
    //   endDateTime: new Date(parseInt(this.props.event.endDateTime)),
    //   city: parsed.event.city,
    //   location: parsed.event.location,
    //   banner: parsed.event.banner,
    //   categories: parsed.event.categories
    // });
    this.props.getUpdatedEvent(parsed.event);
  };

  render = () => {
    console.log("STATEEEE", this.state);

    // if (this.state.eventHost === undefined) {
    //   console.log("Loading block");

    //   return <div>Loading...</div>;
    // }
    if (
      this.props.isLoggedIn &&
      this.props.user._id === this.props.event.hostId
    ) {
      return (
        <div>
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
              dateFormat="MMM d, yyyy H:mm"
            />
            <label htmlFor="endDateTime">End date</label>
            <DatePicker
              selected={this.state.endDateTime}
              onChange={this.endDateTimeChangeHandler}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              timeCaption="time"
              dateFormat="MMM d, yyyy H:mm"
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
        </div>
      );
    }
    return <Redirect to="/" />;
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
