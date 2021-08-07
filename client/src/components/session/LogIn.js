import React, { useState, useContext } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import Context from '../../context';

const LogIn = () => {
  const [email, setEmail] = useState("volleyb@aol.com");
  const [password, setPassword] = useState("password");
  const [message, setMessage] = useState('');
  const { fetchWithCSRF, currentUser, setCurrentUser } = useContext(Context);

  const login = async (email, password) => {
    const response = await fetch(`/api/session`, { method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    let data = await response.json();
    if (response.ok) {
      setCurrentUser(data.user);
    } else {
      setMessage(data.message || data.error.errors[0]);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    let message = !email ? "Email address is needed." : !password ? "Password is needed." : "";
    setMessage(message);
    if (!message) login(email, password);
  }

  return (currentUser) ? <Redirect to="/" /> : (
    <div className="simple">
      <form className="auth" onSubmit={handleSubmit}>
      {/* <h1>Welcome to volleyball meetup!</h1> */}
      <h4>We hope that you will either login or signup.</h4>
        <span>Email address:</span>
        <input
          type="text" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <span>Password:</span>
        <input
          type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button color="primary" variant="outlined" type="submit">Login</button>
        <span style={{color:"red", paddingLeft:"10px"}}>{message}</span>
        <span>
          <NavLink className="nav" to="/signup" activeClassName="active">
            Signup
          </NavLink>
        </span>
      </form>
    </div>
  );
}

export default LogIn;
