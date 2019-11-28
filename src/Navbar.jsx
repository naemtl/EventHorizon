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

  logout = () => {
    this.props.dispatch({ type: "logout-success" });
    this.props.history.push("/");
  };

  render = () => {
    return (
      <nav>
        <Link to="/">
          <img src="/images/logo.png" alt="EventHorizon logo" height="50px" />
        </Link>
        {!this.props.isLoggedIn && <Link to="/login">Log in</Link>}
        {this.props.isLoggedIn && (
          <div>
            <div>{this.props.user.username}</div>
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
