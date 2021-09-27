import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import Context from '../../context';

const User = () => {
  const { fetchWithCSRF, user, setUser } = useContext(Context);
  const properties = [
    'Email',
    'First name',
    'Last name',
    'Nickname',
    'Address',
    'Cell',
  ];
  const [password, setPassword] = useState('');
  const [password2, setPassword2]=useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sports, setSports] = useState([]);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    (async() => {
      const data = await (await fetch('/api/sports')).json();
      setSports(data.sports.sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0));
      if (user.id) {
        const data = await (await fetch('/api/favorites')).json();
        setFavorites(data.favorites.sort((a, b) => a.Name - b.Name));
      }
    })();
  }, []);

  const handlePutPost = async e => {
    e.preventDefault();
    let message = !user.Email ? "Provide an email address." :
                  !password?"Provide a password." :
                  password !== password2 ? "Passwords must match" : "";
    if (message) return setMessage(message);
    const res = await fetch(`/api/users`, { method: user.id ? 'PUT': 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...user, password, password2})
    });
    let newUser = {...user, ...(await res.json())};
    message = newUser.messages.join(" ");
    if (res.ok && !message) setUser(newUser);
    if (user.id) setMessage((!res.ok || message) ? message : "Success")
  };

  const handleDelete = async e => {
    e.preventDefault();
    const res = await fetch("/api/users", { method: 'DELETE'});
    let newMessage = (await res.json())?.message;
    if (newMessage || !res.ok) {
      setMessage(newMessage);
    } else {
      setUser({});
    }
  }

  return (
    <div className="vertical">
      <form className="auth vertical" onSubmit={handlePutPost}>
        <h4>
          {user.id ?
            "Change your account details?"
          :
            "We hope that you will either login or signup."
          }
        </h4>
            {properties.map(key => (
              <React.Fragment key={key}>
                <span>{key}:</span>
                <input
                  type={key === "Cell" ? "number" : "text"}
                  placeholder={key}
                  name={key}
                  value={user[key]}
                  onChange={e => {
                    setUser({...user, [key]: key === "Cell" ?
                      Number(e.target.value) : e.target.value
                    })
                  }}
                />
              </React.Fragment>
            ))}

            {/* DRY the following code? */}

            <span>Password:</span>
            <input
              type="password" placeholder="Password" name="password" value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <span>Confirm password:</span>
            <input
              type="password" placeholder="Confirm password" name="password2" value={password2}
              onChange={e => setPassword2(e.target.value)}
            />

        <button color="primary" variant="outlined" type="submit">
          {user.id ? "Update account" : "Signup"}
        </button>
      </form>

      <span style={{color: "red", paddingLeft:"10px"}}>{message}</span>

      {user.id ? null :
        <span>
          <NavLink className="nav" to="/login" activeClassName="active">
            Login
          </NavLink>
        </span>
      }

      {!user.id ? null :
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
