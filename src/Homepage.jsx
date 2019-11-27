import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FeaturedEvents from "./FeaturedEvents.jsx";
import StaffPicks from "./StaffPicks.jsx";
import EventByGenre from "./EventByGenre.jsx";

class UnconnectedHomepage extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div>
        <h1>Event Horizon</h1>
        <div>
          <h3>Featured events</h3>
          {/* <div>
            <FeaturedEvents />
          </div>
          <h3>Staff picks</h3>
          <div>
            <StaffPicks />
          </div>
          <h3>Browse by genre</h3>
          <div>
            <EventByGenre />
          </div> */}
        </div>
      </div>
    );
  };
}

let Homepage = connect()(UnconnectedHomepage);

export default Homepage;
