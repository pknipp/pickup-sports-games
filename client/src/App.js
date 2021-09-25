import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Cookies from "js-cookie";
import LogIn from './components/session/LogIn';
import LogOut from './components/session/LogOut';
import User from './components/users/User';
import Favorites from './components/favorites/Favorites';
import NavBar from "./components/NavBar";
import EditEvent from "./components/events/EditEvent";
import ViewEvent from "./components/events/ViewEvent";
import EditReservation from "./components/reservations/EditReservation";
import Home from "./components/events/Home";
import Context from './context';

// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route {...rest} render={(props) => (
//     rest.needLogin === true ? <Redirect to='/login' /> : <Component {...props} />   )}
//   />
// )

const ProtectedRoute = ({ component: Component, path, exact, ...rest}) => {
  const { user } = useContext(Context)
  return (
      <Route
          {...rest}
          path={path}
          exact={exact}
          render={props => user.id
              ? <Component user={user} {...rest} />
              : <Redirect to="/login" />
          }
      />
  )
}

const AuthRoute = ({ component: Component, path, exact, ...rest }) => {
  const { user } = useContext(Context);
  return (
      <Route
          {...rest}
          path={path}
          exact={exact}
          render={() => user.id ? <Redirect to="/" />
              : <Component {...rest} />
          }
      />
  )
}

const App = () => {
  const [fetchWithCSRF] = useState(() => fetch);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  // const [rerender, setRerender] = useState(0);
  const genders = ["men's", "women's", "gender neutral", "mixed"];
  const contextValue = {fetchWithCSRF, user, setUser,
    // rerender, setRerender,
    genders};

  const loadUser = () => {
    const authToken = Cookies.get("token");
    if (authToken) {
      try {
        const payloadObj = JSON.parse(atob(authToken.split(".")[1]))
        setUser(payloadObj.data);
      } catch (e) {
        Cookies.remove("token");
      }
    }
    setLoading(false);
  }
  useEffect(loadUser, []);

  return (
    <Context.Provider value={contextValue}>
      {loading ?
        <h1>Loading</h1>
      :
        <BrowserRouter>
          <NavBar />
          <Switch>
            <AuthRoute exact path="/login" component={LogIn} />
            <AuthRoute exact path="/signup" component={User} />
            <ProtectedRoute exact path="/" component={Home}/>
            <ProtectedRoute exact path="/edituser" component={User}/>
            <ProtectedRoute exact path="/editfavorites" component={Favorites}/>
            <ProtectedRoute path="/logout" component={LogOut}/>
            <Route exact path="/editEvents/:eventId" component={EditEvent} />
            <Route exact path="/viewEvents/:eventId" component={ViewEvent} />
            <Route exact path="/reservations/:resEventId" component={EditReservation} />
          </Switch>
          <div className="wide">
            <br/>
            creators:
              <a href="https://pknipp.github.io/" target="_blank" rel="noopener noreferrer">&nbsp;
                Peter Knipp
              </a>
              &nbsp;and&nbsp;
              <a href="https://acyg2212.github.io/" target="_blank" rel="noopener noreferrer">
                Aaron Cygnarowicz
              </a>
          </div>
        </BrowserRouter>
      }
    </Context.Provider>
  );
}

export default App;
