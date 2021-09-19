import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import Context from '../../context';
import fetch from 'node-fetch';

const EditReservation = ({ match }) => {
  const resEventId = match.params.resEventId;
  const [reservationId, eventId] = resEventId.split('-').map(id => Number(id));
  const { fetchWithCSRF, currentUser, rerender, setRerender, genders } = useContext(Context);
  let [boolTypes, setBoolTypes] = useState({genders});
  const nullReservation =
    {id: 0, userId: 0, eventId: 0, event: {Location: '', dateTime: ''}, boolVals: {genders: 0}};
  const [reservation, setReservation] = useState({
    ...nullReservation, userId: currentUser.id, id: reservationId, eventId
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      let newReservation = {...reservation, ...(await (await fetch(`/api/reservations/${resEventId}`)).json()).reservation};
      Object.keys(newReservation).forEach(key => {
        if (newReservation[key] === null) newReservation[key] = key === 'Extra info' ? '' : false;
      })
      newReservation.event.dateTime = moment(newReservation.event.dateTime).local().format().slice(0,-9);

      let newBoolTypes = {genders: genders.slice(0, newReservation.nGenders), ...newReservation.event.boolTypes};
      // Decode base-2 integer in db to determine boolean array for each boolType.
      Object.entries(newBoolTypes).forEach(([boolType, bools]) => {
        bools.forEach((bool, i) => {
          const boolVal = newReservation.boolVals[boolType] % 2;
          bools[i] = [bool, !!boolVal];
          newReservation.boolVals[boolType] -= boolVal;
          newReservation.boolVals[boolType] /= 2;
        })
      });
      setBoolTypes(newBoolTypes);
      setReservation(newReservation);
    })();
  }, [reservation.id]);



  const handlePutPost = async e => {
    e.preventDefault();
    // Encode the array of booleans for each booleanType as a base-2 integer, for storing in db.
    Object.entries(boolTypes).forEach(([boolType, bools]) => {
      reservation.boolVals[boolType] = [...bools].reverse().reduce((tot, bool) => 2 * tot + Number(bool[1]), 0);
    });
    let haveNoBools = Object.values(reservation.boolVals).reduce((sum, value) => sum + Number(!value), 0);
    let newMessage = !haveNoBools ? '' :
      "You need to select at least one checkbox from " + haveNoBools + " of the groups above.";
    if (newMessage) return setMessage(newMessage);
    const res = await fetch(`/api/reservations${reservation.id ? ('/' + reservation.id) : ''}`, { method: reservation.id ? 'PUT': 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation)
    });
    let newReservation = (await res.json()).reservation;
    newReservation.event.dateTime = moment(newReservation.event.dateTime).local().format().slice(0,-9);
    if (reservation.id) {
      // PUT route
      setMessage("Success");
    } else {
      // POST route
      history.push('/');
    }
    setReservation(newReservation);
    // // Is the following line necessary?
    setRerender(rerender + 1);
  };

  const handleDelete = async e => {
    e.preventDefault();
    const res = await fetch(`/api/reservations/${reservation.id}`, { method: 'DELETE'});
    if (res.ok) {
      setReservation(nullReservation);
      // Is the following unnecessary?
      setRerender(rerender + 1);
      history.push('/');
    }
  }

  return (
    <div className="simple">
      <form className="auth" onSubmit={handlePutPost}>
        <h3>
          {reservation.id ? "Change" : "Choose"} your reservation details for {reservation.event?.Sport?.toLowerCase()} at {reservation.event?.Location} on &nbsp;
          {reservation.event?.dateTime.split('T')[0]} at &nbsp;
          {reservation.event?.dateTime.split('T')[1]}.
        </h3>
        <span><h4>{reservationId ? "Below are" : "Specify below"} your willingnesses for ...</h4></span>
        <div>
          {Object.entries(boolTypes).reverse().map(([boolType, boolArray], index1) => (
            <div key={boolType}><br/>
              <div><h4>... {index1 && index1 === Object.keys(boolTypes).length - 1 ? " and " : " "}{boolType}{boolType === "genders" ? " (trans-inclusive)" : ""}:</h4></div>
              {boolArray?.map((bool, index2) => (
                <div key={index2} className="checkboxPair">
                  <span>{bool[0]}</span>
                  <input
                    type="checkbox"
                    checked={bool[1]}
                    onChange={e => {
                      const newBoolTypes = JSON.parse(JSON.stringify(boolTypes));
                      newBoolTypes[boolType][index2][1] = e.target.checked;
                      setBoolTypes(newBoolTypes);
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
          {reservation.nGenders < 4 ? null :
            '(Here the term "mixed" has the usual meaning for this sport, in terms of the male/female ratio on a team.)'
          }
          <br/>
          <br/>
        </div>

        <span><h4>Extra info about your reservation (optional):</h4></span>

        <textarea
          placeholder="Extra info" name="Extra info" value={reservation['Extra info']}
          onChange={e => setReservation({...reservation, ['Extra info']: e.target.value})}
        />

        <button color="primary" variant="outlined" type="submit">
          {reservation.id ? "Update" : "Create"} reservation
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
