import React, { Component } from "react";

export class SignupAdminDetails extends Component {
  // Continue to next step
  continue = e => {
    e.preventDefault();

    //var confirm_pass = this.confirmPassword();
    var confirm_email = this.confirmEmail();
    if (
      this.props.values.a_email == "" ||
      this.props.values.a_fname == "" ||
      this.props.values.a_lname == "" 
    ) {
      document.getElementById("error").style.display = "";
    } else {
      document.getElementById("error").style.display = "None";

      if (confirm_email){
        this.props.nextStep();
      }
    }
  };

  // Go back to last step
  go_back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  // Confirm if the password is valid
  /*confirmPassword = () => {
    //console.log(this.props.values.a_password)
    //console.log(this.props.values.a_confirm_password)

    if (this.props.values.a_password == this.props.values.a_confirm_password) {
      document.getElementById("pass_error").style.display = "None";
      return true;
    } else {
      document.getElementById("pass_error").style.display = "";
      return false;
    }
  }; 
  */

  // Confirm if the email
  confirmEmail = () => {
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
     
    if (re.test(String(this.props.values.a_email).toLowerCase())) {
      document.getElementById("email_error").style.display = "None";
      return true;
    } else {
      document.getElementById("email_error").style.display = "";
      return false;
    }
  };

  render() {
    const { values, handleChange } = this.props;

    return (
      <div className="loginBase" id="login_base">
        <div class="wrap-login100 p-t-30 p-b-50">
          <span class="login100-form-title p-b-41" style={{ marginTop: "5vh" }}>
            Registration
          </span>
          <span class="login100-form-title p-b-41">Admin Information</span>
          <form class="login100-form validate-form p-b-33 p-t-5">
            <div
              class="wrap-input100 validate-input"
              data-validate="Enter the Admin's name"
            >
              <input
                class="input100"
                type="text"
                name="name"
                placeholder="Admin's Email *"
                onChange={handleChange("a_email")}
                defaultValue={values.a_email}
              ></input>
              <span class="focus-input100" data-placeholder="&#xf0e0;"></span>
            </div>
            <div
              class="wrap-input100 validate-input"
              data-validate="Admin's first name"
            >
              <input
                class="input100"
                type="text"
                name="username"
                placeholder="First name *"
                onChange={handleChange("a_fname")}
                defaultValue={values.a_fname}
              ></input>
              <span class="focus-input100" data-placeholder="&#xf2c0;"></span>
            </div>
            <div
              class="wrap-input100 validate-input"
              data-validate="Admin's second name"
            >
              <input
                class="input100"
                type="text"
                name="username"
                placeholder="Second name *"
                onChange={handleChange("a_lname")}
                defaultValue={values.a_lname}
              ></input>
              <span class="focus-input100" data-placeholder="&#xf2c0;"></span>
            </div>
            <div
              class="wrap-input100 validate-input"
              data-validate="Enter the company's Phone Number"
            >
              <input
                class="input100"
                type="text"
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange("a_phone_number")}
                defaultValue={values.a_phone_number}
              ></input>
              <span class="focus-input100" data-placeholder="&#xf095;"></span>
            </div>

            <div
              className="container-login100-form-btn m-t-32"
              id="pass_error"
              style={{ display: "None" }}
            >
              <span style={{ color: "red" }}>
                Error! The passwords don't match!
              </span>
            </div>
            <div
              className="container-login100-form-btn m-t-32"
              id="error"
              style={{ display: "None" }}
            >
              <span style={{ color: "red" }}>Please fill in obligatory (*) fields!</span>
            </div>
            
            <div
              className="container-login100-form-btn m-t-32"
              id="email_error"
              style={{ display: "None" }}
            >
              <span style={{ color: "red" }}>
                Error! Invalid email!
              </span>
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
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default SignupAdminDetails;
