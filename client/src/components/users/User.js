import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import Context from '../../context';

const User = () => {
  const { fetchWithCSRF, currentUser, setCurrentUser } = useContext(Context);
  const properties = [
    'Email',
    'First name',
    'Last name',
    'Nickname',
    'Address',
    'Cell',
    // 'photo',
    'password',
    'password2'
  ];
  const [params, setParams] = useState(currentUser ?
    {...currentUser, password: '', password2: '', Skill: 0, index: 0}
      :
    properties.reduce((pojo, prop) => ({[prop]: '', ...pojo}), {id: 0, Skill: 0, index: 0})
  );
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sports, setSports] = useState([]);
  const [refetch, setRefetch] = useState(false);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      const data = await (await fetch('/api/sports')).json();
      setSports(data.sports.sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0));
      if (currentUser) {
        const data = await (await fetch('/api/favorites')).json();
        setFavorites(data.favorites.sort((a, b) => a.Name - b.Name));
      }
    })();
  }, [refetch]);

  const handlePutPost = async e => {
    e.preventDefault();
    let message = !params.Email ? "Email address is needed." :
                  !params.password?"Password is needed." :
                  params.password !== params.password2 ? "Passwords must match" : "";
    if (message) return setMessage(message);
    const res = await fetch(`/api/users`, { method: currentUser ? 'PUT': 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    let user = (await res.json()).user;
    message = user.message;
    if (currentUser) {
      // PUT route
      setCurrentUser(user);
      setParams({...user, password: '', password2: ''});
      message = (res.ok && !message) ? "Success" : message;
    } else {
      // POST route
      if (res.ok && !message) {
        setCurrentUser(user);
        setParams(user);
        history.push('/');
      }
    }
    setMessage(message);
    setRefetch(!refetch);
  };

  const handleDelete = async e => {
    e.preventDefault();
    const res = await fetch("/api/users", { method: 'DELETE'});
    let data = await res.json();
    if (data.message || !res.ok) {
      setMessage(data.message);
    } else {
      setCurrentUser(null);
    }
  }
  return (
    <div className="vertica">
      <form className="auth vertical" onSubmit={handlePutPost}>
        <h4>
          {currentUser ?
            "Change your account details?"
          :
            "We hope that you will either login or signup."
          }
        </h4>
        <div className="horizontal">
          <div className="vertical left">
            {/* DRY the following code. */}
            <span>Email address:</span>
            <input
              type="text" placeholder="Email" name="Email" value={params.Email}
              onChange={e => setParams({...params, Email: e.target.value})}
            />
            <span>First name:</span>
            <input
              type="text" placeholder="First name" name="First name" value={params['First name']}
              onChange={e => setParams({...params, ['First name']: e.target.value})}
            />
            <span>Last name:</span>
            <input
              type="text" placeholder="Last name" name="Last name" value={params['Last name']}
              onChange={e => setParams({...params, ['Last name']: e.target.value})}
            />
            <span>Nickname:</span>
            <input
              type="text" placeholder="Nickname" name="Nickname" value={params.Nickname}
              onChange={e => setParams({...params, Nickname: e.target.value})}
            />
            <span>Address:</span>
            <input
              type="text" placeholder="Address" name="Address" value={params.Address}
              onChange={e => setParams({...params, Address: e.target.value})}
            />
            <span>Cell number (10 digits):</span>
            <input
              type="number" placeholder="Cell" name="Cell" value={params.Cell}
              onChange={e => setParams({...params, Cell: Number(e.target.value)})}
            />

            <span>Password:</span>
            <input
              type="password" placeholder="Password" name="password" value={params.password}
              onChange={e => setParams({...params, password: e.target.value})}
            />
            <span>Confirm password:</span>
            <input
              type="password" placeholder="Confirm password" name="password2" value={params.  password2}
              onChange={e => setParams({...params, password2: e.target.value})}
            />
          </div>
          
        </div>
        <button color="primary" variant="outlined" type="submit">
          {currentUser ? "Update account" : "Signup"}
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
      </div>
  );
}

export default User;
