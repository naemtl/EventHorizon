import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedUserProfile extends Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    return (
      <div>
        <div>{this.props.user.username}</div>
        <div>{this.props.user.email}</div>
        <div>{this.props.user.accountType}</div>
        <div>{this.props.user.blockUser}</div>
        <div>{this.props.user.friendsList}</div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    user: state.user
  };
};

let UserProfile = connect(mapStateToProps)(UnconnectedUserProfile);

export default UserProfile;
