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
    // 'photo',
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
  const [skill, setSkill] = useState(0);
  const [gameTypes, setGameTypes] = useState([]);
  const [gameTypeId, setGameTypeId] = useState(0);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      const res = await fetch('/api/skills');
      let newGameTypes = (await res.json()).gameTypes.sort((a, b) => a.id - b.id);
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
      let newParams = {...params, gameTypeId, skill}
      const res = await fetch(`/api/users`, { method: currentUser ? 'PUT': 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newParams)
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
        {/* DRY the following code. */}
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
        <span>{gameTypeId ? gameTypes[gameTypeId - 1].name : ""} skill-level:</span>

        <select
          onChange={e => {
            let val = Number(e.target.value);
            if (gameTypeId) {
              if (val <= gameTypes[gameTypeId - 1].skills.length) {
                setSkill(val);
              } else {
                setGameTypeId(0);
              }
            } else {
              setGameTypeId(val);
              setSkill(gameTypes[gameTypeId].skill);
            }
          }}
          value={gameTypeId && skill}
        >
          {[null, ...(gameTypeId ? [...gameTypes[gameTypeId - 1].skills, 'Cancel'] : gameTypes)].map((gameType, index) => (
              <option
                  key={`${index}`}
                  value={index}
              >
                  {index ? (
                    gameTypeId && index === gameTypes[gameTypeId - 1].skills.length + 1 ? 'CANCEL' :
                    gameTypeId ? gameTypes[gameTypeId - 1].skills[index - 1] : gameType.name)
                  : `Select ${gameTypeId ? "level" : "sport"}`}
              </option>
          ))}
        </select>

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
