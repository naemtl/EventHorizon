import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FeaturedEvents from "./FeaturedEvents.jsx";
import LatestEvents from "./LatestEvents.jsx";

class UnconnectedHomepage extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div>
        <h1>Event Horizon</h1>
        <div>
          <h3>Featured</h3>
          <div>
            <FeaturedEvents />
          </div>
          <h3>Latest</h3>
          <div>
            <LatestEvents />
          </div>
          {/*
          <h3>Browse by genre</h3>
          <div>
            <EventByGenre />
          </div> */}
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    isLoggedIn: state.loggedIn,
    user: state.user
  };
};

let Homepage = connect(mapStateToProps)(UnconnectedHomepage);

export default Homepage;
