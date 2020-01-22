import React, { Component } from "react";
// @material-ui/core components
import InputLabel from "@material-ui/core/InputLabel";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CustomSelect from "components/CustomInput/CustomSelect.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import avatar from "assets/img/faces/marc.jpg";

import global from "../../variables/global";
import baseURL from "../../variables/baseURL";

import EmployeeList from "./EmployeeList"

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

export class EmployeeForm extends Component {
  state = {
    isLoaded: false,
    isAdmin: true,
    redirect: false,
    token_expired: false,
    redirect: false,
    departments: [],
    teams: [],

    role: null
  };

  // Calls to our API
  componentDidMount = () => {
    global = JSON.parse(localStorage.getItem('global'))

    console.log(global["userInfo"]);
    if (global["userInfo"] == null) {
      this.setState({
        token_expired: true
      });
      return;
    }
    if (global["userInfo"]["role"] != "admin") {
      this.setState({
        isLoaded: true,
        isAdmin: false
      });
      return;
    }
    fetch(baseURL + "api/v1/departments", {
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
        var temp_array = [{ id: "None", value: "None" }];
        for (var i = 0; i < data.length; i++) {
          temp_array.push({
            id: data[i]["id"],
            value: data[i]["departmentName"]
          });
        }
        this.setState({
          departments: temp_array
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });
    fetch(baseURL + "api/v1/teams", {
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
        var temp_array = [{ id: "None", value: "None" }];
        for (var i = 0; i < data.length; i++) {
          temp_array.push({
            id: data[i]["id"],
            value: data[i]["teamName"]
          });
        }
        this.setState({
          teams: temp_array
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });

    this.setState({
      isLoaded: true
    });
  };

  //Go back to login
  renderRedirectLogin = () => {
    if (this.state.token_expired) {
      localStorage.setItem('global', null);
      return <Redirect to="/login" />;
    }
  };

  //Go back to login
  renderRedirectSuccess = () => {
    if (this.state.redirect) {
      return <Redirect to="/admin/employees" />;
    }
  };

  addEmployee = () => {
    global = JSON.parse(localStorage.getItem('global'))

    var digit_check = /^\d+$/;
    var email_check = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (
      document.getElementById("email").value == "" ||
      document.getElementById("fname").value == "" ||
      document.getElementById("lname").value == "" ||
      document.getElementById("level").value == "" ||
      document.getElementById("role").value == "" ||
      document.getElementById("dept").value == "" ||
      document.getElementById("team").value == ""
    ) {
      document.getElementById("error").style.display = "";
      document.getElementById("error_level").style.display = "None";
      document.getElementById("error_email").style.display = "None";
    } else {
      document.getElementById("error").style.display = "None";
      var reg = true;

      if (!digit_check.test(document.getElementById("level").value)) {
        document.getElementById("error_level").style.display = "";
        reg = false;
      } else {
        document.getElementById("error_level").style.display = "None";
      }

      if (!email_check.test(document.getElementById("email").value)) {
        document.getElementById("error_email").style.display = "";
        reg = false;
      } else {
        document.getElementById("error_email").style.display = "None";
      }

      if (reg) {
        var new_data = {
          person: {
            email: null,
            fname: null,
            lname: null,
            accessLevel: null,
            company: {
              id: global["userInfo"]["person"]["company"]["id"]
            },
            dept: null,
            team: null
          },
          role: "admin",
          phoneNumber: null
        };

        //Obligatory Info
        new_data["person"]["email"] = document.getElementById("email").value;
        new_data["person"]["fname"] = document.getElementById("fname").value;
        new_data["person"]["lname"] = document.getElementById("lname").value;
        new_data["person"]["accessLevel"] = parseInt(
          document.getElementById("level").value
        );
        new_data["person"]["role"] = document.getElementById("role").value;

        //Optional Info
        if (document.getElementById("dept").value != "None") {
          new_data["person"]["dept"] = {
            id: document.getElementById("dept").value
          };
        }
        if (document.getElementById("team").value != "None") {
          new_data["person"]["team"] = {
            id: document.getElementById("team").value
          };
        }

        if (document.getElementById("phone").value != null) {
          new_data["person"]["phoneNumber"] = document.getElementById(
            "phone"
          ).value;
        }

        //Register a new employee
        if (document.getElementById("role").value != "Employee") {
          fetch(baseURL + "api/v1/registration", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: global.token
            },
            body: JSON.stringify(new_data)
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
              console.log("Success");
              this.setState({
                redirect: true
              });
            })
            .catch(error => {
              console.log("error: " + error);
              document.getElementById("error").style.display = "";
            });
        } else {
          fetch(baseURL + "api/v1/persons", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: global.token
            },
            body: JSON.stringify(new_data["person"])
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
              console.log("Success Employee");
              this.setState({
                redirect: true
              });
            })
            .catch(error => {
              console.log("error: " + error);
              document.getElementById("error").style.display = "";
            });
        }
      }
    }
  };

