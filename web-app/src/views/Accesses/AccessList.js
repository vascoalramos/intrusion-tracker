import React from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container/Container";
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableRow from "@material-ui/core/TableRow/TableRow";
import Paper from "@material-ui/core/Paper/Paper";
import IconButton from "@material-ui/core/IconButton/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import TableHead from "@material-ui/core/TableHead";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";

import global from "../../variables/global.js";
import baseURL from "../../variables/baseURL";

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5)
  }
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500
  }
});

export default function CustomPaginationActionsTable() {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [rows, setRows] = React.useState([]);
  const createLog = (
    id,
    timestamp,
    type,
    security,
    email,
    department,
    roomNumber
  ) => {
    return { id, timestamp, type, security, email, department, roomNumber };
  };

  const [tokenExpired, setTokenExpired] = React.useState(false);

  // Simulate componentDidMount()
  global = JSON.parse(localStorage.getItem("global"));
  if (global.userInfo == null) {
    setTokenExpired(true);
  }

  const getData = () => {
    global = JSON.parse(localStorage.getItem("global"));
    if (!tokenExpired) {
      fetch(baseURL + "api/v1/logs/" + global.userInfo.person.company.id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: global.token
        }
      })
        .then(response => {
          if (response.ok) return response.json();
          else if (response.status == "401") {
            setTokenExpired(true);
          } else {
            throw new Error(response.status);
          }
        })
        .then(data => {
          // sort ascending by room number
          data.sort((log1, log2) => (log1.id < log2.id ? 1 : -1));
          var logsTable = [];
          data.forEach(log =>
            logsTable.push(
              createLog(
                "" + log.id,
                "" +
                  log.timestamp.split(":")[0].replace("T", " ") +
                  ":" +
                  log.timestamp.split(":")[1],
                log.accessType == "ENTRY" ? (
                  <div style={{ color: "green" }}>
                    ENTRY <ArrowUpwardIcon />
                  </div>
                ) : (
                  <div style={{ color: "red" }}>
                    EXIT <ArrowDownwardIcon />
                  </div>
                ),
                "" + log.securityFlag == "good" ? (
                  <div style={{ color: "green" }}>
                    <CheckCircleIcon />
                  </div>
                ) : (
                  <div style={{ color: "red" }}>
                    <CancelIcon />
                  </div>
                ),
                "" + log.person.email,
                "" + log.room.dept.departmentName,
                "" + log.room.roomNumber
              )
            )
          );
          setRows(logsTable);
          setLoading(false);
        })
        .catch(error => {
          console.log("error: " + error);
        });
      setFetchOnce(true);
    }
  };

  const [fetchOnce, setFetchOnce] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  if (!fetchOnce) getData();

  
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    global = JSON.parse(localStorage.getItem("global"));
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    global = JSON.parse(localStorage.getItem("global"));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  global = JSON.parse(localStorage.getItem("global"));
  if (tokenExpired) return <Redirect to="/login" />;
  else if(isLoading) return <h2>Loading...</h2>
  else
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="danger">
                <h4 style={{ color: "white" }}>
                  <strong>Accesses list</strong>
                </h4>
                <p style={{ color: "white" }}>
                  List with all employees suspicious of nefarious actions
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  className={classes.table}
                  aria-label="custom pagination table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>ID</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Timestamp</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Type</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Security</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Department</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Room Nº</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? rows.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : rows
                    ).map(row => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.id}
                        </TableCell>
                        <TableCell align="center">{row.timestamp}</TableCell>
                        <TableCell align="center">{row.type}</TableCell>
                        <TableCell align="center">{row.security}</TableCell>
                        <TableCell align="center">{row.email}</TableCell>
                        <TableCell align="center">{row.department}</TableCell>
                        <TableCell align="center">{row.roomNumber}</TableCell>
                      </TableRow>
                    ))}

                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        colSpan={3}
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
}
