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

class UnconnectedApp extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = async () => {
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

  render = () => {
    return (
      <>
        <BrowserRouter>
          <Navbar />
          <Route path="/" exact={true}>
            <Homepage />
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
            path="/user/:uid"
            exact={true}
            render={this.renderUserProfile}
          />
          <Route
            path="/my-dashboard"
            exact={true}
            component={UserDashboard}
          ></Route>
        </BrowserRouter>
      </>
    );
  };
}

let mapStateToProps = state => {
  return {
    isLoggedIn: state.loggedIn
  };
};

let App = connect(mapStateToProps)(UnconnectedApp);

export default App;
