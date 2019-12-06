import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as dateformat from "dateformat";
// converts 'require syntax' to importable library

class UnconnectedEventCard extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    console.log(
      "this.props.event.categories AFTER UPDATE IN EVENT CARD",
      this.props.event.categories
    );

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
        <div>{this.props.event.description}</div>
        <div>{dateformat(eventStartDate, "mm.dd.yyyy")}</div>
        <div>{this.props.event.location}</div>
        <div>{this.props.event.city}</div>
        <div>
          {this.props.event.categories.map(cat => {
            console.log("CAT", cat);
            return (
              <Link to={"/category/" + cat.toLowerCase().replace("/", "-")}>
                <span className="event-card-categories">
                  {cat.toUpperCase()}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };
}

let EventCard = connect()(UnconnectedEventCard);

export default EventCard;
