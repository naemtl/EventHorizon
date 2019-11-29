import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class UnconnectedUserProfile extends Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    if (this.props.user) {
      return (
        <div>
          <div>{this.props.user.username}</div>
          <div>{this.props.user.email}</div>
          <div>{this.props.user.accountType}</div>
          <div>My preferred categories:</div>
          <div>{this.props.user.myCategories.join(", ")}</div>
          <div>{this.props.user.blockUser}</div>
          <div>{this.props.user.friendsList}</div>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  };
}

let mapStateToProps = state => {
  return {
    user: state.user
  };
};

let UserProfile = connect(mapStateToProps)(UnconnectedUserProfile);

export default UserProfile;
