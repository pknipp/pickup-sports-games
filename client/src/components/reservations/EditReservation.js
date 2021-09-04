import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import Context from '../../context';
import fetch from 'node-fetch';

const EditReservation = ({ match }) => {
  const resEventId = match.params.resEventId;
  const [reservationId, eventId] = resEventId.split('-').map(id => Number(id));
  const { fetchWithCSRF, currentUser, rerender, setRerender, genders } = useContext(Context);
  // const [positionBools, setPositionBools] = useState([]);
  // const [sizeBools, setSizeBools] = useState([]);
  let [boolTypes, setBoolTypes] = useState({genders});
  const [bools, setBools] = useState([]);
  const nullReservation =
  // Object.keys(boolTypes).reduce((pojo, prop) => {
    // return {...pojo, [prop]: false};
  // },
    {id: 0, playerId: 0, eventId: 0, event: {Location: '', dateTime: ''}};
  const [reservation, setReservation] = useState({
    // ...nullReservation,
    playerId: currentUser.id,
    id: reservationId,
    eventId
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      let newReservation = (await (await fetch(`/api/reservations/${resEventId}`)).json()).reservation;
      Object.keys(newReservation).forEach(key => {
        if (newReservation[key] === null) newReservation[key] = key === 'Extra info' ? '' : false;
      })
      newReservation.event.dateTime = moment(newReservation.event.dateTime).local().format().slice(0,-9);

      let newBoolTypes = {genders, ...newReservation.event.boolTypes};
      // Least significant end of array is genderBools; most significant is sizeBools.
      Object.entries(newBoolTypes).forEach(([boolType, boolArray]) => {
        boolArray.forEach((bool, i) => {
          const boolVal = newReservation.boolVals[boolType] % 2;
          boolArray[i] = [bool, !!boolVal];
          newReservation.boolVals[boolType] -= boolVal;
          newReservation.boolVals[boolType] /= 2;
        })
      });
      setBoolTypes(newBoolTypes);
      setReservation(newReservation);
    })();
  }, [reservation.id]);



  const handlePutPost = async e => {
    // reservation.bools = [...bools].reverse().reduce((tot, bool) => {
    //   return 2 * tot + Number(bool[1]);
    // }, 0);
    // Object.keys(reservation.bools).sort().reduce
    // reservation.genderBools = [...genderBools].reverse().reduce((tot, bool) => {
    //   return 2 * tot + Number(bool[1]);
    // }, 0);
    // reservation.positionBools = [...positionBools].reverse().reduce((tot, bool) => {
    //   return 2 * tot + Number(bool[1]);
    // }, 0);
    // reservation.sizeBools = [...sizeBools].reverse().reduce((tot, bool) => {
    //   return 2 * tot + Number(bool[1]);
    // }, 0);
    // let sumLacking = ["gender", "position", "size"].reduce((sum, key) => {
    //   return sum + Number(!reservation[key + "Bools"]);
    // }, 0) - [genderBools, positionBools, sizeBools].filter(arr => !arr.length).length;
    // let newMessage = !sumLacking ? '' :
    //   "You need to select at least one checkbox from " + sumLacking + " of the groups above.";
    // e.preventDefault();
    // if (newMessage) return setMessage(newMessage);
    // const res = await fetch(`/api/reservations${reservation.id ? ('/' + reservation.id) : ''}`, { method: reservation.id ? 'PUT': 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(reservation)
    // });
    // let newReservation = (await res.json()).reservation;
    // newReservation.event.dateTime = moment(newReservation.event.dateTime).local().format().slice(0,-9);
    // if (reservation.id) {
    //   // PUT route
    //   setMessage("Success");
    // } else {
    //   // POST route
    //   history.push('/');
    // }
    // setReservation(newReservation);
    // // Is the following line necessary?
    // setRerender(rerender + 1);
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

  console.log("boolTypes = ", boolTypes);
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
          {Object.entries(boolTypes).map(([boolType, boolArray], index1) => (
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
        </div>

        <span><h4>Extra info about your reservation (optional):</h4></span>

        <textarea
          placeholder="Extra info" name="Extra info" value={reservation['Extra info']}
          onChange={e => setReservation({...reservation, ['Extra info']: e.target.value})}
        />

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
