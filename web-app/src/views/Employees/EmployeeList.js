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

import EmployeeForm from "./EmployeeForm";

import global from "../../variables/global";
import baseURL from "../../variables/baseURL";

import { Hidden } from "@material-ui/core";

class TypographyPage extends React.Component {
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
    admin: false,
    employees: [],
    isLoaded: false,
    redirect: false,
    openDelete: false,
    currentemployee: null,
    currentEmployeeName: null,
    token_expired: false,
    openEdit: false
  };

  handleOpen(employeeNumber, employeeName) {
    this.setState({
      employees: this.state.employees,
      openDelete: true,
      currentemployee: employeeNumber,
      currentEmployeeName: employeeName,
      token_expired: this.state.token_expired,
      openEdit: this.state.openEdit
    });
  }

  handleClose() {
    this.setState({
      employees: this.state.employees,
      openDelete: false,
      currentemployee: null,
      currentEmployeeName: null,
      token_expired: this.state.token_expired,
      openEdit: this.state.openEdit
    });
  }

  handleOpenEdit(employee) {
    this.setState({
      employees: this.state.employees,
      openDelete: this.state.openDelete,
      currentemployee: employee,
      currentEmployeeName: this.state.currentEmployeeName,
      token_expired: this.state.token_expired,
      openEdit: true
    });
  }

  handleCloseEdit() {
    document.getElementById("error_level").style.display = "None";

    this.setState({
      employees: this.state.employees,
      openDelete: this.state.openDelete,
      currentemployee: null,
      currentEmployeeName: null,
      token_expired: this.state.token_expired,
      openEdit: false,
      redirect: false
    });
  }

  editemployee() {
    global = JSON.parse(localStorage.getItem("global"));

    var digit_check = /^\d+$/;
    if (!digit_check.test(document.getElementById("new_access_level").value)) {
      document.getElementById("error_level").style.display = "";
    } else {
      document.getElementById("error_level").style.display = "None";

      fetch(baseURL + "api/v1/person-access-level", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: global.token
        },
        body: JSON.stringify({
          accessLevel: parseInt(
            document.getElementById("new_access_level").value
          ),
          personId: parseInt(this.state.currentemployee.id)
        })
      })
        .then(response => {
          if (response.ok) return response;
          else if (response.status == "401") {
            this.setState({
              token_expired: true
            });
          } else {
            throw new Error(response.status);
          }
        })
        .then(data => {
          for (var i = 0; i < this.state.employees.length; i++) {
            console.log(this.state.employees[i][0]);
            if (this.state.employees[i][0] == this.state.currentemployee.id) {
              this.state.employees[i][3] = document.getElementById(
                "new_access_level"
              ).value;
            }
          }
          this.setState({
            employees: this.state.employees,
            openDelete: false,
            currentRoom: null,
            token_expired: this.state.token_expired,
            openEdit: false
          });
          this.handleCloseEdit();
        })
        .catch(error => {
          console.log("error: " + error);
        });
    }
  }

  deleteemployee() {
    global = JSON.parse(localStorage.getItem("global"));

    console.log(this.state.currentemployee);
    fetch(baseURL + "api/v1/persons/" + this.state.currentemployee, {
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
        for (var i = 0; i < this.state.employees.length; i++) {
          if (this.state.employees[i][0] == this.state.currentemployee) {
            this.state.employees.splice(i, 1);
            break;
          }
        }

        if (this.state.employees.length == null) {
          this.state.employees = [];
        }

        this.setState({
          employees: this.state.employees,
          openDelete: false,
          currentemployee: null,
          currentEmployeeName: null,
          token_expired: this.state.token_expired,
          openEdit: false
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });
  }
  componentDidMount() {
    global = JSON.parse(localStorage.getItem("global"));

    if (global["userInfo"] != null && global["userInfo"]["role"] == "admin") {
      this.setState({
        admin: true
      });
    }

    fetch(baseURL + "api/v1/persons", {
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
        if (data != null && data != {}) {
          // sort ascending by employee number
          data.sort((employee1, employee2) =>
            employee1.id > employee2.id ? 1 : -1
          );
          var tableEmployees = [];
          data.forEach(employee => {
            var dept = "None";
            var team = "None";
            if (employee.dept != null) {
              dept = employee.dept.departmentName;
            }
            if (employee.team != null) {
              team = employee.team.teamName;
            }

            var temp_info = [];
            temp_info.push("" + employee.id);
            temp_info.push("" + employee.email);
            temp_info.push("" + employee.lname + ", " + employee.fname);
            temp_info.push("" + employee.accessLevel);
            temp_info.push("" + dept);
            temp_info.push("" + team);

            if (
              global["userInfo"]["role"] == "admin" &&
              global["userInfo"]["person"]["id"] != employee.id
            ) {
              temp_info.push(
                <button
                  style={{ color: "primary" }}
                  onClick={() => this.handleOpenEdit(employee)}
                >
                  <EditIcon />
                  <strong style={{ marginLeft: "3px" }}>Access Level</strong>
                </button>
              );

              temp_info.push(
                <button
                  style={{ color: "red" }}
                  onClick={() =>
                    this.handleOpen(
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
              temp_info.push("");
            }

            tableEmployees.push(temp_info);
          });
          this.setState({
            employees: tableEmployees,
            isLoaded: true,
            openDelete: this.state.openDelete,
            currentEmployee: this.state.currentEmployee,
            currentEmployeeName: this.state.currentEmployeeName,
            token_expired: this.state.token_expired,
            openEdit: this.state.openEdit
          });
        } else {
          this.setState({
            employees: [],
            isLoaded: true,
            openDelete: this.state.openDelete,
            currentEmployee: this.state.currentEmployee,
            currentEmployeeName: this.state.currentEmployeeName,
            token_expired: this.state.token_expired,
            openEdit: this.state.openEdit
          });
        }
      })
      .catch(error => {
        console.log("error: " + error);
      });

  }

  //Go back to login
  renderRedirectLogin = () => {
    if (this.state.token_expired) {
      localStorage.setItem("global", null);
      return <Redirect to="/login" />;
    }
  };

  set_redirect = () => {
    this.setState({
      redirect: true
    });
  };

  render() {
    const { admin, redirect, isLoaded } = this.state;
    var hide = "None";

    if (!isLoaded) {
      console.log("Loading")
      return (
        <div>
          {this.renderRedirectLogin()}
          <h2>Loading...</h2>
        </div>
      );
    }

    if (admin) {
      hide = "";
    }

    if (!redirect) {
      return (
        <div>
          {this.renderRedirectLogin()}
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="primary">
                  <h4 style={{ color: "white" }}>
                    <strong>Employees</strong>
                  </h4>
                  <p style={{ color: "white" }}>
                    List with all registered employees
                  </p>
                </CardHeader>
                {this.state.employees.length > 0 && (
                  <CardBody>
                    <Button
                      color="primary"
                      id="add_button"
                      style={{ display: hide }}
                      onClick={() => this.set_redirect()}
                    >
                      Add Employee
                    </Button>
                    <Table
                      tableHeaderColor="primary"
                      tableHead={[
                        "ID",
                        "Email",
                        "Name",
                        "Access Level",
                        "Department",
                        "Team",
                        "",
                        ""
                      ]}
                      tableData={this.state.employees}
                    />
                  </CardBody>
                )}
              </Card>
            </GridItem>
          </GridContainer>
          <div id="edit-employee-dialog">
            {this.state.currentemployee != null && (
              <Dialog
                open={this.state.openEdit}
                onClose={this.handleCloseEdit}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  Edit employee {this.state.currentemployee.id} -{" "}
                  {this.state.currentemployee.fname}{" "}
                  {this.state.currentemployee.lname}'s Access Level
                </DialogTitle>
                <DialogContent>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="new_access_level"
                        label="Access Level"
                        type="text"
                        defaultValue={this.state.currentemployee.accessLevel}
                      />
                    </GridItem>
                    <GridItem xs={1} sm={1} md={1}></GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      <h4
                        id="error_level"
                        style={{ display: "none", color: "red" }}
                      >
                        The access level must be a NUMBER BIGGER THAN 0
                      </h4>
                    </GridItem>
                  </GridContainer>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseEdit} color="cancel">
                    Cancel
                  </Button>
                  <Button onClick={() => this.editemployee()} color="info">
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
              {"Are you sure you want to delete this employee?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                The employee{" "}
                <strong>
                  {this.state.currentemployee} -{" "}
                  {this.state.currentEmployeeName}
                </strong>{" "}
                will be <strong color="danger">PERMANENTLY DELETED</strong>.
                This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleClose()} color="info">
                Cancel
              </Button>
              <Button
                onClick={() => this.deleteemployee()}
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
      return <EmployeeForm />;
    }
  }
}

export default TypographyPage;
