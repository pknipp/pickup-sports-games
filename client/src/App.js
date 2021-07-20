import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Cookies from "js-cookie";
import LogIn from './components/session/LogIn';
import LogOut from './components/session/LogOut';
import User from './components/users/User';
// import Container from "./components/Container";
import NavBar from "./components/NavBar";
import EditGame from "./components/games/EditGame";
import ViewGame from "./components/games/ViewGame";
import EditReservation from "./components/reservations/EditReservation";
import Home from "./components/games/Home";
import AuthContext from './auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    rest.needLogin === true ? <Redirect to='/login' /> : <Component {...props} />   )}
  />
)

const ProtectedRoute = ({ component: Component, path, exact, ...rest}) => {
  const { currentUser } = useContext(AuthContext)
  return (
      <Route
          {...rest}
          path={path}
          exact={exact}
          render={props => currentUser
              ? <Component currentUser={currentUser} {...rest} />
              : <Redirect to="/login" />
          }
      />
  )
}

const AuthRoute = ({ component: Component, path, exact, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  return (
      <Route
          {...rest}
          path={path}
          exact={exact}
          render={() => currentUser ? <Redirect to="/" />
              : <Component {...rest} />
          }
      />
  )
}

const App = () => {
  const [fetchWithCSRF] = useState(() => fetch);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rerender, setRerender] = useState(0);
  const authContextValue = {fetchWithCSRF, currentUser, setCurrentUser, rerender, setRerender};

  const loadUser = () => {
    const authToken = Cookies.get("token");
    if (authToken) {
      try {
        const payloadObj = JSON.parse(atob(authToken.split(".")[1]))
        setCurrentUser(payloadObj.data);
      } catch (e) {
        Cookies.remove("token");
      }
    }
    setLoading(false);
  }
  useEffect(loadUser, []);

  return (
    <AuthContext.Provider value={authContextValue}>
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
            <ProtectedRoute path="/logout" component={LogOut}/>
            <Route exact path="/editGames/:gameId" component={EditGame} />
            <Route exact path="/viewGames/:gameId" component={ViewGame} />
            <Route exact path="/reservations/:resGameId" component={EditReservation} />
          </Switch>
        </BrowserRouter>
      }
    </AuthContext.Provider>
  );
}

export default App;
