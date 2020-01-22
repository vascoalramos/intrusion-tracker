import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
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
import Typography from "@material-ui/core/Typography";

import Button from "components/CustomButtons/Button.js";
import { bugs, website, server } from "variables/general.js";

import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import baseURL from "../../variables/baseURL.js";

const useStyles = makeStyles(styles);

export default class Dashboard extends React.Component {
  state = {
    allLogs: {},
    todayLogs: {},
    lastHourLogs: {},
    global: JSON.parse(localStorage.getItem("global")),
    tokeExpired: false,
    now : null
  };

  getData() {
    console.log(
      baseURL +
        "api/v1/logs-histogram/" +
        this.state.global.userInfo.person.company.id
    );
    console.log(this.state.global.token);
    fetch(
      baseURL +
        "api/v1/logs-histogram/" +
        this.state.global.userInfo.person.company.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.state.global.token
        }
      }
    )
      .then(response => {
        if (response.ok) return response.json();
        else if (response.status == "401") {
          this.setState({
            tokeExpired: true
          });
        } else {
          throw new Error(response.status);
        }
      })
      .then(data => {
        var now = new Date();
        this.setState({
          allLogs: {
            data: {
              labels: [
                '<span style="font-size: 15px;font-weight: bold;">Good</span>',
                '<span style="font-size: 15px;font-weight: bold;">Bad</span>',
                '<span style="font-size: 15px;font-weight: bold;">Entries</span>',
                '<span style="font-size: 15px;font-weight: bold;">Exits</span>'
              ],
              series: [
                [
                  (parseInt(data.all_accesses.good) / parseInt(data.all_accesses.total)) * 100,
                  (parseInt(data.all_accesses.bad) / parseInt(data.all_accesses.total)) * 100,
                  (parseInt(data.all_accesses.entries) / parseInt(data.all_accesses.total)) * 100,
                  (parseInt(data.all_accesses.exits) / parseInt(data.all_accesses.total)) * 100
                ]
              ]
            },
            total: data.all_accesses.total,
            good: data.all_accesses.good,
            bad: data.all_accesses.bad,
            entries: data.all_accesses.entries,
            exits: data.all_accesses.exits
          },
          todayLogs: {
            data: {
              labels: [
                '<span style="font-size: 15px;font-weight: bold;">Good</span>',
                '<span style="font-size: 15px;font-weight: bold;">Bad</span>',
                '<span style="font-size: 15px;font-weight: bold;">Entries</span>',
                '<span style="font-size: 15px;font-weight: bold;">Exits</span>'
              ],
              series: [
                [
                  (parseInt(data.today.good) / parseInt(data.today.total)) * 100,
                  (parseInt(data.today.bad) / parseInt(data.today.total)) * 100,
                  (parseInt(data.today.entries) / parseInt(data.today.total)) * 100,
                  (parseInt(data.today.exits) / parseInt(data.today.total)) * 100
                ]
              ]
            },
            total: data.today.total,
            good: data.today.good,
            bad: data.today.bad,
            entries: data.today.entries,
            exits: data.today.exits
          },
          lastHourLogs: {
            data: {
              labels: [
                '<span style="font-size: 15px;font-weight: bold;">Good</span>',
                '<span style="font-size: 15px;font-weight: bold;">Bad</span>',
                '<span style="font-size: 15px;font-weight: bold;">Entries</span>',
                '<span style="font-size: 15px;font-weight: bold;">Exits</span>'
              ],
              series: [
                [
                  (parseInt(data.last_hour.good) / parseInt(data.last_hour.total)) * 100,
                  (parseInt(data.last_hour.bad) / parseInt(data.last_hour.total)) * 100,
                  (parseInt(data.last_hour.entries) / parseInt(data.last_hour.total)) * 100,
                  (parseInt(data.last_hour.exits) / parseInt(data.last_hour.total)) * 100
                ]
              ]
            },
            total: data.last_hour.total,
            good: data.last_hour.good,
            bad: data.last_hour.bad,
            entries: data.last_hour.entries,
            exits: data.last_hour.exits
          },
          global: JSON.parse(localStorage.getItem("global")),
          tokeExpired: false,
          now: now.getHours() + ":" + now.getMinutes()
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <div>
        <h3>Analytics</h3>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Card chart>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={this.state.lastHourLogs.data}
                  type="Bar"
                  options={emailsSubscriptionChart.options}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h5>
                  <CheckCircleIcon style={{ color: "#67b76a" }} />
                  <strong style={{ color: "#67b76a" }}>Good:</strong>{" "}
                  {this.state.lastHourLogs.good}{" "}
                  <CancelIcon style={{ color: "#ee524f" }} />
                  <strong style={{ color: "#ee524f" }}>Bad:</strong>{" "}
                  {this.state.lastHourLogs.bad}{" "}
                  <ArrowUpwardIcon style={{ color: "#1abed2" }} />
                  <strong style={{ color: "#1abed2" }}>Entries:</strong>{" "}
                  {this.state.lastHourLogs.entries}{" "}
                  <ArrowDownwardIcon style={{ color: "#fb9811" }} />{" "}
                  <strong style={{ color: "#fb9811" }}>Exits:</strong>{" "}
                  {this.state.lastHourLogs.exits}
                </h5>
                <h4>
                  <strong>Last hour accesses:</strong>{" "}
                  {this.state.lastHourLogs.total}
                </h4>
                <p>Histogram with last hour accesses's.</p>
              </CardBody>
              <CardFooter chart>
                <div>
                  <AccessTime /> last update at {this.state.now}
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card chart>
              <CardHeader color="danger">
                <ChartistGraph
                  className="ct-chart"
                  data={this.state.todayLogs.data}
                  type="Bar"
                  options={emailsSubscriptionChart.options}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h5>
                  <CheckCircleIcon style={{ color: "#67b76a" }} />
                  <strong style={{ color: "#67b76a" }}>Good:</strong>{" "}
                  {this.state.todayLogs.good}{" "}
                  <CancelIcon style={{ color: "#ee524f" }} />
                  <strong style={{ color: "#ee524f" }}>Bad:</strong>{" "}
                  {this.state.todayLogs.bad}{" "}
                  <ArrowUpwardIcon style={{ color: "#1abed2" }} />
                  <strong style={{ color: "#1abed2" }}>Entries:</strong>{" "}
                  {this.state.todayLogs.entries}{" "}
                  <ArrowDownwardIcon style={{ color: "#fb9811" }} />{" "}
                  <strong style={{ color: "#fb9811" }}>Exits:</strong>{" "}
                  {this.state.todayLogs.exits}
                </h5>
                <h4>
                  <strong>Today accesses:</strong> {this.state.todayLogs.total}
                </h4>
                <p>Histogram with today accesses's.</p>
              </CardBody>
              <CardFooter chart>
                <div>
                  <AccessTime /> last update at {this.state.now}
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Card chart>
              <CardHeader color="info">
                <ChartistGraph
                  className="ct-chart"
                  data={this.state.allLogs.data}
                  type="Bar"
                  options={emailsSubscriptionChart.options}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h5>
                  <CheckCircleIcon style={{ color: "#67b76a" }} />
                  <strong style={{ color: "#67b76a" }}>Good:</strong>{" "}
                  {this.state.allLogs.good}{" "}
                  <CancelIcon style={{ color: "#ee524f" }} />
                  <strong style={{ color: "#ee524f" }}>Bad:</strong>{" "}
                  {this.state.allLogs.bad}{" "}
                  <ArrowUpwardIcon style={{ color: "#1abed2" }} />
                  <strong style={{ color: "#1abed2" }}>Entries:</strong>{" "}
                  {this.state.allLogs.entries}{" "}
                  <ArrowDownwardIcon style={{ color: "#fb9811" }} />{" "}
                  <strong style={{ color: "#fb9811" }}>Exits:</strong>{" "}
                  {this.state.allLogs.exits}
                </h5>
                <h4>
                  <strong>All accesses:</strong> {this.state.allLogs.total}
                </h4>
                <p>Histogram with all system accesses's.</p>
              </CardBody>
              <CardFooter chart>
                <div>
                  <AccessTime /> last update at {this.state.now}
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        {/*
        <h3>Menu</h3>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p>User Profile</p>
                <h3>49/50</h3>
              </CardHeader>
              <CardFooter stats>
                <div>
                  <Button color="warning">
                    <strong>More info</strong>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Store />
                </CardIcon>
                <p>Revenue</p>
                <h3>$34,245</h3>
              </CardHeader>
              <CardFooter stats>
                <div>
                  <DateRange />
                  Last 24 Hours
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <Icon>info_outline</Icon>
                </CardIcon>
                <p>Fixed Issues</p>
                <h3>75</h3>
              </CardHeader>
              <CardFooter stats>
                <div>
                  <LocalOffer />
                  Tracked from Github
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Accessibility />
                </CardIcon>
                <p>Followers</p>
                <h3>+245</h3>
              </CardHeader>
              <CardFooter stats>
                <div>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        */}
      </div>
    );
  }
}
