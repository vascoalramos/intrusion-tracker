import React from "react";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button.js";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CompanyIcon from "@material-ui/icons/Business";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";

import avatar from "assets/img/company.png";

import global from "../../variables/global.js";
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

export default class Company extends React.Component {
  state = {
    name: "",
    address: "",
    email: "",
    phone: "",
    dialog: false,
    errorMessage: "",
    token_expired: false
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
    var name = document.getElementById("company-name").value;
    var email = document.getElementById("email").value;
    var address = document.getElementById("address").value;
    var phone = document.getElementById("phone-number").value;

    var errorMessage = "";
    if (name !== "" && this.isInt(name)) errorMessage = "Invalid company name!";
    else if (email !== "" && !this.validateEmail(email))
      errorMessage = "Invalid email!";
    else if (address !== "" && this.isInt(address))
      errorMessage = "Invalid address !";
    else if (phone !== "" && !this.isInt(phone))
      errorMessage = "Invalid phone number!";

    if (errorMessage !== "") {
      this.setState({
        name: "",
        address: "",
        email: "",
        phone: "",
        dialog: false,
        errorMessage: errorMessage,
        token_expired: false
      });
      return;
    }

    if (name !== "" || email !== "" || address !== "" || phone !== "")
      this.setState({
        name: name,
        address: address,
        email: email,
        phone: phone,
        dialog: true,
        errorMessage: "",
        token_expired: false
      });
  }

  updateCompany() {
    global = JSON.parse(localStorage.getItem('global'))

    var name = this.state.name === "" ? global.userInfo.person.company.name : this.state.name;
    var email = this.state.email === "" ? global.userInfo.person.company.email : this.state.email;
    var phone = this.state.phone === "" ? global.userInfo.person.company.phoneNumber : this.state.phone;
    var address = this.state.address === "" ? global.userInfo.person.company.address : this.state.address;

    var data = {
        name: name,
        email: email,
        phoneNumber: phone,
        address: address
    }

    fetch(baseURL + "api/v1/companies/" + global.userInfo.person.company.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: global.token
        },
        body: JSON.stringify(data)
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
            var temp_global = JSON.parse(localStorage.getItem('global'));
            temp_global["userInfo"]["person"]["company"]["name"] = data.name;
            temp_global["userInfo"]["person"]["company"]["address"] = data.address;
            temp_global["userInfo"]["person"]["company"]["email"] = data.email;
            temp_global["userInfo"]["person"]["company"]["phone"] = data.phone;
            localStorage.setItem('global', JSON.stringify(temp_global));
    
            global = JSON.parse(localStorage.getItem('global'))
            
            document.getElementById("company-name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("address").value = "";
            document.getElementById("phone-number").value = "";
            this.setState({
                name: data.name,
                address: data.address,
                email: data.email,
                phone: data.phone,
                dialog: false,
                errorMessage: "",
                token_expired: false
            })
        })
        .catch(error => {
          console.log("error: " + error);
        });

    
  }

  
  handleClose() {
    document.getElementById("company-name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("address").value = "";
    document.getElementById("phone-number").value = "";
    this.setState({
      name: "",
      address: "",
      email: "",
      phone: "",
      dialog: false,
      errorMessage: "",
      token_expired: false
    });
  }

  componentDidMount() {
    global = JSON.parse(localStorage.getItem('global'))

    if(global.userInfo === null) {
      this.setState({token_expired: true})
    }
  }

  //Go back to login
  renderRedirectLogin() {
    if (this.state.token_expired) {
      localStorage.setItem('global', null);
      return <Redirect to="/login" />;
    }
  };


  render() {
    global = JSON.parse(localStorage.getItem('global'))

    return (
      <div id="company">
        {this.renderRedirectLogin()}
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="info">
                <h4 style={cardTitleWhite}>Edit Company</h4>
                <p style={cardCategoryWhite}>Details of your company</p>
              </CardHeader>
              <CardBody>
                {global.userInfo !== null ? global.userInfo.role === "admin" ||
                global.userInfo.role === "security-enforcer" ? (
                  <div>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText="Company name"
                          id="company-name"
                          formControlProps={{
                            fullWidth: true
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText="Email"
                          id="email"
                          formControlProps={{
                            fullWidth: true
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText="Address"
                          id="address"
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
                  </div>
                ) : (
                  <div>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <h5>
                          You do not have permissions do edit company settings.
                        </h5>
                      </GridItem>
                    </GridContainer>
                  </div>
                ) : ""}
              </CardBody>
              {global.userInfo !== null ? global.userInfo.role === "admin" ||
              global.userInfo.role === "security-enforcer" ? (
                <CardFooter>
                  <Button color="info" onClick={() => this.handleOpen()}>
                    Update Company
                  </Button>
                  {this.state.errorMessage !== "" && (
                    <h4 id="error" style={{ color: "red" }}>
                      {this.state.errorMessage}
                    </h4>
                  )}
                </CardFooter>
              ) : (
                ""
              ) : ""}
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
                <h6>Company ID: {global.userInfo !== null ? global.userInfo.person.company.id : ""}</h6>
                <h4>{global.userInfo !== null ? global.userInfo.person.company.name : ""}</h4>
                <a>
                  {global.userInfo !== null ? global.userInfo.person.company.email : ""}
                </a>
                <p>
                  {global.userInfo !== null ? global.userInfo.person.company.name != null
                    ? global.userInfo.person.company.address
                    : "" : ""}
                </p>
                <p>
                  {global.userInfo !== null ? global.userInfo.phoneNumber != null
                    ? "+351 " + global.userInfo.person.company.phoneNumber
                    : "" : ""}
                </p>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Dialog
          open={this.state.dialog}
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
                {this.state.name !== "" && (
                  <li>
                    <strong>Company name: </strong>{this.state.name}
                  </li>
                )}
                {this.state.email !== "" && (
                  <li>
                    <strong>Email: </strong>{this.state.email}
                  </li>
                )}
                {this.state.address !== "" && (
                  <li>
                    <strong>Address: </strong>{this.state.address}
                  </li>
                )}
                {this.state.phone !== "" && (
                  <li>
                    <strong>Phone number: </strong>{this.state.phone}
                  </li>
                )}
              </ol>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="info" onClick={() => this.handleClose()}>
              Cancel
            </Button>
            <Button color="danger" onClick={() => this.updateCompany()} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
