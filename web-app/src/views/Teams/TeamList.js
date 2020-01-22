import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";

// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { withStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

import Button from "components/CustomButtons/Button.js";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { bugs, website, server } from "variables/general.js";

import TeamInfo from "./TeamInfo";

import global from "../../variables/global";
import baseURL from "../../variables/baseURL";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

export class TeamList extends Component {
  state = {
    isLoaded: false,
    token_expired: false,
    teams: [],
    redirect: false,
    id: null,
    team: null
  };

  // Calls to our API
  componentDidMount = () => {
    global = JSON.parse(localStorage.getItem('global'))

    //Get a list of teams
    fetch(baseURL + "api/v1/teams", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: global["token"]
      }
    })
      .then(response => {
        if (response.ok)
            return response.json()
        else if (response.status == "401")
        this.setState({
          token_expired: true
        });
        else {
            throw new Error(response.status);
        }
      })
      .then(data => {
        this.setState({
          teams: data,
          isLoaded: true
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });
  };

  go_to_more = (id,name) => {
    this.setState({
      id: id,
      team: name
    });
  };

  //Go back to login
  renderRedirectLogin = () => {
    if (this.state.token_expired) {
      localStorage.setItem('global', null);
      return <Redirect to="/login" />;
    }
  };

  render() {
    const { classes } = this.props;
    const { isLoaded, teams, id, team } = this.state;

    if (!isLoaded) {
      return (
        <div>
          {this.renderRedirectLogin()}
          <h2>Loading...</h2>
        </div>
      );
    } else if (id == null) {
      return (
        <div>
          <GridContainer>
            {teams.map(team => (
              <GridItem xs={12} sm={6} md={3} key={team.id}>
                <Card>
                  <CardHeader color="success" stats icon>
                    <CardIcon color="success">
                      <h4>
                        <strong>{team.id}</strong>
                      </h4>
                    </CardIcon>
                    <p className={classes.cardCategory}>Team name</p>
                    <h3 className={classes.cardTitle}>
                      <strong>{team.teamName}</strong>
                    </h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}>
                      <Button
                        color="success"
                        onClick={() => this.go_to_more(team.id,team.teamName)}
                      >
                        <strong>More info</strong>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </GridItem>
            ))}
          </GridContainer>
        </div>
      );
    } else {
      return <TeamInfo id={id} name={team} classes={classes} />;
    }
  }
}

export default withStyles(styles)(TeamList);
