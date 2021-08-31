import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import Context from '../../context';
import fetch from 'node-fetch';

const EditEvent = ({ match }) => {
  const { fetchWithCSRF, rerender, setRerender } = useContext(Context);
  const properties = [
    'sportId',
    'Location',
    'dateTime',
    'Extra info',
    'Minimum skill',
    'Maximum skill'
  ];

  const [sports, setSports] = useState([]);
  const [event, setEvent] = useState(properties.reduce((pojo, prop) => {
    return {[prop]: '', Sports: [], ...pojo};
  }, {id: Number(match.params.eventId)}));
  const [wantsToPlay, setWantsToPlay] = useState(false);
  const [skills, setSkills] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  // useEffect(() => {
  //   (async() => {
  //     let newSports = (await (await fetch('/api/sports')).json()).sports;
  //     console.log("1st ue says that newSports = ", newSports);
  //     setSports(newSports);
  //   })();
  // }, []);

  useEffect(() => {
    (async() => {
      // Put following line in a separate useEffect?
      let newSports = (await (await fetch('/api/sports')).json()).sports;
      setSports(newSports);
      if (event.id) {
        const res = await fetch(`/api/events/${event.id}`);
        let newEvent = (await res.json()).event;
        // React does not like null value, which might be stored in db.
        Object.keys(newEvent).forEach(key => {
          if (newEvent[key] === null) newEvent[key] = '';
        });
        newEvent.dateTime = moment(newEvent.dateTime).local().format().slice(0, -6);
        setEvent(newEvent);
        // Put following in separate useEffect, and allow for non-sequential sportIds?
        setSkills(["none", ...newSports[newEvent.sportId - 1].skills]);
      }
    })();
  }, [event.id]);

  const handlePutPost = async e => {
    e.preventDefault();
    event['Minimum skill'] = isNaN(event['Minimum skill']) ? 0 : Number(event['Minimum skill']);
    event['Maximum skill'] = isNaN(event['Maximum skill']) ? 0 : Number(event['Maximum skill']);
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
    setRerender(rerender + 1);
  };

  const handleDelete = async e => {
    e.preventDefault();
    const res = await fetch(`/api/events/${event.id}`, { method: 'DELETE'});
    if (res.ok) {
      let nullEvent = properties.reduce((pojo, prop) => {
        return {[prop]: '', ...pojo};
      }, {wantsToPlay: false});
      [nullEvent.id, nullEvent.ownerId] = [0, 0];
      setEvent(nullEvent);
      setRerender(rerender + 1);
      history.push('/');
    }
  }

  return (
    <div className="simple">
      <form className="auth" onSubmit={handlePutPost}>
        <h4>
          {event.id ?
            "Change the event details?"
          :
            "Choose the event details."
          }
        </h4>
        <span>Sport:</span>
        <select
          onChange={e => {
            let index = Number(e.target.value);
            let newSportId = index && sports[index - 1].id;
            let isSameSport = Number(event.sportId === newSportId);
            let newEvent = {...event};
            // The follows UNspecifies the max/min skill levels, if the sport is changed.
            ["Minimum skill", "Maximum skill"].forEach(key => newEvent[key] = isSameSport && newEvent[key]);
            // The following prevents state changes until a sport is selected.
            if (index) {
              setEvent({...newEvent, sportId: newSportId});
              setSkills(["unspecified", ...sports[index - 1].skills]);
            }
          }}
          value={1 + sports.map(sport => sport.id).indexOf(event.sportId)}
        >
          {["Select sport", ...sports].map((sport, index) => (
              <option
                  key={`${index && sports[index - 1].id}`}
                  value={index}
              >
                  {index ? sports[index - 1].Name : "Select sport"}
              </option>
          ))}
        </select>

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

        {!event.sportId ? null :
          <>
            <span>Lower limit of skill-level:</span>

            <select
              onChange={e => setEvent({...event, ['Minimum skill']: Number(e.target.value)})}
              value={event['Minimum skill']}
            >
              {skills.map((skill, index) => (
                  <option
                      key={`${index}`}
                      value={index}
                  >
                      {skill}
                  </option>
              ))}
            </select>

            <span>Upper limit of skill-level:</span>

            <select
              onChange={e => setEvent({...event, ['Maximum skill']: !Number(e.target.value) ? 'none' : e.target.value})}
              value={Number(event['Maximum skill'])}
            >
              {skills.map((skill, index) => (
                  <option
                      key={`${index}`}
                      value={index || 'none'}
                  >
                      {skill}
                  </option>
              ))}
            </select>
          </>
        }

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
