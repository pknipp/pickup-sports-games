import React, { useState, useEffect, useContext } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import Context from '../../context';

const LogIn = () => {
  const [Email, setEmail] = useState("adoe@aol.com"); //"volleyb@aol.com");
  const [Password, setPassword] = useState("password");
  const [message, setMessage] = useState('');
  const [sports, setSports] = useState([]);
  const { fetchWithCSRF, user, setUser } = useContext(Context);

  useEffect(() => {
    (async () => {
        const response = await fetch(`/api/sports`);
        let newSports = (await response.json()).sports;
        if (response.ok) setSports(newSports);
    })();
  }, []);

  const login = async (Email, Password) => {
    const response = await fetch(`/api/session`, { method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email, Password })
    });
    let data = await response.json();
    // console.log("data = ", data);
    if (response.ok) {
      setUser(data.user);
    } else {
      setMessage(data.message || data.error.errors[0]);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    let message = !Email ? "Email address is needed." : !Password ? "Password is needed." : "";
    setMessage(message);
    if (!message) login(Email, Password);
  }

  return (user.id) ? <Redirect to="/" /> : (
    <div className="center">
    <div className="simple narrow">

      <h4>Do you want to organize and/or participate in the following?</h4><br/>
      <div className="sportsList">
        {sports.map(sport => (
          <span key={sport.id}>
            {sport.Name}
          </span>
        ))}
      </div><br/>

      <form className="auth" onSubmit={handleSubmit}>
        <h4>If so, please either login or signup below.</h4>
        <span>Email address:</span>
        <input
          type="text" placeholder="Email" value={Email}
          onChange={e => setEmail(e.target.value)}
        />
        <span>Password:</span>
        <input
          type="password" placeholder="Password" value={Password}
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
    </div>
  );
}

export default LogIn;
