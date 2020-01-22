import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";

import global from "../../variables/global";
import baseURL from "../../variables/baseURL";

export class Logout extends Component {
  state = {
    redirect: false
  };

  // Calls to our API
  componentDidMount = () => {
    //Logout
    fetch(baseURL + "api/v1/logout", {
      method: "GET"
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response;
      })
      .then(data => {
        localStorage.setItem('global', null);

        this.setState({ redirect: true });
      })
      .catch(error => {
        console.log("error: " + error);
      });
  };

  //Go back to login
  renderRedirectLogin = () => {
    if (this.state.redirect) {
      try{
        document.getElementById("header").style.display = "";
      }catch{
        console.log("error loading header")
      }

      return <Redirect to="/login" />;
    }
  };

  render() {
    return <div>{this.renderRedirectLogin()}</div>;
  }
}

export default Logout;
