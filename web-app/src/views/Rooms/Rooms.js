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

class TypographyPage extends React.Component {
  constructor() {
    super();
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpenEdit = this.handleOpenEdit.bind(this);
    this.handleCloseEdit = this.handleCloseEdit.bind(this);
    this.editRoom = this.editRoom.bind(this);
  }
  modal = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  state = {
    rooms: [],
    openDelete: false,
    currentRoom: null,
    token_expired: false,
    openEdit: false,
    isLoaded: false,
  };

  handleOpen(roomNumber) {
    this.setState({
      rooms: this.state.rooms,
      openDelete: true,
      currentRoom: roomNumber,
      token_expired: this.state.token_expired,
      openEdit: this.state.openEdit
    });
  }

  handleClose() {
    this.setState({
      rooms: this.state.rooms,
      openDelete: false,
      currentRoom: null,
      token_expired: this.state.token_expired,
      openEdit: this.state.openEdit
    });
  }

  handleOpenEdit(room) {
    this.setState({
      rooms: this.state.rooms,
      openDelete: this.state.openDelete,
      currentRoom: room,
      token_expired: this.state.token_expired,
      openEdit: true
    });
  }

  handleCloseEdit() {
    this.setState({
      rooms: this.state.rooms,
      openDelete: this.state.openDelete,
      currentRoom: null,
      token_expired: this.state.token_expired,
      openEdit: false
    });
  }

  deleteRoom() {
    global = JSON.parse(localStorage.getItem('global'))

    fetch(baseURL + "api/v1/rooms/" + this.state.currentRoom, {
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
      .then(data => {
        var deletedRoom = this.state.rooms.pop(this.state.currentRoom);
        this.setState({
          rooms: this.state.rooms,
          openDelete: false,
          currentRoom: null,
          token_expired: this.state.token_expired,
          openEdit: false
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });
  }

  isInt(value) {
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
  }

  editRoom() {
    global = JSON.parse(localStorage.getItem('global'))

    if (this.state.openEdit) {
      var accessLevel = document.getElementById("access-level").value;
      var occupation = document.getElementById("occupation").value;

      if (accessLevel == null || accessLevel === "" || !this.isInt(accessLevel))
        accessLevel = this.state.currentRoom.accessLevel;
      if (occupation == null || occupation === "" || !this.isInt(occupation))
        occupation = this.state.currentRoom.occupation;
      var data = {
        roomNumber: this.state.currentRoom.roomNumber,
        height: this.state.currentRoom.height,
        width: this.state.currentRoom.width,
        maxOccupation: occupation,
        floor: this.state.currentRoom.floor,
        accessLevel: accessLevel,
        dept: {
          id: this.state.currentRoom.dept.id,
          departmentName: this.state.currentRoom.dept.departmentName
        }
      };

      fetch(
        baseURL + "api/v1/rooms/" + this.state.currentRoom.roomNumber,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: global.token
          },
          body: JSON.stringify(data)
        }
      )
        .then(response => {
          if (response.ok) return response.json();
          else if (response.status == "401")
            this.setState({
              token_expired: true
            });
          else {
            throw new Error(response.status);
          }
        })
        .then(data => {
          console.log(this.state.rooms);
          console.log(this.state.currentRoom);
          console.log(data);
          for(var i = 0; i < this.state.rooms.length; i++) {
            if(this.state.rooms[i][0] == data.roomNumber) {
              this.state.rooms[i][2] = data.accessLevel;
              this.state.rooms[i][4] = data.maxOccupation;
            }
          }
          this.setState({
            rooms: this.state.rooms,
            openDelete: false,
            currentRoom: null,
            token_expired: this.state.token_expired,
            openEdit: false
          })
        })
        .catch(error => {
          console.log("error: " + error);
        });
    } else {
      this.handleCloseEdit();
    }
  }

  componentDidMount() {
    global = JSON.parse(localStorage.getItem('global'))

    fetch(baseURL + "api/v1/rooms", {
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
        data.sort((room1, room2) =>
          room1.roomNumber > room2.roomNumber ? 1 : -1
        );
        var tableRooms = [];
        data.forEach(room =>
          global.userInfo.role === "admin" || global.userInfo.role === "security_enforcer"
            ? tableRooms.push([
                "" + room.roomNumber,
                "" + room.dept.departmentName,
                "" + room.accessLevel,
                "" + room.floor,
                "" + room.maxOccupation,
                <button onClick={() => this.handleOpenEdit(room)}>
                  <EditIcon />
                </button>,
                <button
                  style={{ color: "red" }}
                  onClick={() => this.handleOpen(room.roomNumber)}
                >
                  <DeleteIcon />
                </button>
              ])
            : tableRooms.push([
                "" + room.roomNumber,
                "" + room.dept.departmentName,
                "" + room.accessLevel,
                "" + room.floor,
                "" + room.maxOccupation
              ])
        );
        this.setState({
          rooms: tableRooms,
          openDelete: this.state.openDelete,
          currentRoom: this.state.currentRoom,
          token_expired: this.state.token_expired,
          openEdit: this.state.openEdit,
          isLoaded: true
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });
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

    return (
      <div>
        {this.renderRedirectLogin()}
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="success">
                <h4 style={{ color: "white" }}>Rooms</h4>
                <p style={{ color: "white" }}>
                  List with all rooms in the company
                </p>
              </CardHeader>
              {this.state.rooms.length > 0 && (
                <CardBody>
                  <Table
                    tableHeaderColor="success"
                    tableHead={global.userInfo.role === "admin" || global.userInfo.role === "security_enforcer" ? [
                      "Room number",
                      "Department",
                      "Access Level",
                      "Floor",
                      "Max Occupation",
                      "Edit",
                      "Delete"
                    ] :
                    [
                      "Room number",
                      "Department",
                      "Access Level",
                      "Floor",
                      "Max Occupation"
                    ]}
                    tableData={this.state.rooms}
                  />
                </CardBody>
              )}
            </Card>
          </GridItem>
        </GridContainer>
        <div id="edit-room-dialog">
          {this.state.currentRoom != null && (
            <Dialog
              open={this.state.openEdit}
              onClose={this.handleCloseEdit}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Edit Room {this.state.currentRoom.roomNumber}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please, edit room details and save changes.
                </DialogContentText>
                <GridContainer>
                  <GridItem xs={5} sm={5} md={5}>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="access-level"
                      label="Access level"
                      type="text"
                    />
                  </GridItem>
                  <GridItem xs={1} sm={1} md={1}></GridItem>
                  <GridItem xs={5} sm={5} md={5}>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="occupation"
                      label="Occupation"
                      type="text"
                    />
                  </GridItem>
                  <GridItem xs={1} sm={1} md={1}></GridItem>
                </GridContainer>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseEdit} color="cancel">
                  Cancel
                </Button>
                <Button onClick={this.editRoom} color="info">
                  Update
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </div>
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
              <strong>Room {this.state.currentRoom}</strong> will be{" "}
              <strong color="danger">PERMANENTLY DELETED</strong>. This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose()} color="info">
              Cancel
            </Button>
            <Button onClick={() => this.deleteRoom()} color="danger" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default TypographyPage;
