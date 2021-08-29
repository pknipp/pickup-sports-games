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
    {...currentUser, password: '', password2: ''}
      :
    properties.reduce((pojo, prop) => ({[prop]: '', ...pojo}), {id: 0})
  );
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [Skill, setSkill] = useState(0);
  const [gameTypes, setGameTypes] = useState([]);
  const [gameTypeId, setGameTypeId] = useState(0);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      const res = await fetch('/api/gameTypes');
      setGameTypes((await res.json()).gameTypes.sort((a, b) => a.id - b.id));
    })();
  }, [currentUser.id]);

  const handlePutPost = async e => {
    e.preventDefault();
    let message = !params.Email ? "Email address is needed." :
                  !params.password?"Password is needed." :
                  params.password !== params.password2 ? "Passwords must match" : "";
    setMessage(message);
    if (!message) {
      let newParams = {...params, gameTypeId, Skill}
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
        <span>{gameTypeId ? gameTypes[gameTypeId - 1].Sport : ""} skill-level:</span>
        <select
          onChange={e => {
            let val = Number(e.target.value);
            if (gameTypeId) {
              if (val === gameTypes[gameTypeId - 1].skills.length + 1) {
                setGameTypeId(0);
              } else {
                setSkill(val);
              }
            } else {
              setGameTypeId(val);
              setSkill(gameTypes[val].Skill);
            }
          }}
          value={gameTypeId && gameTypes[gameTypeId - 1].Skill}
        >
          {[null, ...(gameTypeId ? [...gameTypes[gameTypeId - 1].skills, 'Cancel'] : gameTypes)].map((element, index) => (
              <option
                  key={`${index}`}
                  value={index}
              >
                  {index ? (
                    gameTypeId ? (
                      index === gameTypes[gameTypeId - 1].skills.length + 1 ?
                        'CANCEL' : gameTypes[gameTypeId - 1].skills[index - 1]
                    ) : gameTypes[index - 1].Sport
                  ) : `Select ${gameTypeId ? "level" : "sport"}`}
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
