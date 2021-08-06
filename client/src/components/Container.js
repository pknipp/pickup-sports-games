import React, { useContext } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';

import LogOut from "./session/LogOut";
// import Feature1 from "./feature1/index";
import User from "./users/User";
import Home from "./games/Home";
import EditGame from "./games/EditGame";

import AuthContext from '../auth';

const Container = () => {
  const { fetchWithCSRF, currentUser } = useContext(AuthContext);

  return (
    // <BrowserRouter>
      <nav>
        <h1>{currentUser.nickName}: Welcome to sports meetup!</h1>
        <div className="nav-bar">
          <span>
            <NavLink className="nav" exact to="/" activeClassName="active">
              Home
            </NavLink>
          </span>
          <span>
            {/* <NavLink className="nav" to="/feature1" activeClassName="active">
              Sample feature
            </NavLink> */}
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
      // {/* <Switch>
      //   <Route path="/logout" component={LogOut}/>
      //   {/* <Route path="/feature1" component={Feature1}/> */}
      //   <Route path="/manageuser" component={User}/>
      //   <Route path="/" component={Home}/>
      //   {/* <Route exact path="/games/:gameId" component={EditGame} /> */}
      // </Switch> */}
    // </BrowserRouter>
  )
}

export default Container;
