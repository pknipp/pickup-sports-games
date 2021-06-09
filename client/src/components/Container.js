import React, { useContext } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';

import Logout from "./admin/Logout";
import Feature1 from "./feature1/index";
import SignUp from "./admin/SignUp";
import Home from "./admin/Home";
import AuthContext from '../auth';

const Container = () => {
  const { fetchWithCSRF, currentUser, setCurrentUser } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <nav>
        <h1>{currentUser.email}: Welcome to volleyball-meetup!</h1>
        <div className="nav-bar">
          <span>
            <NavLink className="nav" exact to="/" activeClassName="active">
              Home
            </NavLink>
          </span>
          <span>
            <NavLink className="nav" to="/feature1" activeClassName="active">
              Sample feature
            </NavLink>
          </span>
          <span>
            <NavLink className="nav" to="/manageuser" activeClassName="active">
              Manage account
            </NavLink>
          </span>
          <span>
            <NavLink className="nav" to="/logout" activeClassName="active">
              Logout
            </NavLink>
          </span>
        </div>
      </nav>
      <Switch>
        <Route path="/logout" component={Logout}/>
        <Route path="/feature1" component={Feature1}/>
        <Route path="/manageuser" component={SignUp}/>
        <Route path="/" component={Home}/>
      </Switch>
    </BrowserRouter>
  )
}

// const msp = state => ({ email: state.authentication.email, currentUserId: state.authentication.id, needLogin: !state.authentication.id});
export default Container;
