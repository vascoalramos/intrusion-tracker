import React from "react";
import ReactDOM from "react-dom";

import { Redirect } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

import global from "../../variables/global";
import baseURL from "../../variables/baseURL";

class Login extends React.Component {
  state = {
    redirect: false,
    redirect_register: false
  };

  login = e => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const login_info = "Basic " + btoa(username + ":" + password); //TODO: Save this to a global variable

    //console.log(global["baseURL"] + "api/v1/login");
    console.log(login_info);

    //Login
    fetch(baseURL + "api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: login_info
      }
    })
      .then(response => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then(data => {
        document.getElementById("error").style.display = "None";
        var temp_global = {"token": null, "userInfo": null}
        temp_global["token"] = login_info;  //Store our login token
        temp_global["userInfo"] = data;  //Store our logged info
        localStorage.setItem('global', JSON.stringify(temp_global));

        this.setState({
          redirect: true
        });
      })
      .catch(error => {
        console.log("error: " + error);
        document.getElementById("error").style.display = "";
      });
  }

  componentDidMount = () => {
    localStorage.setItem('global', null);
    global = null;
  }

  //Redirect to login after success
  renderRedirectLogin = () => {
    if (this.state.redirect) {
      document.getElementById("header").style.display = "none";
      global = JSON.parse(localStorage.getItem('global'));
      console.log(JSON.parse(localStorage.getItem('global')))

      return <Redirect to="/admin/dashboard" />;
    }
  };

  //Redirect to Signup
  renderRedirectRegister = () => {
    if (this.state.redirect_register) { 
      return <Redirect to="/signup" />;
    }
  };
  go_to_register = () => {
    this.setState({
      redirect_register: true
    });
  };

  render() {
    return (
      <div>
        <div className="loginBase" id="login_base">
          <div className="wrap-login100 p-t-30 p-b-50">
            <span className="login100-form-title p-b-41">Account Login</span>
            <form className="login100-form validate-form p-b-33 p-t-5">
              <div
                className="wrap-input100 validate-input"
                data-validate="Enter username"
              >
                <input
                  className="input100"
                  type="text"
                  id="username"
                  name="username"
                  placeholder="User name"
                ></input>
                <span
                  className="focus-input100"
                  data-placeholder="&#xf2c0;"
                ></span>
              </div>

              <div
                className="wrap-input100 validate-input"
                data-validate="Enter password"
              >
                <input
                  className="input100"
                  type="password"
                  id="password"
                  name="pass"
                  placeholder="Password"
                ></input>
                <span
                  className="focus-input100"
                  data-placeholder="&#xf023;"
                ></span>
              </div>
              <div
                className="container-login100-form-btn m-t-32"
                id="error"
                style={{ display: "none" }}
              >
                <span style={{ color: "red" }}>
                  Login failed! Username or Password are incorrect
                </span>
              </div>

              <div className="container-login100-form-btn m-t-32">
                <button
                  className="login100-form-btn"
                  onClick={this.login}
                  type="button"
                >
                  Login
                </button>
              </div>
              {this.renderRedirectLogin()}

              <div className="container-login100-form-btn m-t-32">
                <span style={{ color: "#999999" }}>
                  Haven't registered your company yet?
                </span>
                <span style={{ marginLeft: "3px", color: "#00b4c6" , cursor:"pointer"}} onClick={this.go_to_register}>
                  Click Here!
                </span>
                {this.renderRedirectRegister()}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
