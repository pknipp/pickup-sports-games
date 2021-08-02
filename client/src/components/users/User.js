import React, { useState, useContext, useEffect } from 'react';
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
    // 'photo',
    'password',
    'password2'
  ];
  // const skills = ['unknown','1','2','3','4','5','6','7','8','9'];
  const [params, setParams] = useState(currentUser ?
    {...currentUser, password: '', password2: ''}
      :
    properties.reduce((pojo, prop) => ({[prop]: '', ...pojo}), {id: 0})
  );
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [iSkills, setISkills] = useState([]);
  const [gameTypes, setGameTypes] = useState([]);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      const res = await fetch('/api/skills');
      let newGameTypes = (await res.json()).gameTypes;
      setGameTypes(newGameTypes);
    })();
  }, [currentUser.id]);

  const handlePutPost = async e => {
    e.preventDefault();
    let message = !params.email ? "Email address is needed." :
                  !params.password?"Password is needed." :
                  params.password !== params.password2 ? "Passwords must match" : "";
    setMessage(message);
    if (!message) {
      params.skill = isNaN(params.skill) ? 0 : Number(params.skill);
      const res = await fetch(`/api/users`, { method: currentUser ? 'PUT': 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      let user = (await res.json()).user;
      let message = user.message;
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
    };
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
    <div className="simple">
      <form className="auth" onSubmit={handlePutPost}>
        <h4>
          {currentUser ?
            "Change your account details?"
          :
            "We hope that you will either login or signup."
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
        <span>Skill:</span>
        {/* <input
          type="number" placeholder="Skill" name="skill" value={params.skill}
          onChange={e => setParams({...params, skill: "unknown" || Number(e.target.value)})}
        /> */}

        {/* <select
          onChange={e => setParams({...params, skill: !Number(e.target.value) ? 'unknown' : e.target.value})}
          value={params.skill}
        >
          {skills.map((skill, index) => (
              <option
                  key={`${index}`}
                  value={index || 'unknown'}
              >
                  {skill}
              </option>
          ))}
        </select> */}

        {/* <span>Photo url:</span>
        <input type="text" placeholder="Photo url" name="photo" value={params.photo}
          onChange={e => setParams({...params, photo: e.target.value})}
        /> */}
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
    </div>
  );
}

export default User;
