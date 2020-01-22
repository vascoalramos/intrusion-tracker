import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

import global from "../../variables/global";
import baseURL from "../../variables/baseURL";

import Booking from "../Booking/Booking.js";

class BookingList extends React.Component {
  constructor() {
    super();
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpenEdit = this.handleOpenEdit.bind(this);
    this.handleCloseEdit = this.handleCloseEdit.bind(this);
  }
  modal = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  state = {
    bookings: [],
    isLoaded: false,
    openDelete: false,
    currentBooking: null,
    token_expired: false,
    openEdit: false,
    addBooking: false
  };

  addBooking() {
    this.setState({
      bookings: [],
      openDelete: false,
      currentBooking: null,
      token_expired: false,
      openEdit: false,
      addBooking: true
    });
  }

  handleOpen(roomNumber) {
    this.setState({
      bookings: this.state.bookings,
      openDelete: true,
      currentBooking: roomNumber,
      token_expired: this.state.token_expired,
      openEdit: this.state.openEdit,
      addBooking: this.state.addBooking
    });
  }

  handleClose() {
    this.setState({
      bookings: this.state.bookings,
      openDelete: false,
      currentBooking: null,
      token_expired: this.state.token_expired,
      openEdit: this.state.openEdit,
      addBooking: this.state.addBooking
    });
  }

  handleOpenEdit(room) {
    this.setState({
      bookings: this.state.bookings,
      openDelete: this.state.openDelete,
      currentBooking: room,
      token_expired: this.state.token_expired,
      addBooking: this.state.addBooking
    });
  }

  handleCloseEdit() {
    this.setState({
      bookings: this.state.bookings,
      openDelete: this.state.openDelete,
      currentBooking: null,
      token_expired: this.state.token_expired,
      addBooking: this.state.addBooking
    });
  }

  deleteRoom() {
    global = JSON.parse(localStorage.getItem('global'))

    fetch(baseURL + "api/v1/bookings/" + this.state.currentBooking, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: global.token
      }
    })
      .then(response => {
        if (response.ok) return response.json();
        else if (response.status == "401") {
          this.setState({
            token_expired: true
          });
        } else {
          throw new Error(response.status);
        }
      })
      .then(data => {})
      .catch(error => {
        console.log("error: " + error);
      });

    this.getData();
  }

  isInt(value) {
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
  }

  getData() {
    global = JSON.parse(localStorage.getItem('global'))

    fetch(baseURL + "api/v1/bookings/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: global.token
      }
    })
      .then(response => {
        if (response.ok) return response.json();
        else if (response.status == "401") {
          this.setState({
            token_expired: true
          });
        } else {
          throw new Error(response.status);
        }
      })
      .then(data => {
        // sort ascending by room number
        data.sort((booking1, booking2) => (booking1.id > booking2.id ? 1 : -1));
        var tableBooking = [];
        data.forEach(booking =>
          global.userInfo.role === "admin" ||
          global.userInfo.role === "security_enforcer"
            ? tableBooking.push([
                "" + booking.id,
                "" + booking.user.person.email,
                "" + booking.room.roomNumber,
                "" +
                  booking.startTime.split(":")[0].replace("T", " ") +
                  ":" +
                  booking.startTime.split(":")[1],
                "" +
                  booking.endTime.split(":")[0].replace("T", " ") +
                  ":" +
                  booking.endTime.split(":")[1],
                <button
                  style={{ color: "red" }}
                  onClick={() => this.handleOpen(booking.id)}
                >
                  <DeleteIcon />
                </button>
              ])
            : tableBooking.push([
                "" + booking.id,
                "" + booking.user.person.email,
                "" + booking.room.roomNumber,
                "" +
                  booking.startTime.split(":")[0].replace("T", " ") +
                  ":" +
                  booking.startTime.split(":")[1],
                "" +
                  booking.endTime.split(":")[0].replace("T", " ") +
                  ":" +
                  booking.endTime.split(":")[1]
              ])
        );
        this.setState({
          bookings: tableBooking,
          openDelete: false,
          currentBooking: this.state.currentBooking,
          token_expired: this.state.token_expired,
          openEdit: this.state.openEdit,
          addBooking: this.state.addBooking,
          isLoaded: true
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });
  }

  componentDidMount() {
    this.getData();
  }

  //Go back to login
  renderRedirectLogin = () => {
    if (this.state.token_expired) {
      localStorage.setItem('global', null);
      return <Redirect to="/login" />;
    }
  };

  render() {
    global = JSON.parse(localStorage.getItem('global'))
    const {isLoaded } = this.state;

    if (!isLoaded) {
      console.log("Loading")
      return (
        <div>
          {this.renderRedirectLogin()}
          <h2>Loading...</h2>
        </div>
      );
    }

    if (!this.state.addBooking) {
      return (
        <div>
          {this.renderRedirectLogin()}
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="success">
                  <h4 style={{ color: "white" }}>Booked Rooms</h4>
                  <p style={{ color: "white" }}>
                    List with all bookings reserved
                  </p>
                </CardHeader>
                <CardBody>
                  <Button
                    color="success"
                    id="add-button"
                    onClick={() => this.addBooking()}
                  >
                    Add booking
                  </Button>
                  {this.state.bookings.length > 0 && (
                    <Table
                      tableHeaderColor="success"
                      tableHead={
                        global.userInfo.role === "admin" ||
                        global.userInfo.role === "security_enforcer"
                          ? [
                              "Booking ID",
                              "Username",
                              "Room number",
                              "Start time",
                              "End time",
                              "Delete"
                            ]
                          : [
                              "Booking ID",
                              "Username",
                              "Room number",
                              "Start time",
                              "End time"
                            ]
                      }
                      tableData={this.state.bookings}
                    />
                  )}
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          <Dialog
            open={this.state.openDelete}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you sure you want to delete this department?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <strong>Booking {this.state.currentBooking}</strong> will be{" "}
                <strong color="danger">PERMANENTLY DELETED</strong>. This action
                cannot be undone.
                {console.log(this.state)}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleClose()} color="info">
                Cancel
              </Button>
              <Button
                onClick={() => this.deleteRoom()}
                color="danger"
                autoFocus
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    } else {
      return <Booking />;
    }
  }
}

export default BookingList;
