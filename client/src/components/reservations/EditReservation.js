import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import Context from '../../context';

const EditReservation = ({ match }) => {
  const resEventId = match.params.resEventId;
  const [reservationId, eventId] = resEventId.split('-').map(id => Number(id));
  const { fetchWithCSRF, currentUser, rerender, setRerender, genders } = useContext(Context);
  // const [positionBools, setPositionBools] = useState([]);
  // const [sizeBools, setSizeBools] = useState([]);
  const [boolTypes, setBoolTypes] = useState({genders});
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
      const res = await fetch(`/api/reservations/${resEventId}`);
      const data = await res.json();
      console.log("data = ", data);
      let newReservation = {...reservation, ...data.reservation};
      Object.keys(newReservation).forEach(key => {
        if (newReservation[key] === null) newReservation[key] = key === 'Extra info' ? '' : false;
      })
      newReservation.event.dateTime = moment(newReservation.event.dateTime).local().format().slice(0,-9);
      console.log("newReservation = ", newReservation);

      setReservation(newReservation);
      // Do I need the || ... in the two places, below?
      const newBoolTypes = {...boolTypes, ...newReservation.event.bools};
      console.log(newBoolTypes);
      let newBools = [...bools];
      // Least significant end of array is genderBools; most significant is sizeBools.
      // Object.keys(newBoolTypes).sort().forEach(boolType => {
      //   newBoolTypes[boolType].forEach(bool => {
      //     const boolVal = newReservation.bools[boolType] % 2;
      //     newBools.push([bool, !! boolVal]);
      //     newReservation.bools[boolType] -= boolVal;
      //     newReservation.bools[boolType] /= 2;
      //   })
      // });
      setBools(newBools);


      // for (let i = 0; i < newBools.length; i++) {
      //   const genderBoolVal = newReservation.genderBools % 2;
      //   // First element is the column heading, second element is the boolean itself.
      //   newGenderBools[i] = [newGenderBools[i], !!genderBoolVal];
      //   newReservation.genderBools -= genderBoolVal;
      //   newReservation.genderBools /= 2;
      // }
      // setGenderBools(newGenderBools);

      // Do we need the || in either of the following lines?
      // let newPositionBools = newReservation.event.positions || [];
      // for (let i = 0; i < newPositionBools.length; i++) {
      //   const positionBoolVal = newReservation.positionBools % 2;
      //   // First element is the column heading, second element is the boolean itself.
      //   newPositionBools[i] = [newPositionBools[i], !!positionBoolVal];
      //   newReservation.positionBools -= positionBoolVal;
      //   newReservation.positionBools /= 2;
      // }
      // setPositionBools(newPositionBools);

      // let newSizeBools = newReservation.event.sizes || [];
      // for (let i = 0; i < newSizeBools.length; i++) {
      //   const sizeBoolVal = newReservation.sizeBools % 2;
      //   // First element is the column heading, second element is the boolean itself.
      //   newSizeBools[i] = [newSizeBools[i], !!sizeBoolVal];
      //   newReservation.sizeBools -= sizeBoolVal;
      //   newReservation.sizeBools /= 2;
      // }
      // setSizeBools(newSizeBools);

      // for (let i = 0; i < newBools.length; i++) {
      //   const boolVal = newReservation.bools % 2;
      //   // First element is the column heading, second element is the boolean itself.
      //   newBools[i] = [newBools[i], !!boolVal];
      //   newReservation.bools -= boolVal;
      //   newReservation.bools /= 2;
      // }
      // setBools(newBools);
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

  return (
    <div className="simple">
      <form className="auth" onSubmit={handlePutPost}>
        <h3>
          {reservation.id ? "Change" : "Choose"} your reservation details for {reservation.event && reservation.event.Sport && reservation.event.Sport.toLowerCase()} at {reservation.event && reservation.event.Location} on &nbsp;
          {reservation.event && reservation.event.dateTime.split('T')[0]} at &nbsp;
          {reservation.event && reservation.event.dateTime.split('T')[1]}.
        </h3>
        <span><h4>{reservationId ? "Below are" : "Specify below"} your willingnesses for ...</h4></span>
        <span><h4>... gender (trans - inclusive):</h4></span>
        <div>
        {/* {genderBools.map((bool, index) => (
          <div key={index} className="checkboxPair">
            <div><span>{bool[0]}:</span></div>
            <div><input
              name={bool[0]}
              type="checkbox"
              checked={bool[1]}
              onChange={e => {
                const newGenderBools = [...genderBools];
                newGenderBools[index][1] = e.target.checked;
                setGenderBools(newGenderBools);
              }}
            /></div>
          </div>
        ))} */}
        </div>

        {/* {!positionBools.length ? null :
        <>
        <span><h4>... event positions:</h4></span>
        <div>
        {positionBools.map((bool, index) => (
          <div key={index} className="checkboxPair">
            <div><span>{bool[0]}:</span></div>
            <div><input
              name={bool[0]}
              type="checkbox"
              checked={bool[1]}
              onChange={e => {
                const newPositionBools = [...positionBools];
                newPositionBools[index][1] = e.target.checked;
                setPositionBools(newPositionBools);
              }}
            /></div>
          </div>
        ))}
        </div>
        </>} */}

        {/* {!sizeBools.length ? null :
        <>
        <span><h4>... team sizes:</h4></span>
        <div>
        {sizeBools.map((bool, index) => (
          <div key={index} className="checkboxPair">
            <div><span>{bool[0]}:</span></div>
            <div><input
              name={bool[0]}
              type="checkbox"
              checked={bool[1]}
              onChange={e => {
                const newSizeBools = [...sizeBools];
                newSizeBools[index][1] = e.target.checked;
                setSizeBools(newSizeBools);
              }}
            /></div>
          </div>
        ))}
        </div>
        </>} */}

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
