import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import Context from '../../context';
import fetch from 'node-fetch';

const EditEvent = ({ match }) => {
  const { fetchWithCSRF, rerender, setRerender } = useContext(Context);
  const properties = [
    'favoriteId',
    'Location',
    'dateTime',
    'Extra info',
    'Minimum skill',
    'Maximum skill'
  ];

  const [favorites, setFavorites] = useState([]);
  const [index, setIndex] = useState(0);
  const [event, setEvent] = useState(properties.reduce((pojo, prop) => {
    return {[prop]: '', Sports: [], ...pojo};
  }, {id: Number(match.params.eventId)}));
  const [wantsToPlay, setWantsToPlay] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  // useEffect(() => {
  //   (async() => {
  //     setFavorites(await (await fetch('/api/favorites')).json()).favorites;
  //   })();
  // }, []);

  useEffect(() => {
    (async() => {
      // Put following line in a separate useEffect (ie, that above)?
      let newFavorites = (await (await fetch('/api/favorites')).json()).favorites;
      setFavorites(newFavorites);
      if (event.id) {
        const res = await fetch(`/api/events/${event.id}`);
        let newEvent = (await res.json()).event;
        setIndex(1 + newFavorites.map(favorite => favorite.id).indexOf(newEvent.favoriteId));
        // React does not like null value, which might be stored in db.
        Object.keys(newEvent).forEach(key => {
          if (newEvent[key] === null) newEvent[key] = '';
        });
        newEvent.dateTime = moment(newEvent.dateTime).local().format().slice(0, -6);
        setEvent(newEvent);
      }
    })();
  }, [event.id]);

  const handlePutPost = async e => {
    e.preventDefault();
    const res = await fetch(`/api/events${event.id ? ('/' + event.id) : ''}`, { method: event.id ? 'PUT': 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    let {id, newMessage} = await res.json();
    // React likes '' but does not like null.
    // Object.entries(newEvent).forEach(([key, value]) => {
    //   if (value === null) newEvent[key] = '';
    // });
    // newEvent.dateTime = moment(newEvent.dateTime).local().format().slice(0, -6);
    setMessage(newMessage || "Success!");
    setEvent({...event, id});
    if (!newMessage) history.push(wantsToPlay ? `/reservations/0-${id}` : '/');
    // setRerender(rerender + 1);
  };

  const handleDelete = async e => {
    e.preventDefault();
    const res = await fetch(`/api/events/${event.id}`, { method: 'DELETE'});
    if (res.ok) {
      let nullEvent = properties.reduce((pojo, prop) => {
        return {[prop]: '', ...pojo};
      }, {wantsToPlay: false});
      [nullEvent.id, nullEvent.favoriteId] = [0, 0];
      setEvent(nullEvent);
      setRerender(rerender + 1);
      history.push('/');
    }
  }

  return (
    <div className="simple">
      <form className="auth" onSubmit={handlePutPost}>
        <h4>
          {event.id ? "Change" : "Choose"} the event details.
        </h4>
        <span>Sport:</span>
        <select
          onChange={e => {
            let newEvent = JSON.parse(JSON.stringify(event));
            let newIndex = Number(e.target.value);
            setIndex(newIndex);
            newEvent.favoriteId = favorites.map(favorite => favorite.id)[newIndex - 1];
            // If sport changes, initialize min/max skills as least restrictive as possible.
            if (newIndex !== 1 + index) {
              newEvent["Minimum skill"] = 0;
              newEvent["Maximum skill"] = favorites[newIndex - 1].Skills.length - 1;
            }
            setEvent(newEvent);
          }}
          value={1 + favorites.map(favorite => favorite.id).indexOf(event.favoriteId)}
        >
          {[null, ...favorites
          // .map(favorite => favorite.Name)
        ].map((favorite, index) => (
              <option
                  key={index && favorite.id}
                  value={index}
              >
                  {favorites[index - 1]?.Name || "Select sport"}
              </option>
          ))}
        </select>
        {!index ? null :
          <>
          {/* DRY up following code by rendering two Skill components, w/some props (one boolean + ???) */}
            <span>Lower limit of skill-level:</span>
            <select
              onChange={e => {
                let newEvent = JSON.parse(JSON.stringify(event));
                newEvent["Minimum skill"] = Number(e.target.value);
                setEvent(newEvent);
              }}
              value={event["Minimum skill"]}
            >
              {favorites[index - 1].Skills.slice(0, event["Maximum skill"] + 1).map((Skill, index) => (
                  <option
                      key={`${index}`}
                      value={index}
                  >
                      {Skill}
                  </option>
              ))}
            </select>

            <span>Upper limit of skill-level:</span>
            <select
              onChange={e => {
                let newEvent = JSON.parse(JSON.stringify(event));
                newEvent["Maximum skill"] = event["Minimum skill"] + Number(e.target.value);
                setEvent(newEvent);
              }}
              value={event["Maximum skill"] - event["Minimum skill"]}
            >
              {favorites[index - 1].Skills.slice(event["Minimum skill"]).map((Skill, index) => (
                  <option
                      key={`${index}`}
                      value={index}
                  >
                      {Skill}
                  </option>
              ))}
            </select>
          </>
        }

        <span>Event location:</span>
        <input
          type="text" placeholder="Location" name="Location" value={event.Location}
          onChange={e => setEvent({...event, Location: e.target.value})}
        />
        <span>Date/time:</span>
        <input
          type="datetime-local"
          value={event.dateTime}
          onChange={e => {
            setEvent({...event, dateTime: e.target.value});
          }}
        />



        <span>Extra info (optional):</span>
        <textarea
          placeholder="Extra Info about event" name="Extra info" value={event['Extra info']}
          onChange={e => setEvent({...event, ['Extra info']: e.target.value})}
        />

        {event.id ? null :
          <>
          <br/>
          <span>Select box if you want to participate in this event.
            <input
              name="wantsToPlay"
              type="checkbox"
              checked={wantsToPlay}
              onChange={e => setWantsToPlay(e.target.checked)}
            />
          </span>
          <br/>
          </>
        }

        <button color="primary" variant="outlined" type="submit">
          {event.id ? "Update " : "Create "}event
        </button>
        <span style={{color: "red", paddingLeft:"10px"}}>{message}</span>
      </form>
      {!event.id ? null :
        <form className="auth" onSubmit={handleDelete}>
          <button color="primary" variant="outlined" type="submit">
            Delete event
          </button>
        </form>
      }
    </div>
  );
}

export default EditEvent;
