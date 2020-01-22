import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import global_vars from "../../variables/global";

export class SignupConfirm extends Component {
  state = {
    redirect: false
  };

  // Continue to next step
  continue = e => {
    e.preventDefault();
    var company_data = {
      //TODO: Check if this is correct
      address: this.props.values.c_address,
      email: this.props.values.c_email,
      name: this.props.values.c_name,
      phoneNumber: this.props.values.c_phone_number
    };

    //Create the company
    fetch(global_vars["baseURL"] + "api/v1/companies-reg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(company_data)
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(data => {
        document.getElementById("error").style.display = "None";
        //console.log(data)

        //Create an admin
        var company_id = data["id"];

        var admin_data = {
          person: {
            email: this.props.values.a_email,
            fname: this.props.values.a_fname,
            lname: this.props.values.a_lname,
            accessLevel: 10,
            company: { id: company_id }
          },
          role: "admin"
        };

        if (this.props.a_phone_number != "") {
          admin_data["person"]["phoneNumber"] = this.props.a_phone_number;
        }
        var redirect = false;
        //Register an admin
        fetch(global_vars["baseURL"] + "api/v1/registration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(admin_data)
        })
          .then(response => {
            if (!response.ok) throw new Error(response.status);
            else return response.json();
          })
          .then(data => {
            //console.log("SUCCESS");
            document.getElementById("error").style.display = "None";
            this.setState({
              redirect: true
            });
          })
          .catch(error => {
            console.log("error: " + error);
            document.getElementById("error").style.display = "";
          });
      })
      .catch(error => {
        console.log("error: " + error);
        document.getElementById("error").style.display = "";
      });
  };

  //Redirect to login after success
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
  };

  // Go back to last step
  go_back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const {
      values: {
        c_name,
        c_address,
        c_email,
        c_phone_number,
        a_email,
        a_password,
        a_phone_number,
        a_fname,
        a_lname
      },
      handleChange
    } = this.props;

    return (
      <div className="loginBase" id="login_base">
        <div class="wrap-login100 p-t-30 p-b-50">
          <span class="login100-form-title p-b-41" style={{ marginTop: "5vh" }}>
            Registration
          </span>
          <span class="login100-form-title p-b-41">Confirmation</span>
          <div
            class="login100-form validate-form p-b-33 p-t-5"
            style={{ textAlign: "center" }}
          >
            <h3 style={{ color: "#00adcb" }}>Company Information</h3>
            <List component="nav" aria-label="secondary mailbox folders">
              <ListItem button style={{ cursor: "default" }}>
                <ListItemText primary={c_name} secondary="Company's Name" />
              </ListItem>
              <ListItem button style={{ cursor: "default" }}>
                <ListItemText primary={c_email} secondary="Company's Email" />
              </ListItem>
              <ListItem button style={{ cursor: "default" }}>
                <ListItemText
                  primary={c_phone_number}
                  secondary="Company's Phone Number"
                />
              </ListItem>
              <ListItem button style={{ cursor: "default" }}>
                <ListItemText
                  primary={c_address}
                  secondary="Company's Address"
                />
              </ListItem>
            </List>

            <h3 style={{ color: "#00adcb" }}>Admin Information</h3>
            <List component="nav" aria-label="secondary mailbox folders">
              <ListItem button style={{ cursor: "default" }}>
                <ListItemText
                  primary={a_fname}
                  secondary="Admin's First name"
                />
              </ListItem>
              <ListItem button style={{ cursor: "default" }}>
                <ListItemText primary={a_lname} secondary="Admin's Last Name" />
              </ListItem>
              <ListItem button style={{ cursor: "default" }}>
                <ListItemText primary={a_email} secondary="Admin's Email" />
              </ListItem>
              <ListItem button style={{ cursor: "default" }}>
                <ListItemText
                  primary={a_phone_number}
                  secondary="Admin's Phone Number"
                />
              </ListItem>
            </List>

            <div
              className="container-login100-form-btn m-t-32"
              id="error"
              style={{ display: "none" }}
            >
              <span style={{ color: "red" }}>Error! Registration failed</span>
            </div>

            <div class="container-login100-form-btn m-t-32">
              <button
                class="login100-form-btn"
                style={{ marginRight: "20px" }}
                onClick={this.go_back}
              >
                Back
              </button>
              <button class="login100-form-btn" onClick={this.continue}>
                Confirm
              </button>
              {this.renderRedirect()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SignupConfirm;
