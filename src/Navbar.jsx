import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

class UnconnectedNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      search: undefined
    };
  }

  logout = async () => {
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
      <nav className="navbar">
        <Link to="/" className={"navbar-logo-text"}>
          <img
            src="/images/logo-wh.png"
            alt="EventHorizon logo"
            height="50px"
          />
          <span>Event Horizon</span>
        </Link>
        {!this.props.isLoggedIn && <Link to="/login">Log in</Link>}
        {this.props.isLoggedIn && (
          <div className="navbar_logged-in">
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
            <Link to="/my-events">My Events</Link>
            <Link to="/preferred-hosts">Preferred Hosts</Link>
            <button onClick={this.logout}>Log out</button>
            <Link to="/create-event">Create Event</Link>
          </div>
        )}
        <Link to="/search">
          <FiSearch className="navbar-icon" />
        </Link>
      </nav>
    );
  };
}

let mapStateToProps = state => {
  return { isLoggedIn: state.loggedIn, user: state.user };
};

let Navbar = connect(mapStateToProps)(withRouter(UnconnectedNavbar));

export default Navbar;