  handleChange = e => {
    this.setState({ role: e.target.value });
    if (e.target.value == "Employee") {
      document.getElementById("phone_wrapper").style.display = "None";
    } else {
      document.getElementById("phone_wrapper").style.display = "";
    }
  };

  goBack = () => {
    this.setState({
      redirect: true
    });
  };

  render() {
    const { classes } = this.props;
    const { isLoaded, isAdmin, redirect, departments, teams, role } = this.state;

    if (!isLoaded) {
      return (
        <div>
          {this.renderRedirectLogin()}
          <h2>Loading...</h2>
        </div>
      );
    }
    if(redirect){
      return <EmployeeList/>
    }
    if (!isAdmin) {
      return (
        <div>
          {this.renderRedirectLogin()}
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <h2>
                Sorry, but you do not have permission to register new employees!
              </h2>
              <h3>
                Please contact your administrators for further information
              </h3>
            </GridItem>
            <GridItem xs={12} sm={12} md={12}>
              <Button color="info" onClick={() => this.goBack()}>
                Go Back
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      );
    }
    return (
      <div>
        {this.renderRedirectLogin()}
        {this.renderRedirectSuccess()}
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>
                  <strong>Register a new Employee</strong>
                </h4>
                <p className={classes.cardCategoryWhite}>
                  Please fill all fields marked with a * to complete the
                  registration
                </p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Email *"
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="First Name *"
                      id="fname"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Last Name *"
                      id="lname"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer id="phone_wrapper">
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Phone Number"
                      id="phone"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControl
                      style={{ minWidth: "100%", marginTop: "27px" }}
                    >
                      <InputLabel id="role_id">Role *</InputLabel>

                      <Select
                        labelId="role_id"
                        value={role}
                        onChange={e => this.handleChange(e)}
                        id="role"
                      >
                        {[
                          { id: "Employee", value: "Employee" },
                          { id: "Team Manager", value: "Team Manager" },
                          { id: "Security", value: "Security" },
                          { id: "Admin", value: "Admin" }
                        ].map(value => (
                          <MenuItem key={value.id} value={value.id}>
                            {value.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Access Level *"
                      id="level"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomSelect
                      labelText="Department *"
                      id="dept"
                      val_list={departments}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomSelect
                      labelText="Team *"
                      id="team"
                      val_list={teams}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <h4 id="error" style={{ display: "none", color: "red" }}>
                      Please fill all fields before proceeding!
                    </h4>
                    <h4
                      id="error_level"
                      style={{ display: "none", color: "red" }}
                    >
                      The access level must be a NUMBER BIGGER THAN 0
                    </h4>
                    <h4
                      id="error_email"
                      style={{ display: "none", color: "red" }}
                    >
                      The email must be valid!
                    </h4>
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <GridContainer>
                  <GridItem>
                    <Button color="primary" onClick={() => this.addEmployee()}>
                      Add Employee
                    </Button>
                  </GridItem>
                  <GridItem>
                    <Button color="info" onClick={() => this.goBack()}>
                      Go Back
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(EmployeeForm);
