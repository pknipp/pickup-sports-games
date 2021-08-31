import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import Context from '../context';

const NavBar = () => {
  const { fetchWithCSRF, currentUser } = useContext(Context);

  const head = (
    <h1>
        <p align="center">
            Welcome {currentUser ? currentUser.Nickname : ""} to pickup sports games!
        </p>
    </h1>
);

  return (
    <>
        <h1>
            <p align="center">
                Welcome {currentUser ? currentUser.Nickname : ""} to pickup sports games!
            </p>
        </h1>
        <p align="center">{!currentUser ? null :
            <>
                <NavLink
                    exact to="/"
                    className="nav"
                    activeClassName="active"
                >
                    Home
                </NavLink>
                <NavLink
                    to="/edituser"
                    className="nav" activeClassName="active"
                >
                    Account Details
                </NavLink>
                <NavLink to="/logout" className="nav" activeClassName="active"
                >
                    LogOut
                </NavLink>
            </>}
        </p>
    </>
  )
}

export default NavBar;
