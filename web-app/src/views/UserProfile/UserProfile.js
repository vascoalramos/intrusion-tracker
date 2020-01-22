import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import TextField from "@material-ui/core/TextField";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import avatar from "assets/img/faces/profile-pic.png";

import baseURL from "../../variables/baseURL";

const cardCategoryWhite = {
  color: "rgba(255,255,255,.62)",
  margin: "0",
  fontSize: "14px",
  marginTop: "0",
  marginBottom: "0"
};
const cardTitleWhite = {
  color: "#FFFFFF",
  marginTop: "0px",
  minHeight: "auto",
  fontWeight: "300",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  marginBottom: "3px",
  textDecoration: "none"
};

class UserProfile extends React.Component {
  constructor() {
    super();
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }
  state = {
    confirmDialog: false,
    fname: "",
    lname: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    errorMessage: "",
    redirect: false,
    token_expired: false,
    isLoaded: false
  };

  isInt(value) {
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  handleOpen() {
    global = JSON.parse(localStorage.getItem('global'))

    var fname = document.getElementById("first-name").value;
    var lname = document.getElementById("last-name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone-number").value;
    var currentPassword = document.getElementById("current-password").value;
    var newPassword = document.getElementById("new-password").value;
    var currentNewPassword = document.getElementById("current-new-password")
      .value;

    var errorMessage = "";
    if (fname !== "" && this.isInt(fname)) errorMessage = "Invalid first name!";
    else if (lname !== "" && this.isInt(lname))
      errorMessage = "Invalid last name!";
    else if (email !== "" && !this.validateEmail(email))
      errorMessage = "Invalid email!";
    else if (phone !== "" && !this.isInt(phone))
      errorMessage = "Invalid phone number!";
    else if (currentPassword !== "" && newPassword === "")
      errorMessage = "You need to insert a new password!";
    else if (currentPassword === "" && newPassword !== "")
      errorMessage = "Please, insert your current password!";
    else if (
      currentPassword !== "" &&
      global.token !==
        "Basic " + btoa(global.userInfo.person.email + ":" + currentPassword)
    )
      errorMessage = "Current password incorrect!";
    else if (
      currentPassword !== "" &&
      newPassword !== "" &&
      currentPassword === newPassword
    )
      errorMessage = "You can not use the same password!";
    else if (newPassword !== "" && currentNewPassword === "")
      errorMessage = "Please, confirm the new password!";
    else if (
      newPassword !== "" &&
      currentNewPassword !== "" &&
      newPassword !== currentNewPassword
    )
      errorMessage = "New password not confirmed!";

    if (errorMessage !== "") {
      this.setState({
        confirmDialog: false,
        fname: "",
        lname: "",
        email: "",
        phone: "",
        currentPassword: "",
        newPassword: "",
        errorMessage: errorMessage
      });
      return;
    }

    if (
      fname !== "" ||
      lname !== "" ||
      email !== "" ||
      phone !== "" ||
      currentPassword !== "" ||
      newPassword !== ""
    )
      this.setState({
        confirmDialog: true,
        fname: fname,
        lname: lname,
        email: email,
        phone: phone,
        currentPassword: currentPassword,
        newPassword: newPassword,
        errorMessage: ""
      });
  }

  handleClose() {
    this.setState({ confirmDialog: false });
  }

  updateUser() {
    global = JSON.parse(localStorage.getItem('global'))

    var fname =
      this.state.fname === "" ? global.userInfo.person.fname : this.state.fname;
    var lname =
      this.state.lname === "" ? global.userInfo.person.lname : this.state.lname;
    var email =
      this.state.email === "" ? global.userInfo.person.email : this.state.email;
    var phone =
      this.state.phone === "" ? global.userInfo.phoneNumber : this.state.phone;

    var data;

    if (this.state.newPassword === "")
      data = {
        person: {
          email: email,
          fname: fname,
          lname: lname
        },
        phoneNumber: phone
      };
    else
      data = {
        person: {
          email: email,
          fname: fname,
          lname: lname
        },
        phoneNumber: phone,
        passwd: this.state.newPassword
      };

    fetch(baseURL + "api/v1/users/" + global.userInfo.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: global.token
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

        var temp_global = JSON.parse(localStorage.getItem('global'));
        temp_global["userInfo"] = data;  //Store our logged info
        localStorage.setItem('global', JSON.stringify(temp_global));

        global = JSON.parse(localStorage.getItem('global'))
        
        document.getElementById("first-name").value = "";
        document.getElementById("last-name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone-number").value = "";
        document.getElementById("current-password").value = "";
        document.getElementById("new-password").value = "";
        document.getElementById("current-new-password").value = "";
        global.userInfo = data;
        this.setState({
          confirmDialog: false,
          fname: "",
          lname: "",
          email: "",
          phone: "",
          currentPassword: "",
          newPassword: "",
          errorMessage: ""
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });
  }

  componentDidMount() {
    global = JSON.parse(localStorage.getItem('global'))

    if (global.userInfo == null) {
      this.setState({ redirect: true });
    }

    this.setState({ isLoaded: true });
  }

  //Go back to login
  renderRedirectLogin = () => {
    if (this.state.redirect || this.state.token_expired) {
      localStorage.setItem('global', null);
      return <Redirect to="/login" />;
    }
  };

  render() {
    const { redirect, isLoaded } = this.state;
    global = JSON.parse(localStorage.getItem('global'))

    if (!isLoaded) {
      return (
        <div>
          {this.renderRedirectLogin()}
          <h2>Loading...</h2>
        </div>
      );
    }

    if (redirect) {
      return <div>{this.renderRedirectLogin()}</div>;
    }
    return (
      <div>
        <h2>User profile</h2>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4 style={cardTitleWhite}>Edit Profile</h4>
                <p style={cardCategoryWhite}>Complete your profile</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="First Name"
                      id="first-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Last Name"
                      id="last-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Phone number"
                      id="phone-number"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer style={{ marginTop: "30px" }}>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Current password"
                      id="current-password"
                      password={true}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="New password"
                      id="new-password"
                      password={true}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Confirm new password"
                      id="current-new-password"
                      password={true}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="info" onClick={this.handleOpen}>
                  Update Profile
                </Button>
                {this.state.errorMessage !== "" && (
                  <h4 id="error" style={{ color: "red" }}>
                    {this.state.errorMessage}
                  </h4>
                )}
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardAvatar profile>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  <img src={avatar} alt="..." />
                </a>
              </CardAvatar>
              <CardBody profile>
                <h6>{global.userInfo.role}</h6>
                <h4>
                  {global.userInfo.person.fname +
                    " " +
                    global.userInfo.person.lname}
                </h4>
                <a href={"mailto:" + global.userInfo.person.email}>
                  {global.userInfo.person.email}
                </a>
                <p>
                  {global.userInfo.phoneNumber != null
                    ? "+351 " + global.userInfo.phoneNumber
                    : ""}
                </p>
                <p>
                  {global.userInfo.person.company.name != null ? (
                    <strong>
                      Company: {global.userInfo.person.company.name}
                    </strong>
                    
                  ) : (
                    ""
                  )}
                </p>
                <p>
                  {global.userInfo.person.company !== null ? (
                    <strong>Department: {global.userInfo.person.dept.departmentName}</strong>
                  ) : ""}
                </p>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Dialog
          open={this.state.confirmDialog}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to update user profile?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The following fields will be updated:
              <br />
              <ol>
                {this.state.fname !== "" && (
                  <li>
                    <strong>First name: {this.state.fname}</strong>
                  </li>
                )}
                {this.state.lname !== "" && (
                  <li>
                    <strong>Last name: {this.state.lname}</strong>
                  </li>
                )}
                {this.state.email !== "" && (
                  <li>
                    <strong>Email: {this.state.email}</strong>
                  </li>
                )}
                {this.state.phone !== "" && (
                  <li>
                    <strong>Phone number: {this.state.phone}</strong>
                  </li>
                )}
                {this.state.currentPassword !== "" && (
                  <li>
                    <strong>Password: ******</strong>
                  </li>
                )}
              </ol>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose()} color="info">
              Cancel
            </Button>
            <Button onClick={() => this.updateUser()} color="danger" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default UserProfile;
