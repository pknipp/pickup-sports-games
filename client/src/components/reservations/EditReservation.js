import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import AuthContext from '../../auth';

const EditReservation = ({ match }) => {
  const [reservationId, gameId] = match.params.resGameId.split('-').map(id => Number(id));
  const { fetchWithCSRF, currentUser, rerender, setRerender } = useContext(AuthContext);
  const properties = ['setter','middle','rightSide','outside','libero','twos','fours','sixes'];

  // const [reservationId, setReservationId] = useState(Number(match.params.gameId));
  const [reservation, setReservation] = useState(properties.reduce((pojo, prop) => {
    return {[prop]: false, ...pojo};
  }, {id: reservationId, gameId: gameId, playerId: currentUser.id, game: {address: null, dateTime: null}}));
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      if (reservation.id) {
        const res = await fetch(`/api/reservations/${reservation.id}`);
        let fetchedReservation = (await res.json()).reservation;
        Object.keys(fetchedReservation).forEach(key => {
          if (fetchedReservation[key] === null) fetchedReservation[key] = false;
        })
        console.log(fetchedReservation);
        setReservation(fetchedReservation);
      }
    })();
  }, [reservation.id]);

  const deleteReservation = async () => {
    const res = await fetch(`/api/reservations/${reservation.id}`, { method: 'DELETE'});
    if (res.ok) {
      let nullReservation = properties.reduce((pojo, prop) => {
        return {[prop]: '', ...pojo};
      }, {});
      [nullReservation.id, nullReservation.gameId, nullReservation.playerId] = [0, 0, 0];
      setReservation(nullReservation);
      setRerender(rerender + 1);
      history.push('/');
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`/api/reservations${reservation.id ? ('/' + reservation.id) : ''}`, { method: reservation.id ? 'PUT': 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation)
    });
    let data = await res.json();
    let fetchedReservation = data.reservation;
    if (reservation.id) {
      setMessage("Success");
    } else {
      history.push('/');
    }
    setReservation(fetchedReservation);
    // Is the following line necessary?
    setRerender(rerender + 1);
  };

  const handleDelete = e => {
    e.preventDefault();
    deleteReservation();
  }

  let newReservation = {...reservation};
  return (
    <main className="centered middled">
      <form className="auth" onSubmit={handleSubmit}>
        <h4>
          {reservation.id ? "Change" : "Choose"} your reservation details for the game at {reservation.game.address} on {reservation.game.dateTime}.
        </h4>
        {/* <span>Game address:</span>
        <input
          type="text" placeholder="address" name="address" value={game.address}
          onChange={e => setReservation(newReservation)}
        /> */}
        {properties.map(property => (
          <>
            <span>{property}:</span>
            <input
              name={property}
              type="checkbox"
              checked={reservation[property]}
              onChange={e => setReservation({...newReservation, [property]: e.target.checked})}
            />
          </>
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
    </main>
  );
}

export default EditReservation;
