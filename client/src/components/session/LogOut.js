import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import Context from '../../context';

const LogOut = () => {

  const { fetchWithCSRF, currentUser, setCurrentUser } = useContext(Context);

  const logout = async () => {
    const res = await fetch('/api/session', { method: "delete" });
    if (res.ok) setCurrentUser(null);
  }

  const handleSubmit = e => {
    e.preventDefault();
    logout();
  }

  return (!currentUser) ? <Redirect to="/login" /> : (
    <form className="simple" onSubmit={handleSubmit}>
      <button color="primary" variant="outlined" type="submit">Logout</button>
    </form>
  );
}

export default LogOut;
