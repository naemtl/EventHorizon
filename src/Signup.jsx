import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";

class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      province: "Quebec",
      accountType: "",
      myCategories: []
    };
  }

  handleUsernameChange = event => {
    console.log("new username input change: ", event.target.value);
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = event => {
    console.log("new password input change: ", event.target.value);
    this.setState({ password: event.target.value });
  };

  handleEmailChange = event => {
    console.log("new email input change: ", event.target.value);
    this.setState({ email: event.target.value });
  };

  handleAccountType = event => {
    console.log("new account type: ", event.target.value);
    this.setState({ accountType: event.target.value });
  };

  categoryChangeHandler = event => {
    console.log("new categories: ", event.target.name);
    if (this.state.myCategories.includes(event.target.name)) {
      this.setState({
        myCategories: this.state.myCategories.filter(cat => {
          return cat !== event.target.name;
        })
      });
    } else
      this.setState({
        myCategories: this.state.myCategories.concat(event.target.name)
      });
  };

  handleSubmit = async event => {
    event.preventDefault();
    console.log("new signup submission");
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    data.append("email", this.state.email);
    data.append("province", this.state.province);
    data.append("myCategories", JSON.stringify(this.state.myCategories));
    data.append("accountType", this.state.accountType);
    console.log("Singup FormData: ", data);
    let response = await fetch("/signup", {
      method: "POST",
      body: data
    });
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    console.log("Parsed responsebody from signup endpoint: ", parsed);
    if (!parsed.success) {
      window.alert("Username in use");
      return;
    }
    window.alert("Signup successful");
    this.props.dispatch({
      type: "login-success",
      user: parsed.user
    });
    this.props.history.push("/");
  };

  render = () => {
    if (this.props.isLoggedIn) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <h2>Sign up below</h2>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="signUsername">Username</label>
          <input
            id="signUsername"
            type="text"
            value={this.state.username}
            onChange={this.handleUsernameChange}
            required
          />
          <label htmlFor="signPassword">Password</label>
          <input
            id="signPassword"
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            required
          />
          <label htmlFor="signEmail">Email</label>
          <input
            id="signEmail"
            type="email"
            value={this.state.email}
            onChange={this.handleEmailChange}
            required
          />
          <label htmlFor="signProvince">Province</label>
          <input
            id="signProvince"
            type="text"
            value={this.state.province}
            required
            disabled
          />
          <span>Account Type: </span>
          <label htmlFor="standardAccountType">Standard</label>
          <input
            id="standardAccountType"
            type="radio"
            value="Standard"
            name="account-type"
            onClick={this.handleAccountType}
            required
          />
          <label htmlFor="businessAccountType">Business</label>
          <input
            id="businessAccountType"
            type="radio"
            value="Business"
            name="account-type"
            onClick={this.handleAccountType}
            required
          />
          <div>Select prefered categories</div>
          {/* TAGS */}
          <div>Music related events</div>
          <div className="flex">
            <label htmlFor="ambientNewAge">Ambient/New Age</label>
            <input
              name="Ambient/New Age"
              type="checkbox"
              id="ambientNewAge"
              checked={this.state.myCategories.includes("Ambient/New Age")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="altRockPunk">Alt Rock/Punk</label>
            <input
              name="Alt Rock/Punk"
              type="checkbox"
              id="altRockPunk"
              checked={this.state.myCategories.includes("Alt Rock/Punk")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="avantGarde">Avant Garde</label>
            <input
              name="Avant Garde"
              type="checkbox"
              id="avantGarde"
              checked={this.state.myCategories.includes("Avant Garde")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="classical">Classical</label>
            <input
              name="Classical"
              type="checkbox"
              id="classical"
              checked={this.state.myCategories.includes("Classical")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="dance">Dance</label>
            <input
              name="Dance"
              type="checkbox"
              id="dance"
              checked={this.state.myCategories.includes("Dance")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="hipHopRnB">Hip-Hop/R'n'B</label>
            <input
              name="Hip-Hop/R'n'B"
              type="checkbox"
              id="hipHopRnB"
              checked={this.state.myCategories.includes("Hip-Hop/R'n'B")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="houseTechno">House/Techno</label>
            <input
              name="House/Techno"
              type="checkbox"
              id="houseTechno"
              checked={this.state.myCategories.includes("House/Techno")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="industrialNoise">Industrial/Noise</label>
            <input
              name="Industrial/Noise"
              type="checkbox"
              id="industrialNoise"
              checked={this.state.myCategories.includes("Industrial/Noise")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="jazzSoul">Jazz/Soul</label>
            <input
              name="Jazz/Soul"
              type="checkbox"
              id="jazzSoul"
              checked={this.state.myCategories.includes("Jazz/Soul")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="metal">Metal</label>
            <input
              name="Metal"
              type="checkbox"
              id="metal"
              checked={this.state.myCategories.includes("Metal")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="postPunk">Post Punk/New Wave</label>
            <input
              name="Post Punk/New Wave"
              type="checkbox"
              id="postPunk"
              checked={this.state.myCategories.includes("Post Punk/New Wave")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="rave">Rave</label>
            <input
              name="Rave"
              type="checkbox"
              id="rave"
              checked={this.state.myCategories.includes("Rave")}
              onChange={this.categoryChangeHandler}
            />
            <label htmlFor="rockfolk">Rock/Folk</label>
            <input
              name="Rock/Folk"
              type="checkbox"
              id="rockFolk"
              checked={this.state.myCategories.includes("Rock/Folk")}
              onChange={this.categoryChangeHandler}
            />
          </div>
          {/* <div>Miscellaneous social events</div>
          <div></div> */}
          <input type="submit" />
        </form>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    isLoggedIn: state.loggedIn
  };
};

let Signup = connect(mapStateToProps)(withRouter(UnconnectedSignup));

export default Signup;
