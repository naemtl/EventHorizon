import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import Homepage from "./Homepage.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Navbar from "./Navbar.jsx";
import CreateEvent from "./CreateEvent.jsx";
import UserProfile from "./UserProfile.jsx";
import UserDashboard from "./UserDashboard.jsx";
import SingleListing from "./SingleListing.jsx";
import SearchEvents from "./SearchEvents.jsx";
import MyEvents from "./MyEvents.jsx";
import PreferredHosts from "./PreferredHosts.jsx";
import EventsByCategory from "./EventsByCategory.jsx";

import "./styles/navbar.css";

class UnconnectedApp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.autoLogin();
  };

  autoLogin = async () => {
    let response = await fetch("/auto-login", {
      method: "POST"
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (parsed.success) {
      console.log("AUTO-LOGIN PARSEDUSER", parsed.user);
      this.props.dispatch({ type: "login-success", user: parsed.user });
      this.props.dispatch({
        type: "set-followed-hosts",
        followedHosts: parsed.user.followUser
      });
    }
    this.props.dispatch({ type: "autologin-done" });
  };

  renderUserProfile = routerData => {
    let userId = routerData.match.params.uid;
    return <UserProfile id={userId} />;
  };

  renderSingleListing = routerData => {
    let eventId = routerData.match.params.eid;
    return <SingleListing id={eventId} />;
  };

  renderEventsByCategory = routerData => {
    let category = routerData.match.params.cat;
    return <EventsByCategory category={category} />;
  };

  render = () => {
    return (
      <>
        <BrowserRouter>
          <Navbar />
          <Route path="/" exact={true}>
            <Homepage eventIds={this.props.eventIds} />
          </Route>
          <Route path="/login" exact={true}>
            <Login />
          </Route>
          <Route path="/signup" exact={true}>
            <Signup />
          </Route>
          <Route path="/create-event" exact={true}>
            <CreateEvent />
          </Route>
          <Route
            path="/event/:eid"
            exact={true}
            render={this.renderSingleListing}
          />
          <Route
            path="/user/:uid"
            exact={true}
            render={this.renderUserProfile}
          />
          <Route path="/my-dashboard" exact={true} component={UserDashboard} />
          <Route path="/search" exact={true} component={SearchEvents} />
          <Route
            path="/category/:cat"
            exact={true}
            render={this.renderEventsByCategory}
          />
          <Route path="/my-events" exact={true} component={MyEvents} />
          <Route
            path="/preferred-hosts"
            exact={true}
            component={PreferredHosts}
          />
        </BrowserRouter>
      </>
    );
  };
}

let mapStateToProps = state => {
  return {
    isLoggedIn: state.loggedIn,
    eventIds: state.eventIds
  };
};

let App = connect(mapStateToProps)(UnconnectedApp);

export default App;
