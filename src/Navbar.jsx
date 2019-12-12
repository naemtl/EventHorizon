import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import onClickOutside from "react-onclickoutside";

class UnconnectedNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      search: undefined,
      showMenu: ""
    };
  }

  componentDidMount = () => {
    document.addEventListener("click", event => {
      let isClickInside =
        document.getElementById("nav-drop").contains(event.target) ||
        document.getElementById("navbar-hidden-button").contains(event.target);
      if (!isClickInside) {
        this.closeMenu();
      }
    });
  };

  handleClickOutside = () => {
    this.closeMenu();
  };

  toggleDropdown = () => {
    if (this.state.showMenu === "") {
      this.setState({ showMenu: "show" });
    } else {
      this.setState({ showMenu: "" });
    }
  };

  closeMenu = () => {
    this.setState({ showMenu: "" });
  };

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
        <div className="navbar-left-child">
          <Link to="/" className={"navbar-logo-text"}>
            <img
              src="/images/logo-wh.png"
              alt="EventHorizon logo"
              height="50px"
            />
            <span>Event Horizon</span>
          </Link>
        </div>
        <div className="navbar-right-child">
          <Link to="/search">
            <FiSearch className="navbar-icon-search navbar-item" />
          </Link>
          {!this.props.isLoggedIn && (
            <div className="navbar_logged-out">
              <Link className="navbar-item navbar-item-link" to="/login">
                Log in
              </Link>
              <Link className="navbar-item navbar-item-link" to="/signup">
                Sign up
              </Link>
            </div>
          )}
          {this.props.isLoggedIn && (
            <div className="navbar_logged-in navbar-dropdown">
              <Link className="navbar-item navbar-item-link" to="/create-event">
                Create event
              </Link>
              <Link className="navbar-item navbar-item-link" to="/my-events">
                My events
              </Link>
              <Link
                className="navbar-item navbar-item-link"
                to="/preferred-hosts"
              >
                Preferred hosts
              </Link>
              <div className="navbar-dropdown">
                <button
                  onClick={this.toggleDropdown}
                  className="navbar-button"
                  id="navbar-hidden-button"
                >
                  <img
                    className="navbar-item"
                    src={this.props.user.avatar}
                    alt="user avatar"
                    width="40px"
                  />
                  <FiChevronDown className="navbar-icon-arrowdown" />
                </button>
                <div
                  id="nav-drop"
                  className={"navbar-dropdown-content " + this.state.showMenu}
                >
                  <div className="navbar-dropdown-item">
                    Signed in as {this.props.user.username}
                  </div>

                  {/* fake burger */}
                  <div className="navbar-hamburger">
                    <Link className="navbar-dropdown-item" to="/create-event">
                      Create event
                    </Link>
                    <Link className="navbar-dropdown-item" to="/my-events">
                      My events
                    </Link>
                    <Link
                      className="navbar-dropdown-item"
                      to="/preferred-hosts"
                    >
                      Preferred hosts
                    </Link>
                  </div>
                  <Link className="navbar-dropdown-item" to={"/my-dashboard"}>
                    My dashboard
                  </Link>
                  <button
                    className="navbar-button navbar-dropdown-item"
                    onClick={this.logout}
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  };
}

let mapStateToProps = state => {
  return { isLoggedIn: state.loggedIn, user: state.user };
};

let Navbar = connect(mapStateToProps)(onClickOutside(UnconnectedNavbar));

export default withRouter(Navbar);
