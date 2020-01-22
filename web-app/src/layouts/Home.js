import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import HomeHeader from '../components/HomeHeader/HomeHeader.js';
import Login from '../views/Login/Login.js';
import Welcome from '../views/Home/Welcome.js';
import Feature1 from '../views/Home/Feature1.js';
import Services from '../views/Home/Services.js';
import Feature2 from '../views/Home/Feature2.js';
import Contacts from '../views/Home/Contacts.js';
import Footer from '../views/Home/Footer.js';
import Admin from "layouts/Admin.js";
import Signup from '../views/Signup/SignupForm.js';

function Home() {
  return (
    <Router>
        <div id="app">
            <HomeHeader />
            <Switch>
                <Route path="/admin" component={Admin}/>
                <Redirect from="admin/dashboard" to="/admin/dashboard" />
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/signup">
                    <Signup />
                </Route>
                <Route path="/">
                    <div id="home-main">
                        <Welcome />
                        <Feature1 />
                        <Services />
                        <Feature2 />
                        <Contacts />
                        <Footer />
                    </div>
                </Route>
            </Switch>
        </div>
    </Router>
  );
}

export default Home;
