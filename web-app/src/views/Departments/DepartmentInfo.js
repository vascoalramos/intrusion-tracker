import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";

// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { withStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

import Button from "components/CustomButtons/Button.js";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { bugs, website, server } from "variables/general.js";

import global from "../../variables/global";
import baseURL from "../../variables/baseURL";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import DepartmentList from "./DepartmentList";

export class DepartmentInfo extends Component {
  state = {
    open_delete: false,
    isAdmin: false,
    open_edit: "disabled",
    isLoaded: false,
    redirect: false,
    dept_employees: [],
    dept_rooms: []
  };

  // Calls to our API
  componentDidMount = () => {
    global = JSON.parse(localStorage.getItem('global'))

    if (global.userInfo.role == "admin") {
      console.log("Admin!");
      this.setState({
        isAdmin: true
      });
    }
    //Get a list of employees
    fetch(
      baseURL + "api/v1/persons-in-department/" + this.props.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: global["token"]
        }
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
        var temp_employees = [];
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          temp_employees.push([
            data[i]["id"],
            data[i]["lname"] + ", " + data[i]["fname"],
            data[i]["email"],
            data[i]["accessLevel"]
          ]);
        }
        this.setState({
          dept_employees: temp_employees
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });

    //Get a list of rooms
    fetch(
      baseURL + "api/v1/rooms-in-department/" + this.props.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: global["token"]
        }
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
        var temp_rooms = [];
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          temp_rooms.push([
            data[i]["roomNumber"],
            data[i]["floor"],
            data[i]["maxOccupation"],
            data[i]["width"] + "x" + data[i]["height"],
            data[i]["accessLevel"]
          ]);
        }
        this.setState({
          dept_rooms: temp_rooms
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });
    this.setState({
      isLoaded: true
    });
  };

  go_back() {
    this.setState({
      redirect: true
    });
  }

  //Go back to login
  renderRedirectLogin = () => {
    if (this.state.token_expired) {
      localStorage.setItem('global', null);
      return <Redirect to="/login" />;
    }
  };

  //Modal Controls
  handleClickOpenDelete() {
    this.setState({
      open_delete: true
    });
  }

  handleClickOpenEdit() {
    this.setState({
      open_edit: true
    });
  }

  handleClose() {
    this.setState({
      open_delete: false,
      open_edit: false
    });
  }

  //Delete department
  deleteDepartment() {
    global = JSON.parse(localStorage.getItem('global'))

    fetch(baseURL + "api/v1/departments/" + this.props.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: global["token"]
      }
    })
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
        this.setState({
          redirect: true
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });
  }

  //Edit department
  edit() {
    global = JSON.parse(localStorage.getItem('global'))

    if (this.state.open_edit == "") {
      var data = {
        departmentName: this.inputValue.value
      };

      //Get a list of employees
      fetch(baseURL + "api/v1/departments/" + this.props.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: global["token"]
        },
        body: JSON.stringify(data)
      })
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
          this.setState({
            open_edit: "disabled"
          });
        })
        .catch(error => {
          console.log("error: " + error);
        });
    } else {
      this.setState({
        open_edit: ""
      });
    }
  }

  _handleKeyDown = e => {
    global = JSON.parse(localStorage.getItem('global'))

    if (e.key === "Enter") {
      var data = {
        departmentName: this.inputValue.value
      };

      //Get a list of employees
      fetch(baseURL + "api/v1/departments/" + this.props.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: global["token"]
        },
        body: JSON.stringify(data)
      })
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
          this.setState({
            open_edit: "disabled"
          });
        })
        .catch(error => {
          console.log("error: " + error);
        });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.open_edit == "") {
      try {
        this.inputValue.focus();
      } catch (error) {}
    }
  }

  render() {
    const { classes, id, name } = this.props;
    const {
      isLoaded,
      redirect,
      isAdmin,
      dept_employees,
      dept_rooms,
      open_delete,
      open_edit
    } = this.state;

    var delete_enable = {display:"None"}
    if(isAdmin){
      delete_enable = {display:""}
    }

    if (!isLoaded) {
      return (
        <div>
          {this.renderRedirectLogin()}
          <h2>Loading...</h2>
        </div>
      );
    } else if (!redirect) {
      return (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="warning">
                  <GridContainer justify="space-between" spacing={10}>
                    <GridItem>
                      <h2 className={classes.cardTitleWhite}>
                        <strong>
                          Department
                          <input
                            autoFocus
                            ref={input => (this.inputValue = input)}
                            style={{
                              background: "None",
                              marginLeft: "10px",
                              color: "white"
                            }}
                            type="text"
                            name="name"
                            placeholder={name}
                            defaultValue={name}
                            disabled={open_edit}
                            onKeyDown={this._handleKeyDown}
                          ></input>
                        </strong>
                      </h2>
                    </GridItem>
                    <GridItem style={delete_enable}>
                      <Icon
                        style={{ cursor: "Pointer" }}
                        fontSize="large"
                        onClick={() => this.edit()}
                      >
                        edit
                      </Icon>
                    </GridItem>
                  </GridContainer>
                </CardHeader>
                <CardFooter stats>
                  <GridContainer justify="space-between" spacing={10}>
                    <GridItem>
                      <Button color="warning" onClick={() => this.go_back()}>
                        <strong>
                          <Icon>arrow_back_ios</Icon> Back to list
                        </strong>
                      </Button>
                    </GridItem>
                    <GridItem>
                      <Button
                        color="danger"
                        style={delete_enable}
                        onClick={() => this.handleClickOpenDelete()}
                      >
                        <strong>
                          <Icon>delete_forever</Icon> Delete
                        </strong>
                      </Button>
                    </GridItem>
                  </GridContainer>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <Card>
                <CardHeader color="warning">
                  <h4 className={classes.cardTitleWhite}>
                    Employees associated with the department
                  </h4>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="warning"
                    tableHead={["ID", "Name", "Email", "Access Level"]}
                    tableData={dept_employees}
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <Card>
                <CardHeader color="warning">
                  <h4 className={classes.cardTitleWhite}>
                    Rooms in the department
                  </h4>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="warning"
                    tableHead={[
                      "#",
                      "Floor",
                      "Max Occupation",
                      "Dimensions",
                      "Access Level"
                    ]}
                    tableData={dept_rooms}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          <Dialog
            open={open_delete}
            onClose={() => this.handleClose()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you sure you want to delete this department?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Both the department {name} and all Employees and Rooms
                associated with it will be PERMANENTLY DELETED. This action
                cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleClose()} color="info">
                Cancel
              </Button>
              <Button
                onClick={() => this.deleteDepartment()}
                color="danger"
                autoFocus
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
    return <DepartmentList classes={classes} />;
  }
}

export default withStyles(styles)(DepartmentInfo);
