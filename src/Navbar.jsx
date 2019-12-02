import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

class UnconnectedNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      search: undefined
    };
  }

  logout = async () => {
    // TODO: fix logout
    let response = await fetch("/logout", {
      method: "POST"
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (!parsed.success) {
      console.log("cannot logout/clear session", parsed.err);
      return;
    }
    this.props.dispatch({ type: "logout-success" });
    this.props.history.push("/");
  };

  render = () => {
    return (
      <nav className="flex space-between">
        <Link to="/">
          <img src="/images/logo.png" alt="EventHorizon logo" height="50px" />
        </Link>
        {!this.props.isLoggedIn && <Link to="/login">Log in</Link>}
        {this.props.isLoggedIn && (
          <div className="flex space-between">
            <Link to={"/my-dashboard"}>
              <div>
                <img
                  src={this.props.user.avatar}
                  alt="user avatar"
                  width="40px"
                />
                {this.props.user.username}
              </div>
            </Link>
            <button onClick={this.logout}>Log out</button>
            <Link to="/create-event">Create Event</Link>
          </div>
        )}
      </nav>
    );
  };
}

let mapStateToProps = state => {
  return { isLoggedIn: state.loggedIn, user: state.user };
};

let Navbar = connect(mapStateToProps)(withRouter(UnconnectedNavbar));

export default Navbar;
