import React, { useState, useContext } from 'react';
import { Redirect, NavLink, useHistory } from 'react-router-dom';

import AuthContext from '../../auth';
import { signup, editUser, deleteUser } from './store/authentication';
// import { Input, Button } from '@material-ui/core';

const SignUp = () => {
  const { fetchWithCSRF, currentUser, setCurrentUser } = useContext(AuthContext);
  const [email, setEmail] = useState(currentUser ? currentUser.email : '');
  const [firstName, setFirstName] = useState(currentUser ? currentUser.firstName : '');
  const [lastName, setLastName] = useState(currentUser ? currentUser.lastName : '');
  const [nickName, setNickName] = useState(currentUser ? currentUser.nickName : '');
  const [cell, setCell] = useState(currentUser ? currentUser.nickName : null);
  const [skill, setSkill] = useState(currentUser ? currentUser.skill : null);
  const [photo, setPhoto] = useState(currentUser ? currentUser.photo : '');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  let history = useHistory();

  const signup = async (email, password, firstName, lastName, nickName, cell, skill, photo) => {
    const res = await fetch(`/api/users`, { method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName, nickName, cell, skill, photo })
    });
    let user = (await res.json()).user;
    // dispatch(res.ok ? setUser(data.user) : setMessage(data.error.errors[0].msg));
    console.log("user = ", user);
    setMessage(user.message);
    if (!user.message && res.ok) {
      setCurrentUser(user);
      history.push('/');
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    let message = !email ? "Email address is needed." :
                  !password?"Password is needed." :
                  password !== password2 ? "Passwords must match" : "";
    setMessage(message);
    if (!message) {
      if (currentUser) {
        editUser(email, password, firstName, lastName, nickName, cell, skill, photo, currentUser.id);
      } else {
        signup(email, password, firstName, lastName, nickName, cell, skill, photo);
      }
    }
  };

  const handleDelete = e => {
    e.preventDefault();
    deleteUser(currentUser.id);
  }

  return (
    <main className="centered middled">
      <form className="auth" onSubmit={handleSubmit}>
        <h1>{currentUser ? null : "Welcome to volleyball meetup!"}</h1>
        <h4>
          {currentUser ?
            "Change your account details?"
          :
            "We hope that you will either login or signup"
          }
        </h4>
        <span>Email address:</span>
        <input
          type="text" placeholder="Email" name="email" value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <span>First name:</span>
        <input
          type="text" placeholder="First name" name="firstName" value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
        <span>Last name:</span>
        <input
          type="text" placeholder="Last name" name="lastName" value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
        <span>Nickname:</span>
        <input
          type="text" placeholder="Nickname" name="nickName" value={nickName}
          onChange={e => setNickName(e.target.value)}
        />
        <span>Cell number (10 digits):</span>
        <input
          type="number" placeholder="Cell" name="cell" value={cell}
          onChange={e => setCell(Number(e.target.value))}
        />
        <span>Skill (integer?):</span>
        <input
          type="number" placeholder="Skill" name="skill" value={skill}
          onChange={e => setSkill(Number(e.target.value))}
        />
        <span>Photo url:</span>
        <input type="text" placeholder="Photo url" name="photo" value={photo}
          onChange={e => setPhoto(e.target.value)}
        />
        <span>Password:</span>
        <input
          type="password" placeholder="Password" name="password" value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <span>Confirm password:</span>
        <input
          type="password" placeholder="Password" name="password2" value={password2}
          onChange={e => setPassword2(e.target.value)}
        />
        <button color="primary" variant="outlined" type="submit">
          {currentUser ? "Submit changes" : "Signup"}
        </button>
        <span style={{color: "red", paddingLeft:"10px"}}>{message}</span>
        {currentUser ? null :
          <span>
            <NavLink className="nav" to="/login" activeClassName="active">
              Login
            </NavLink>
          </span>
        }
      </form>
      {!currentUser ? null :
        <form className="auth" onSubmit={handleDelete}>
          <button color="primary" variant="outlined" type="submit">
            Delete account?
          </button>
        </form>
      }
    </main>
  );
}

export default SignUp;
