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

class UnconnectedApp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.autoLogin();
  };

  // componentDidUpdate = async prevProps => {
  //   let response = await fetch("/event-ids", {
  //     method: "POST"
  //   });
  //   let responseBody = await response.text();
  //   let parsed = JSON.parse(responseBody);
  //   console.log("PARSED body from /event-ids: ", parsed);
  //   if (
  //     (parsed.success &&
  //       this.props.eventIds.length !== prevProps.eventIds.length) ||
  //     this.props.eventIds === 0
  //   ) {
  //     this.props.dispatch({ type: "get-eventIds", eventIds: parsed.eventIds });
  //     return;
  //   }
  //   console.log("Unsuccessful attempt at getting event ids from db/server");
  // };

  autoLogin = async () => {
    let response = await fetch("/auto-login", {
      method: "POST"
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (parsed.success) {
      this.props.dispatch({ type: "login-success", user: parsed.user });
    }
  };

  renderUserProfile = routerData => {
    let userId = routerData.match.params.uid;
    return <UserProfile id={userId} />;
  };

  renderSingleListing = routerData => {
    let eventId = routerData.match.params.eid;
    return <SingleListing id={eventId} />;
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
