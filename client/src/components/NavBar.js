import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import Context from '../context';

const NavBar = () => {
  const { fetchWithCSRF, user } = useContext(Context);

//   const head = (
//     <h1>
//         <p align="center">
//             Welcome {(user.id && user.Nickname) || ""} to pickup sports!
//         </p>
//     </h1>
// );

  return (
    <>
        <h1>
            <p align="center">
                Welcome {(user.id && user.Nickname) || ""} to pickup sports!
            </p>
        </h1>
        <p align="center">{!user.id ? null :
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
                    Manage Account
                </NavLink>
                <NavLink
                    to="/editfavorites"
                    className="nav" activeClassName="active"
                >
                    Manage Favorites
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
