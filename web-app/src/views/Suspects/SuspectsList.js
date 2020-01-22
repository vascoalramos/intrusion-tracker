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

import { Hidden } from "@material-ui/core";

class SuspectList extends React.Component {
  constructor() {
    super();
  }
  modal = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  state = {
    admin: false,
    employees: [],
    redirect: false,
    token_expired: false,
  };



  componentDidMount() {
    global = JSON.parse(localStorage.getItem('global'))

    if (global["userInfo"] != null && global["userInfo"]["role"] == "admin") {
      this.setState({
        admin: true
      });
    }

    fetch(baseURL + "api/v1/suspicious-persons", {
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

            tableEmployees.push(temp_info);
          });
          this.setState({
            employees: tableEmployees,
            token_expired: this.state.token_expired,
            isLoaded: true,
          });
        } else {
          this.setState({
            employees: [],
            token_expired: this.state.token_expired,
            isLoaded: true
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
      localStorage.setItem('global', null);
      return <Redirect to="/login" />;
    }
  };

  render() {
    const { admin,isLoaded } = this.state;
    var hide = "None";
    if (admin) {
      hide = "";
    }

    if (!isLoaded) {
      console.log("Loading")
      return (
        <div>
          {this.renderRedirectLogin()}
          <h2>Loading...</h2>
        </div>
      );
    }else if (this.state.employees.length == 0){
      return(
      <div>
        {this.renderRedirectLogin()}
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="danger">
                <h4 style={{ color: "white" }}>
                  <strong>Suspect Employees</strong>
                </h4>
                <p style={{ color: "white" }}>
                  List with all employees suspicious of nefarious actions
                </p>
              </CardHeader>
                <CardBody>
                  <h3>There are no suspect employees at the moment!</h3>
                </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
      );
    }

    return (
      <div>
        {this.renderRedirectLogin()}
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="danger">
                <h4 style={{ color: "white" }}>
                  <strong>Suspect Employees</strong>
                </h4>
                <p style={{ color: "white" }}>
                  List with all employees suspicious of nefarious actions
                </p>
              </CardHeader>
              {this.state.employees.length > 0 && (
                <CardBody>
                  <Table
                    tableHeaderColor="danger"
                    tableHead={[
                      "ID",
                      "Email",
                      "Name",
                      "Access Level",
                      "Department",
                      "Team"
                    ]}
                    tableData={this.state.employees}
                  />
                </CardBody>
              )}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default SuspectList;
