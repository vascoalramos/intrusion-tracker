import React from "react";
// @material-ui/core components
import "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import global from "../../variables/global";
import baseURL from "../../variables/baseURL";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

import BookingList from "./BookingList.js";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

export default function Booking() {
  const classes = useStyles();

  const [age, setAge] = React.useState("");

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  var hours =
    parseInt(today.getHours()) < 10 ? "0" + today.getHours() : today.getHours();
  var minutes =
    parseInt(today.getMinutes()) < 10
      ? "0" + today.getMinutes()
      : today.getMinutes();
  var seconds =
    parseInt(today.getSeconds()) < 10
      ? "0" + today.getSeconds()
      : today.getSeconds();
  today =
    yyyy + "-" + mm + "-" + dd + "T" + hours + ":" + minutes + ":" + seconds;

  const [selectedStartDate, setSelectedStartDate] = React.useState(
    new Date(today)
  );

  const [selectedUntilDate, setSelectedUntilDate] = React.useState(
    new Date(today)
  );

  const [dialongOpen, setDialogOpen] = React.useState(false);

  const handleDialogClose = () => {
    setRooms(false);
    setDialogOpen(false);
  };

  const handleStartDateChange = date => {
    setSelectedStartDate(date);
  };

  const handleUntilDateChange = date => {
    setSelectedUntilDate(date);
  };

  const [goBack, setGoBack] = React.useState(false);
  const bookingList = () => {
    setGoBack(true);
  };

  const [state, setState] = React.useState({ rooms: [] });
  const [rooms, setRooms] = React.useState(false);

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  const handleChange = event => {
    setAge(event.target.value);
  };

  const [bookingDetails, setBookingDetails] = React.useState({
    roomNumber: "",
    startDate: "",
    endDate: ""
  });

  const [tokenExpired, setTokenExpired] = React.useState(false);

  const table = (
    <GridItem xs={12} sm={12} md={12}>
      <Card plain>
        <CardHeader plain color="info">
          <h4 className={classes.cardTitleWhite}>Table on Plain Background</h4>
          <p>Here is a subtitle for this table</p>
        </CardHeader>
        <CardBody>
          <Table
            tableHeaderColor="success"
            tableHead={[
              "Room number",
              "Department",
              "Max Occupation",
              "Access Level",
              "Salary"
            ]}
            tableData={rooms !== false ? [["a", "b"]] : ""}
          />
        </CardBody>
      </Card>
    </GridItem>
  );

  const form = (
    <FormControl
      variant="outlined"
      className={classes.formControl}
      style={{ width: "100%" }}
    >
      <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
        Available rooms
      </InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={age}
        onChange={handleChange}
        labelWidth={labelWidth}
      >
        {state.rooms.map(room => (
          <MenuItem value={room.roomNumber}>Sala {room.roomNumber}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  var values = form;

  const handleTable = () => {
    if (rooms !== null) {
      values = form;
      return;
    }
    alert("There are no rooms available!");
  };

  const renderRedirectLogin = () => {
    if (this.tokenExpired) {
      localStorage.setItem('global', null);
      return <Redirect to="/login" />;
    }
  };

  const getData = () => {
    global = JSON.parse(localStorage.getItem('global'))

    const startDate = document.getElementById("startDate").value;
    const startTime = document.getElementById("startTime").value;
    const endDate = document.getElementById("endDate").value;
    const endTime = document.getElementById("endTime").value;

    fetch(
      baseURL +
        "api/v1/rooms?id=" +
        global.userInfo.id +
        "&start=" +
        startDate +
        " " +
        startTime +
        ":00&end=" +
        endDate +
        " " +
        endTime +
        ":00",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: global.token
        }
      }
    )
      .then(response => {
        if (response.ok) return response.json();
        else if (response.status == "401") {
          this.setTokenExpired(true);
        } else {
          throw new Error(response.status);
        }
      })
      .then(data => {
        // TODO: Add error handling
        if (data.length > 0) {
          setRooms(data);
          setState({ rooms: data });
        } else {
          setRooms(null);
        }
      })
      .catch(console.log);
    handleTable();
  };

  const booking = () => {
    global = JSON.parse(localStorage.getItem('global'))

    const startDate = document.getElementById("startDate").value;
    const startTime = document.getElementById("startTime").value;
    const endDate = document.getElementById("endDate").value;
    const endTime = document.getElementById("endTime").value;

    const roomNumber = document.getElementById("demo-simple-select-outlined")
      .value;

    var data = {
      startTime: startDate + "T" + startTime + ":00",
      endTime: endDate + "T" + endTime + ":00",
      user: {
        id: global.userInfo.id
      },
      room: {
        roomNumber: roomNumber
      }
    };

    fetch(baseURL + "api/v1/bookings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: global.token
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) return response.json();
        else if (response.status == "401") this.setTokenExpired(true);
        else {
          throw new Error(response.status);
        }
      })
      .then(data => {
        setBookingDetails({
          roomNumber: data.room.roomNumber,
          startDate: data.startTime,
          endDate: data.endTime
        });
        setDialogOpen(true);
      })
      .catch(err => err);
  };

  if (!goBack) {
    return (
      <div>
        {renderRedirectLogin}
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="success">
                <h4 className={classes.cardTitleWhite}>Booking rooms</h4>
                <p className={classes.cardCategoryWhite}>
                  <strong>
                    Please, choose a start and given date to check rooms
                    availability.
                  </strong>
                </p>
              </CardHeader>
              <CardBody>
                <Button color="success" id="add-button" onClick={bookingList}>
                  Booking list
                </Button>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={3} sm={3} md={3}></GridItem>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <GridItem xs={3} sm={3} md={3}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="yyyy-MM-dd"
                margin="normal"
                id="startDate"
                label="Booking from..."
                value={selectedStartDate}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
              />
              <KeyboardTimePicker
                margin="normal"
                id="startTime"
                ampm={false}
                label="at"
                value={selectedStartDate}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change time"
                }}
              />
            </GridItem>
            <GridItem xs={3} sm={3} md={3}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="yyyy-MM-dd"
                margin="normal"
                id="endDate"
                label="Until..."
                value={selectedUntilDate}
                onChange={handleUntilDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
              />
              <KeyboardTimePicker
                margin="normal"
                id="endTime"
                ampm={false}
                label="at"
                value={selectedUntilDate}
                onChange={handleUntilDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change time"
                }}
              />
            </GridItem>
          </MuiPickersUtilsProvider>
          <GridItem xs={3} sm={3} md={3}></GridItem>
          <GridItem xs={7} sm={7} md={7}></GridItem>
          <GridItem xs={2} sm={2} md={2}>
            <Button color="success" onClick={getData}>
              Check Availability
            </Button>
          </GridItem>
          <GridItem xs={3} sm={3} md={3}></GridItem>
          <GridItem xs={1} sm={1} md={1}></GridItem>
          <GridItem xs={11} sm={11} md={11}>
            {rooms && (
              <div className={classes.typo}>
                <h4>Please, choose an available room:</h4>
              </div>
            )}
          </GridItem>
          <GridItem xs={1} sm={1} md={1}></GridItem>
          <GridItem xs={8} sm={8} md={8}>
            {rooms && values}
          </GridItem>
          <GridItem xs={3} sm={3} md={3}>
            {rooms && (
              <Button color="danger" onClick={booking}>
                Booking
              </Button>
            )}
          </GridItem>
        </GridContainer>
        <Dialog
          open={dialongOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Booking confirmed!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Your booking has been <strong>confirmed.</strong> Details: <br />
              <ul>
                <li>Room number: {bookingDetails.roomNumber}</li>
                <li>Start time: {bookingDetails.startDate}</li>
                <li>End time: {bookingDetails.endDate}</li>
              </ul>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogClose()} color="success">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  } else {
    return <BookingList />;
  }
}
