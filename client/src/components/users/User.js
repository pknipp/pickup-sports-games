import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

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
    // 'photo',
    'password',
    'password2'
  ];
  // const [params, setParams] = useState(currentUser ?
  //   {...currentUser, password: '', password2: '', Skill: 0, index: 0}
  //     :
  //   properties.reduce((pojo, prop) => ({[prop]: '', ...pojo}), {id: 0, Skill: 0, index: 0})
  // );
  const [password, setPassword] = useState('');
  const [password2, setPassword2]=useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sports, setSports] = useState([]);
  const [Address, setAddress] = useState('');
  // const [refetch, setRefetch] = useState(false);

  let history = useHistory();

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
    let newUser = await res.json();
    let messages = newUser.messages;

    // if (newUser.Address !== Address) {
    //   setNeedsContinue(!newUser.messages.length);
    //   setMessage(newUser.messages.length || `You specified your address as ${Address}, which the system interpreted as  indicated  above.  If this is acceptable to you, click the "Continue" button, below.  If not, modify the address above and   click "Update account".`);
    //   setUser({...user, ...newUser});
    // }

    if (user.id || (res.ok && !messages.length)) setUser({...user, ...newUser});
    if (!user.id && (res.ok && !messages.length)) return history.push('/');
    setMessage(!res.ok || messages.length ? messages.join(" ") : "Success")
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

  const proceed = () => history.push('/');

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

            {/* DRY the following code. */}
            <span>Email address:</span>
            <input
              type="text" placeholder="Email" name="Email" value={user.Email}
              onChange={e => setUser({...user, Email: e.target.value})}
            />
            <span>First name:</span>
            <input
              type="text" placeholder="First name" name="First name" value={user['First name']}
              onChange={e => setUser({...user, ['First name']: e.target.value})}
            />
            <span>Last name:</span>
            <input
              type="text" placeholder="Last name" name="Last name" value={user['Last name']}
              onChange={e => setUser({...user, ['Last name']: e.target.value})}
            />
            <span>Nickname:</span>
            <input
              type="text" placeholder="Nickname" name="Nickname" value={user.Nickname}
              onChange={e => setUser({...user, Nickname: e.target.value})}
            />
            <span>Address:</span>
            <input
              type="text" placeholder="Address" name="Address" value={user.Address}
              onChange={e => {
                let newAddress = e.target.value;
                setUser({...user, Address: newAddress});
                setAddress(newAddress);
              }}
            />
            <span>Cell number (10 digits):</span>
            <input
              type="number" placeholder="Cell" name="Cell" value={user.Cell}
              onChange={e => setUser({...user, Cell: Number(e.target.value)})}
            />

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
        <span style={{color: "red", paddingLeft:"10px"}}>{message}</span>
        {user.id ? null :
          <span>
            <NavLink className="nav" to="/login" activeClassName="active">
              Login
            </NavLink>
          </span>
        }
      </form>
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
