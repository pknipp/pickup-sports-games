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

  let history = useHistory();

  useEffect(() => {
    (async() => {
      if (currentUser) {
        const data = await (await fetch('/api/favorites')).json();
        setFavorites(data.favorites.sort((a, b) => a.id - b.id));
      }
    })();
  }, []);

  const handlePutPost = async e => {
    e.preventDefault();
    let message = !params.Email ? "Email address is needed." :
                  !params.password?"Password is needed." :
                  params.password !== params.password2 ? "Passwords must match" : "";
    return setMessage(message);
    // if (!message) {
    //   // Two instances of "-1" each address need for 1st item in each dropdown
    //   // let newParams = {...params, index: params.index,
    //     // sportIds[sportIndex - 1],
    //     // Skill: Skill - 1
    //   }
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
        {!currentUser ? null : <><span>{params.index ? favorites[params.index - 1].Name
         : ""} skill-level:</span>
        <select
          onChange={e => {
            let newIndex = Number(e.target.value);
            // If no sport has been selected, first choose one.
            if (!params.index) {
              if (newIndex) setParams({...params, index: newIndex, Skill: favorites[newIndex - 1].Skill});
            // If a sport has already been selected.
            } else {
              // If you want to cancel current choice of sport.
              if (!newIndex) {
                setParams({...params, index: 0});
              // If a particular skill has been selected.
              } else {
                setParams({...params, Skill: newIndex - 1});
                //Eliminate following 3 lines if this is ever handled by the backend.
                let newFavorites = JSON.parse(JSON.stringify(favorites));
                newFavorites[params.index].Skill = newIndex - 1;
                setFavorites(newFavorites);
              }
            }
          }}
          value={params.index && params.Skill + 1}
        >
          {[null, ...(params.index ? favorites[params.index - 1]?.Skills :
            favorites.map(favorite => favorite.Name))].map((element, newIndex) => (
              <option
                  key={`${!!params.index}${newIndex}`}
                  value={newIndex}
              >
                {newIndex ? element : `${params.index ? "Choose another " : "Select a "} sport`}
              </option>
          ))}
        </select></>}

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
