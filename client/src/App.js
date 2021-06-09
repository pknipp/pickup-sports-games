import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Cookies from "js-cookie";
import Login from './components/admin/Login';
import SignUp from './components/admin/SignUp';
import Container from "./components/Container";
import AuthContext from './auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    rest.needLogin === true ? <Redirect to='/login' /> : <Component {...props} />   )}
  />
)

const App = () => {
  const [fetchWithCSRF] = useState(() => fetch);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true)
  const authContextValue = {fetchWithCSRF, currentUser, setCurrentUser};

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
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <PrivateRoute path="/"
            // exact={true}
            needLogin={!currentUser} component={Container} />
          </Switch>
        </BrowserRouter>
      }
    </AuthContext.Provider>
  );
}
// const msp = state => ({ currentUserId: state.authentication.id, needLogin: !state.authentication.id});
export default App;
