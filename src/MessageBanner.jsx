import React, { Component } from "react";
import { connect } from "react-redux";

// a banner that dismisses itself after a delay might be less intrusive.
// a modal is more for prompting a user

class UnconnectedMessageBanner extends Component {
  render = () => {
    return <div>{this.props.message}</div>;
  };
}

let MessageBanner = connect()(UnconnectedMessageBanner);

export default MessageBanner;
