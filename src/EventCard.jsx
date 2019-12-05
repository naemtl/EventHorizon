import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as dateformat from "dateformat";
// converts 'require syntax' to importable library

class UnconnectedEventCard extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   eventHost: {}
    // };
  }
  // componentDidMount = async () => {
  //   let eventHost = this.props.hosts.find(host => {
  //     console.log("value of host and event: ", this.props.event, host);

  //     return this.props.event.hostId === host._id;
  //   });
  //   console.log("Value of eventHost: ", eventHost);
  //   this.setState({ eventHost: eventHost });
  // };
  render = () => {
    let eventStartDate = new Date(parseInt(this.props.event.startDateTime));
    let eventEndDate = new Date(parseInt(this.props.event.endDateTime));
    return (
      <div className="card-padding">
        <div>
          <Link to={"/event/" + this.props.event._id}>
            <img
              src={this.props.event.banner}
              alt="this.props.event banner"
              width="100px"
            />
          </Link>
        </div>
        <div>{this.props.event.title}</div>
        {/*<div>
          <Link to={"/user/" + this.props.event.hostId}>
            {this.state.eventHost.username}
          </Link>
        </div>*/}
        <div>{this.props.event.description}</div>
        <div>{dateformat(eventStartDate, "ddd, mmm dS yyyy")}</div>
        <div>{this.props.event.location}</div>
        <div>{this.props.event.city}</div>
        <div>{this.props.event.categories.join(", ")}</div>
      </div>
    );
  };
}

// let mapStateToProps = state => {
//   return {
//     hosts: state.hosts
//   };
// };

let EventCard = connect()(UnconnectedEventCard);

export default EventCard;
