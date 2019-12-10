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
        <div>
          <div className="collection">
            <h2>Featured Listings</h2>
            <div>
              <FeaturedEvents />
            </div>
          </div>
          <div className="collection">
            <h2>Coming Up</h2>
            <div>
              <LatestEvents />
            </div>
          </div>
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
