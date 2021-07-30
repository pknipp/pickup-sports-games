import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from '../../auth';

const EditReservation = ({ match }) => {
  const resGameId = match.params.resGameId;
  const [reservationId, gameId] = resGameId.split('-').map(id => Number(id));
  const { fetchWithCSRF, currentUser, rerender, setRerender } = useContext(AuthContext);
  const properties = ['setter','middle','rightSide','outside','libero','twos','fours','sixes'];
  const nullReservation = properties.reduce((pojo, prop) => {
    return {...pojo, [prop]: false};
  }, {id: 0, playerId: 0, gameId: 0, game: {address: '', dateTime: ''}});
  const [reservation, setReservation] = useState({...nullReservation,
    playerId: currentUser.id,
    id: reservationId,
    gameId
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      const res = await fetch(`/api/reservations/${resGameId}`);
      let newReservation = {...reservation, ...(await res.json()).reservation};
      Object.keys(newReservation).forEach(key => {
        if (newReservation[key] === null) newReservation[key] = false;
      })
      setReservation(newReservation);
    })();
  }, [reservation.id]);



  const handlePutPost = async e => {
    e.preventDefault();
    const res = await fetch(`/api/reservations${reservation.id ? ('/' + reservation.id) : ''}`, { method: reservation.id ? 'PUT': 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation)
    });
    let newReservation = (await res.json()).reservation;
    if (reservation.id) {
      // PUT route
      setMessage("Success");
    } else {
      // POST route
      history.push('/');
    }
    setReservation(newReservation);
    // Is the following line necessary?
    setRerender(rerender + 1);
  };

  const handleDelete = async e => {
    e.preventDefault();
    const res = await fetch(`/api/reservations/${reservation.id}`, { method: 'DELETE'});
    if (res.ok) {
      setReservation(JSON.parse(JSON.stringify(nullReservation)));
      // Is the following unnecessary?
      setRerender(rerender + 1);
      history.push('/');
    }
  }

  return (
    <div className="simple">
      <form className="auth" onSubmit={handlePutPost}>
        <h4>
          {reservation.id ? "Change" : "Choose"} your reservation details for the game at {reservation.game.address} on {reservation.game.dateTime}.
        </h4>
        {properties.map(property => (
          <span key={property}>
            <span>{property}:</span>
            <input
              name={property}
              type="checkbox"
              checked={reservation[property]}
              onChange={e => setReservation({...reservation, [property]: e.target.checked})}
            />
          </span>
        ))}

        <button color="primary" variant="outlined" type="submit">
          {reservation.id ? "Modify" : "Make"} reservation
        </button>
        <span style={{color: "red", paddingLeft:"10px"}}>{message}</span>
      </form>
      {!reservation.id ? null :
        <form className="auth" onSubmit={handleDelete}>
          <button color="primary" variant="outlined" type="submit">
            Cancel reservation
          </button>
        </form>
      }
    </div>
  );
}

export default EditReservation;
