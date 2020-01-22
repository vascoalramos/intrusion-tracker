/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import RoomIcon from "@material-ui/icons/MeetingRoom";
import GroupIcon from '@material-ui/icons/Group';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import BookingList from "views/Booking/BookingList.js";
import Rooms from "views/Rooms/Rooms.js";
import Company from "views/Company/Company.js";
import DepartmentList from "views/Departments/DepartmentList";
import TeamList from "views/Teams/TeamList";
import EmployeeList from "views/Employees/EmployeeList";
import SuspectList from "views/Suspects/SuspectsList";
import AccessList from "views/Accesses/AccessList.js";
import CompanyIcon from '@material-ui/icons/Business';

import Logout from "views/Login/Logout";
import LockOpenIcon from '@material-ui/icons/LockOpen';



const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: Person,
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/company",
    name: "Company",
    icon: CompanyIcon,
    component: Company,
    layout: "/admin"
  },
  {
    path: "/accesses",
    name: "Accesses List",
    icon: LockOpenIcon,
    component: AccessList,
    layout: "/admin"
  },
  {
    path: "/employees",
    name: "Employees",
    icon: GroupIcon,
    component: EmployeeList,
    layout: "/admin"
  },
  {
    
    path: "/suspects",
    name: "Suspects",
    icon: "warning",
    component: SuspectList,
    layout: "/admin"
  },
  {
    path: "/teams",
    name: "Teams",
    icon: GroupWorkIcon,
    component: TeamList,
    layout: "/admin"
  },
  {
    path: "/departments",
    name: "Departments",
    icon: "apartment",
    component: DepartmentList,
    layout: "/admin"
  },
  {
    path: "/rooms",
    name: "Rooms List",
    icon: RoomIcon,
    component: Rooms,
    layout: "/admin"
  },
  {
    path: "/booking",
    name: "Booking",
    icon: "content_paste",
    component: BookingList,
    layout: "/admin"
  },
  {
    path: "/logout",
    name: "Logout",
    icon: ExitToAppIcon,
    component: Logout,
    layout: "/admin"
  },

];

export default dashboardRoutes;
