import React, { Component } from "react";
import SignupCompanyDetails from "./SignupCompanyDetails"
import SignupAdminDetails from "./SignupAdminDetails"
import SignupConfirm from "./SignupConfirm";

export class Signup extends Component {
  state = {
    step: 1,
    //Company Details
    c_name: "",
    c_address: "",
    c_email: "",
    c_phone_number: "",

    //Admin Details
    a_email: "",
    a_password: "",
    a_confirm_password: "",
    a_phone_number: "",
    a_fname: "",
    a_lname: "",
    a_access_level: ""
  };

  // Proceed to next form's step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  // Proceed to previous form's step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  // Handle fields change
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  render() {
    const { step } = this.state;

    const {
      c_name,
      c_address,
      c_email,
      c_phone_number,
      a_email,
      a_password,
      a_confirm_password,
      a_phone_number,
      a_fname,
      a_lname,
      a_access_level
    } = this.state;

    const values = {
      c_name,
      c_address,
      c_email,
      c_phone_number,
      a_email,
      a_password,
      a_confirm_password,
      a_phone_number,
      a_fname,
      a_lname,
      a_access_level
    };

    switch (step) {
      case 1:
        return (
          <SignupCompanyDetails
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 2:
        return (
          <SignupAdminDetails
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 3:
        return (
          <SignupConfirm
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
    }
  }
}
export default Signup;
