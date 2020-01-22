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
import DeleteIcon from "@material-ui/icons/Delete";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { bugs, website, server } from "variables/general.js";

import global from "../../variables/global";
import baseURL from "../../variables/baseURL";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import TeamList from "./TeamList";
import CustomSelect from "components/CustomInput/CustomSelect";

export class TeamInfo extends Component {
  state = {
    open_delete: false,
    open_edit: "disabled",
    open_remove: false,
    open_add: false,
    isAdmin: false,
    isLoaded: false,
    redirect: false,
    team_employees: [],
    non_team_employees: [],
    team_manager_name: "None",
    team_manager_id: "",
    team_manager_email: "",
    team_manager_phone: "",
    currentemployee: null,
    currentEmployeeName: null
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
    fetch(baseURL + "api/v1/persons-in-team/" + this.props.id, {
      method: "GET",
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
        // sort ascending by employee number
        data.sort((employee1, employee2) =>
          employee1.id > employee2.id ? 1 : -1
        );
        console.log(data);
        var tableEmployees = [];
        data.forEach(employee => {
          var dept = "None";

          if (employee.dept != null) {
            dept = employee.dept.departmentName;
          }

          var temp_info = [];
          temp_info.push("" + employee.id);
          temp_info.push("" + employee.email);
          temp_info.push("" + employee.lname + ", " + employee.fname);
          temp_info.push("" + employee.accessLevel);
          temp_info.push("" + dept);

          if (global["userInfo"]["role"] == "admin") {
            temp_info.push(
              <button
                style={{ color: "red" }}
                onClick={() =>
                  this.handleOpenRemove(
                    employee.id,
                    employee.fname + " " + employee.lname
                  )
                }
              >
                <DeleteIcon />
              </button>
            );
          } else {
            temp_info.push("");
          }

          tableEmployees.push(temp_info);
        });
        this.setState({
          team_employees: tableEmployees,
          team_manager_email: tableEmployees[0][1],
          team_manager_id: tableEmployees[0][0],
          team_manager_phone: "",
          team_manager_name:
            tableEmployees[0][2].split(", ")[1] +
            " " +
            tableEmployees[0][2].split(", ")[0]
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });

    //Get persons not in team
    fetch(baseURL + "api/v1/persons-not-in-team/" + this.props.id, {
      method: "GET",
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
        // sort ascending by employee number
        data.sort((employee1, employee2) =>
          employee1.id > employee2.id ? 1 : -1
        );

        var non_employees = [];
        data.forEach(employee => {
          var depart = "None";

          if (employee.dept != null) {
            depart = employee.dept.departmentName;
          }
          non_employees.push({
            id: employee.id,
            value:
              employee.id +
              " - " +
              employee.fname +
              " " +
              employee.lname +
              " (" +
              employee.email +
              " )",
            email: employee.email,
            name: employee.lname + ", " + employee.fname,
            access: employee.accessLevel,
            dept: depart
          });
        });

        this.setState({
          non_team_employees: non_employees
        });
        console.log(this.state.non_team_employees);
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

  handleOpenRemove(employee_id, employee_name) {
    this.setState({
      open_remove: true,
      currentemployee: employee_id,
      currentEmployeeName: employee_name
    });
  }

  handleClickOpenEdit() {
    this.setState({
      open_edit: true
    });
  }

  handleClickOpenAdd() {
    this.setState({
      open_add: true
    });
  }

  handleClose() {
    this.setState({
      open_delete: false,
      open_edit: "disabled",
      open_remove: false,
      open_add: false,
      currentEmployeeName: null,
      currentemployee: null
    });
  }

  //Delete department
  deleteTeam() {
    global = JSON.parse(localStorage.getItem('global'))

    fetch(baseURL + "api/v1/teams/" + this.props.id, {
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

  //Remove from team
  removeEmployee() {
    global = JSON.parse(localStorage.getItem('global'))

    fetch(baseURL + "api/v1/delete-from-team/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: global["token"]
      },
      body: JSON.stringify({
        personId: this.state.currentemployee,
        teamId: this.props.id
      })
    })
      .then(response => {
        if (response.ok) return response;
        else if (response.status == "401")
          this.setState({
            token_expired: true
          });
        else {
          throw new Error(response.status);
        }
      })
      .then(data => {
        for (var i = 0; i < this.state.team_employees.length; i++) {
          if (this.state.team_employees[i][0] == this.state.currentemployee) {
            this.state.non_team_employees.push({
              id: this.state.team_employees[i][0],
              value:
                this.state.team_employees[i][0] +
                " - " +
                this.state.team_employees[i][2].split(", ")[1] +
                " " +
                this.state.team_employees[i][2].split(", ")[0] +
                " (" +
                this.state.team_employees[i][1] +
                " )",
              email: this.state.team_employees[i][1],
              name: this.state.team_employees[i][2],
              access: this.state.team_employees[i][3],
              dept: this.state.team_employees[i][4]
            });
            this.state.team_employees.splice(i, 1);
            break;
          }
        }

        //Update team employees
        this.setState({
          team_employees: this.state.team_employees
        });

        //Update team manager
        console.log();
        if (this.state.team_manager_id == this.state.currentemployee) {
          if (this.state.team_employees.length > 0) {
            this.setState({
              team_manager_email: this.state.team_employees[0][1],
              team_manager_id: this.state.team_employees[0][0],
              team_manager_phone: "",
              team_manager_name:
                this.state.team_employees[0][2].split(", ")[1] +
                " " +
                this.state.team_employees[0][2].split(", ")[0]
            });
          } else {
            this.setState({
              team_manager_name: "None",
              team_manager_id: "",
              team_manager_email: "",
              team_manager_phone: ""
            });
          }
        }

        this.setState({
          currentemployee: null,
          currentEmployeeName: null
        });

        this.handleClose();
      })
      .catch(error => {
        console.log("error: " + error);
      });
  }

  //Remove from team
  addEmployee() {
    global = JSON.parse(localStorage.getItem('global'))

    if (document.getElementById("new_emp").value == "") {
      this.handleClose();
      return;
    }

    fetch(baseURL + "api/v1/add-to-team/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: global["token"]
      },
      body: JSON.stringify({
        personId: document.getElementById("new_emp").value,
        teamId: this.props.id
      })
    })
      .then(response => {
        if (response.ok) return response;
        else if (response.status == "401")
          this.setState({
            token_expired: true
          });
        else {
          throw new Error(response.status);
        }
      })
      .then(data => {
        for (var i = 0; i < this.state.non_team_employees.length; i++) {
          if (
            this.state.non_team_employees[i].id ==
            parseInt(document.getElementById("new_emp").value)
          ) {
            //Add to employee array
            var temp_info = [];
            var added_employee = this.state.non_team_employees[i];

            temp_info.push(added_employee.id);
            temp_info.push(added_employee.email);
            temp_info.push(added_employee.name);
            temp_info.push(added_employee.access);
            temp_info.push(added_employee.dept);
            if (global["userInfo"]["role"] == "admin") {
              temp_info.push(
                <button
                  style={{ color: "red" }}
                  onClick={() =>
                    this.handleOpenRemove(
                      added_employee.id,
                      added_employee.name.split(", ")[1] +
                        " " +
                        added_employee.name.split(", ")[0]
                    )
                  }
                >
                  <DeleteIcon />
                </button>
              );
            } else {
              temp_info.push("");
            }

            this.state.team_employees.push(temp_info);
            this.state.non_team_employees.splice(i, 1);
            break;
          }
        }

        //Update team employees
        this.setState({
          team_employees: this.state.team_employees,
          non_team_employees: this.state.non_team_employees
        });

        this.handleClose();
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
        teamName: this.inputValue.value
      };

      //Get a list of employees
      fetch(baseURL + "api/v1/teams/" + this.props.id, {
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
        teamName: this.inputValue.value
      };

      //Get a list of employees
      fetch(baseURL + "api/v1/teams/" + this.props.id, {
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
      isAdmin,
      redirect,
      team_employees,
      non_team_employees,
      open_delete,
      open_edit,
      open_add,
      open_remove,
      team_manager_email,
      team_manager_id,
      team_manager_phone,
      team_manager_name,
      currentemployee,
      currentEmployeeName
    } = this.state;

    var controls_enable = { display: "None" };
    if (isAdmin) {
      controls_enable = { display: "" };
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
                <CardHeader color="success">
                  <GridContainer justify="space-between" spacing={10}>
                    <GridItem>
                      <h2 className={classes.cardTitleWhite}>
                        <strong>
                          Team
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
                    <GridItem style={controls_enable}>
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
                      <Button color="success" onClick={() => this.go_back()}>
                        <strong>
                          <Icon>arrow_back_ios</Icon> Back to list
                        </strong>
                      </Button>
                    </GridItem>
                    <GridItem style={controls_enable}>
                      <Button
                        color="danger"
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
            <GridItem xs={12} sm={12} md={8}>
              <Card>
                <CardHeader color="success">
                  <h4 className={classes.cardTitleWhite}>
                    Employees in the team
                  </h4>
                </CardHeader>
                <CardBody>
                  <Button
                    style={controls_enable}
                    color="success"
                    onClick={() => this.handleClickOpenAdd()}
                  >
                    <strong>
                      <Icon>person_add</Icon>
                    </strong>
                  </Button>
                  <Table
                    tableHeaderColor="success"
                    tableHead={[
                      "ID",
                      "Email",
                      "Name",
                      "Access Level",
                      "Department",
                      ""
                    ]}
                    tableData={team_employees}
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <Card>
                <CardHeader color="success" stats icon>
                  <CardIcon color="success">
                    <Icon>supervisor_account</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Team Manager</p>
                  <p>
                    <h2 className={classes.cardTitle}>
                      <strong>{team_manager_name}</strong>
                    </h2>
                  </p>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <h4>{team_manager_email}</h4>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <h4>{team_manager_phone}</h4>
                    </GridItem>
                  </GridContainer>
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
              {"Are you sure you want to delete this team?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Team {name} will be PERMANENTLY DELETED and all it's members
                will be left without a team. This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleClose()} color="info">
                Cancel
              </Button>
              <Button
                onClick={() => this.deleteTeam()}
                color="danger"
                autoFocus
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={open_remove}
            onClose={() => this.handleClose()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you sure you want to remove this employee from the team?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                The Employee {currentEmployeeName} - {currentemployee} will be
                PERMANENTLY REMOVED from the team. This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleClose()} color="info">
                Cancel
              </Button>
              <Button
                onClick={() => this.removeEmployee()}
                color="danger"
                autoFocus
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={open_add}
            onClose={() => this.handleClose()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Add a new employee to the team"}
            </DialogTitle>
            <DialogContent>
              <CustomSelect
                labelText="New Employee"
                id="new_emp"
                val_list={non_team_employees}
                formControlProps={{
                  fullWidth: true
                }}
              />
              <DialogContentText id="alert-dialog-description" style={{marginTop:"15px"}}>
                Note that if the selected employee is already in a team, they'll
                be removed from it and added to this one.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleClose()} color="info">
                Cancel
              </Button>
              <Button
                color="success"
                autoFocus
                onClick={() => this.addEmployee()}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
    return <TeamList classes={classes} />;
  }
}

export default withStyles(styles)(TeamInfo);
