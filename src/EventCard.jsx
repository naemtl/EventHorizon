import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as dateformat from "dateformat";
import "./styles/eventcard.css";
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
      <div className="eventcard-padding eventcard-grid-item">
        <div className="eventcard-item-content">
          <Link to={"/event/" + this.props.event._id}>
            <div className="eventcard-item-frame">
              <img
                className="eventcard-item-img"
                src={this.props.event.banner}
                alt="event banner"
              />
            </div>
            <div className="eventcard-item-header">
              <span>{dateformat(eventStartDate, "dd.mm.yy")}</span>
              <span>{this.props.event.city}</span>
              <div className="eventcard-item-title">
                {this.props.event.title}
              </div>
            </div>
          </Link>
          <div className="eventcard-item-footer">
            {this.props.event.categories.map(cat => {
              console.log("CAT", cat);
              return (
                <Link className="eventcard-tag" to={"/category/" + cat.value}>
                  {cat.label.toUpperCase()}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
}

let EventCard = connect()(UnconnectedEventCard);

export default EventCard;
