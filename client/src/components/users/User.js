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
  // const [Skill, setSkill] = useState(0);
  const [favorites, setFavorites] = useState([]);
  // const [sportIds, setSportIds] = useState([]);
  const [index, setIndex] = useState(0);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      if (currentUser) {
        const data = await (await fetch('/api/favorites')).json();
        let newFavorites = (data.favorites || []).sort((a, b) => a.Name - b.Name);
        setFavorites(newFavorites);
        // setSportIds(newSports.map(sport => sport.id));
      }
    })();
  }, []);

  const handlePutPost = async e => {
    e.preventDefault();
    let message = !params.Email ? "Email address is needed." :
                  !params.password?"Password is needed." :
                  params.password !== params.password2 ? "Passwords must match" : "";
    setMessage(message);
    if (!message) {
      // Two instances of "-1" each address need for 1st item in each dropdown
      let newParams = {...params, sportId: favorites[index - 1],
        // sportIds[sportIndex - 1],
        // Skill: Skill - 1
      }
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
        {!currentUser ? null : <><span>{index ? favorites[index - 1].Name
        // sports[sportIndex - 1].Name
         : ""} skill-level:</span>
        <select
          onChange={e => {
            let val = Number(e.target.value);
            // if a sport has been selected
            if (index) {
              if (val === favorites[index - 1].Skills.length + 1) {
                // CANCEL, and return to sport-selection
                setIndex(0);
              } else {
                let newParams = JSON.parse(JSON.stringify(params));
                newParams.Skill = val;
                // setSkill(val);
              }
            } else {
              // if (val) setSportIndex(val);
            }
          }}
          // value={sportIndex && (Skill || sports[sportIndex - 1]?.Skill + 1)}
        >

          {/* {[null, ...(sportIndex ? [...sports[sportIndex - 1].skills, 'Cancel'] : sports)].map((element, index) => ( */}
              <option
                  key={`${index}`}
                  value={index}
              >
                  {index ? (
                                        index ? (
                      index === favorites[index - 1].Skills.length + 1 ?
                        'CANCEL' : favorites[index - 1].Skills[index - 1]
                    ) : favorites[index - 1].Name
                  ) : `Select ${index ? "level" : "sport first"}`}
              </option>
          ))}
        </select></>}

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
