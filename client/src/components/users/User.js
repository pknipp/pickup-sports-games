import React, { useState, useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import AuthContext from '../../auth';

const User = () => {
  const { fetchWithCSRF, currentUser, setCurrentUser } = useContext(AuthContext);
  const properties = [
    'email',
    'firstName',
    'lastName',
    'nickName',
    'address',
    'cell',
    'skill',
    'photo',
    'password',
    'password2'
  ];
  const [params, setParams] = useState(currentUser ?
    {...currentUser, password: '', password2: ''}
      :
    properties.reduce((pojo, prop) => ({[prop]: '', ...pojo}), {id: 0})
  );
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  const user = async () => {
    const res = await fetch(`/api/users`, { method: params.id ? 'PUT': 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    let data = await res.json();
    // console.log("data = ", data);
    let user = data.user;
    // let user = (await res.json()).user;
    setMessage(user.message);
    if (params.id) {
      if (res.ok) {
        // console.log("user =", user);
        setCurrentUser(user);
        setParams({...user, password: '', password2: ''});
      } else {
        setMessage(user.error.errors[0].msg);
      }
    } else {
      setMessage(user.message);
      if (res.ok && !user.message) {
        // console.log("user = ", user);
        setCurrentUser(user);
        setParams(user);
        history.push('/');
      }
    }
  };

  const deleteUser = async () => {
    const res = await fetch("/api/users", { method: 'DELETE'});
    // if (res.ok) dispatch(removeUser());
    let data = await res.json();
    if (data.message || !res.ok) {
      setMessage(data.message);
    } else {
      setCurrentUser(null);
    }
  }

  const handleSubmit = e => {
    e.preventDefault();
    let message = !params.email ? "Email address is needed." :
                  !params.password?"Password is needed." :
                  params.password !== params.password2 ? "Passwords must match" : "";
    setMessage(message);
    if (!message) user();
  };

  const handleDelete = e => {
    e.preventDefault();
    deleteUser();
  }

  return (
    <main className="centered middled">
      <form className="auth" onSubmit={handleSubmit}>
        {/* <h1>{currentUser ? null : "Welcome to volleyball meetup!"}</h1> */}
        <h4>
          {currentUser ?
            "Change your account details?"
          :
            "We hope that you will either login or signup"
          }
        </h4>
        <span>Email address:</span>
        <input
          type="text" placeholder="Email" name="email" value={params.email}
          onChange={e => setParams({...params, email: e.target.value})}
        />
        <span>First name:</span>
        <input
          type="text" placeholder="First name" name="firstName" value={params.firstName}
          onChange={e => setParams({...params, firstName: e.target.value})}
        />
        <span>Last name:</span>
        <input
          type="text" placeholder="Last name" name="lastName" value={params.lastName}
          onChange={e => setParams({...params, lastName: e.target.value})}
        />
        <span>Nickname:</span>
        <input
          type="text" placeholder="Nickname" name="nickName" value={params.nickName}
          onChange={e => setParams({...params, nickName: e.target.value})}
        />
        <span>Address:</span>
        <input
          type="text" placeholder="Address" name="address" value={params.address}
          onChange={e => setParams({...params, address: e.target.value})}
        />
        <span>Cell number (10 digits):</span>
        <input
          type="number" placeholder="Cell" name="cell" value={params.cell}
          onChange={e => setParams({...params, cell: Number(e.target.value)})}
        />
        <span>Skill (integer?):</span>
        <input
          type="number" placeholder="Skill" name="skill" value={params.skill}
          onChange={e => setParams({...params, skill: Number(e.target.value)})}
        />
        <span>Photo url:</span>
        <input type="text" placeholder="Photo url" name="photo" value={params.photo}
          onChange={e => setParams({...params, photo: e.target.value})}
        />
        <span>Password:</span>
        <input
          type="password" placeholder="Password" name="password" value={params.password}
          onChange={e => setParams({...params, password: e.target.value})}
        />
        <span>Confirm password:</span>
        <input
          type="password" placeholder="Confirm password" name="password2" value={params.password2}
          onChange={e => setParams({...params, password2: e.target.value})}
        />
        <button color="primary" variant="outlined" type="submit">
          {currentUser ? "Edit account" : "Signup"}
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
            Delete account
          </button>
        </form>
      }
    </main>
  );
}

export default User;
