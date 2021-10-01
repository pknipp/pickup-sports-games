import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import Context from '../../context';
// import fetch from 'node-fetch';

const EditReservation = ({ match }) => {
  const resEventId = match.params.resEventId;
  const [reservationId, eventId] = resEventId.split('-').map(id => Number(id));
  const { fetchWithCSRF, user, genders } = useContext(Context);
  let [boolTypes, setBoolTypes] = useState({genders});
  const nullReservation =
    {id: 0, userId: 0, eventId: 0, event: {Location: '', dateTime: ''}, boolVals: {genders: 0}};
  const [reservation, setReservation] = useState({
    ...nullReservation, userId: user.id, id: reservationId, eventId
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

      // "Genders" booleans come from context, whereas the other booleans come from the db.
      // let newBoolTypes = {genders: genders.slice(0, newReservation.nGenders), ...newReservation.event.boolTypes};
      let newBoolTypes = {...newReservation.event.boolTypes};
      if (newReservation.nGenders) {
        newBoolTypes = {genders: genders.slice(0, newReservation.nGenders), ...newBoolTypes};
      }
      // Decode base-2 integer in db to determine boolean array for each boolType.
      Object.entries(newBoolTypes).forEach(([boolType, bools]) => {
        bools.forEach((bool, i) => {
          // The rightmost bit is used to determine the present boolean.
          const boolVal = newReservation.boolVals[boolType] % 2;
          // !!converts a bit into a boolean.
          bools[i] = [bool, !!boolVal];
          // Subtract the rightmost bit from the integer (leaving 0 as the last bit).
          newReservation.boolVals[boolType] -= boolVal;
          // Dividing the integer by two acts to remove the rightmost bit (a zero).
          newReservation.boolVals[boolType] /= 2;
        })
      });
      setBoolTypes(newBoolTypes);
      setReservation(newReservation);
    })();
  }, [reservation.id]);



  const handlePutPost = async e => {
    e.preventDefault();
    // Encoding the arrays of booleans is done one boolean type at a time.
    Object.entries(boolTypes).forEach(([boolType, bools]) => {
      // Each booleanType's responses are encoded as ("reduced into") a base-2 integer.
      reservation.boolVals[boolType] = [...bools].reverse().reduce((tot, bool) => {
        // Number(...) converts boolean (F/T) to a bit (0/1), which then supplements the accumulator
        return 2 * tot + Number(bool[1]);
        }, 0);
    });
    // A warning is generated if the user selects no checkboxes, for a particular boolean type.
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
      setReservation(newReservation);
    } else {
      // POST route
      history.push('/');
    }
  };

  const handleDelete = async e => {
    e.preventDefault();
    const res = await fetch(`/api/reservations/${reservation.id}`, { method: 'DELETE'});
    if (res.ok) history.push('/');
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
        <div className="horizontal">
          {/* Create the checkboxes one boolType at a time. */}
          {Object.entries(boolTypes).reverse().map(([boolType, boolArray], index1) => (
            <div key={boolType}><br/>
              <div>
                <h4 className="center">
                  ...
                  {/* The following ternary only makes the grammar proper. */}
                  {index1 && index1 === Object.keys(boolTypes).length - 1 ? " and " : " "}
                  {/* The following controls the appearance of this helpful point, for one boolean type. */}
                  {boolType}{boolType === "genders" ? " (trans-inclusive)" : ""}
                  :
                </h4>
              </div>
              <div className="vertical center">
                <div>
              {boolArray?.map((bool, index2) => (
                <div key={index2} className="checkboxPair">
                  {/* label for the checkbox */}
                  <span>{bool[0] === "mixed" ? "*" : ""}{bool[0]}</span>
                  <input
                    type="checkbox"
                    // value for the checkbox
                    checked={bool[1]}
                    onChange={e => {
                      // easy way to make a deep clone
                      const newBoolTypes = JSON.parse(JSON.stringify(boolTypes));
                      // change value in deep clone, and then overwrite state
                      newBoolTypes[boolType][index2][1] = e.target.checked;
                      setBoolTypes(newBoolTypes);
                    }}
                  />
                </div>
              ))}
              </div>
              </div>
            </div>
          ))}
        </div>
        <div>
        {reservation.nGenders < 4 ? null :
            '*Here the term "mixed" has the usual meaning for this sport and/or league, in terms of the male/female ratio on a team.'
          }
        </div>
        <br/>

        <span><h4>Extra info about your reservation (optional):</h4></span>

        <textarea
          rows="3" cols="90"
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
