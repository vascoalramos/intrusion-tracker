import React, { Component } from "react";

export class SignupCompanyDetails extends Component {
  // Continue to next step
  continue = e => {
    e.preventDefault();
    var confirm_email = this.confirmEmail();
    if (this.props.values.c_name == "" || this.props.values.c_address == "" || this.props.values.c_email == ""
    || this.props.values.c_phone_number == ""){
        document.getElementById('error').style.display = ""
        
      } else {
        document.getElementById("error").style.display = "None";
  
        if (confirm_email){
          this.props.nextStep();
        }
      }
  };


  // Confirm if the email
  confirmEmail = () => {
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    console.log(this.props.values.c_email)
    if (re.test(String(this.props.values.c_email).toLowerCase())) {
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
          <span class="login100-form-title p-b-41" style={{marginTop:"5vh"}}>Registration</span>
          <span class="login100-form-title p-b-41">Company Information</span>
          <form class="login100-form validate-form p-b-33 p-t-5">
            <div
              class="wrap-input100 validate-input"
              data-validate="Enter the company's name"
            >
              <input
                class="input100"
                type="text"
                name="name"
                placeholder="Company's Name"
                onChange={handleChange("c_name")}
                defaultValue={values.c_name}
              ></input>
              <span class="focus-input100" data-placeholder="&#xf1ad;"></span>
            </div>
            <div
              class="wrap-input100 validate-input"
              data-validate="Enter the company's email"
            >
              <input
                class="input100"
                type="text"
                name="email"
                placeholder="Company's Email"
                onChange={handleChange("c_email")}
                defaultValue={values.c_email}
              ></input>
              <span class="focus-input100" data-placeholder="&#xf0e0;"></span>
            </div>
            <div
              class="wrap-input100 validate-input"
              data-validate="Enter the company's Address"
            >
              <input
                class="input100"
                type="text"
                name="address"
                placeholder="Company's Address"
                onChange={handleChange("c_address")}
                defaultValue={values.c_address}
              ></input>
              <span class="focus-input100" data-placeholder="&#xf278;"></span>
            </div>
            <div
              class="wrap-input100 validate-input"
              data-validate="Enter the company's Phone Number"
            >
              <input
                class="input100"
                type="text"
                name="phone"
                placeholder="Company's Phone Number"
                onChange={handleChange("c_phone_number")}
                defaultValue={values.c_phone_number}
              ></input>
              <span class="focus-input100" data-placeholder="&#xf095;"></span>
            </div>
            <div
              className="container-login100-form-btn m-t-32"
              id="error"
              style={{ display: "None" }}
            >
              <span style={{ color: "red" }}>
                Please fill in all fields!
              </span>
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
export default SignupCompanyDetails;
