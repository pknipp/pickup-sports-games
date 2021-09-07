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
  const [sportIds, setSportIds] = useState([]);
  const [sportIndex, setSportIndex] = useState(0);
  const [event, setEvent] = useState(properties.reduce((pojo, prop) => {
    return {[prop]: '', Sports: [], ...pojo};
  }, {id: Number(match.params.eventId)}));
  const [wantsToPlay, setWantsToPlay] = useState(false);
  const [skills, setSkills] = useState([]);
  const [minSkill, setMinSkill] = useState(0);
  const [maxSkill, setMaxSkill] = useState(0);
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
      let newSports = (await (await fetch('/api/favorites')).json()).sports;
      setSports(newSports);
      let newSportIds = newSports.map(sport => sport.id);
      setSportIds(newSportIds);
      if (event.id) {
        const res = await fetch(`/api/events/${event.id}`);
        let newEvent = (await res.json()).event;
        let newSportIndex = 1 + newSportIds.indexOf(newEvent.sportId);
        setSportIndex(newSportIndex);
        // React does not like null value, which might be stored in db.
        Object.keys(newEvent).forEach(key => {
          if (newEvent[key] === null) newEvent[key] = '';
        });
        newEvent.dateTime = moment(newEvent.dateTime).local().format().slice(0, -6);
        setEvent(newEvent);
        let newSkills = newSports[newSportIndex - 1].skills;
        setSkills(newSkills);
        setMinSkill(newEvent["Minimum skill"]);
        setMaxSkill(newEvent["Maximum skill"]);
      }
    })();
  }, [event.id, event.sportId]);

  const handlePutPost = async e => {
    e.preventDefault();
    [event["Minimum skill"], event["Maximum skill"]] = [minSkill, maxSkill];
    event.sportId = sportIds[sportIndex - 1];
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
      [nullEvent.id, nullEvent.userId] = [0, 0];
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
            {/* "Change the event details?"
          :
            "Choose the event details."
          } */}
        </h4>
        <span>Sport:</span>
        <select
          onChange={e => {
            let index = Number(e.target.value);
            // The following prevents state changes until a sport is selected.
            if (index) {
              setSportIndex(index);
              // If sport changes, initialize min/max skills as least restrictive as possible.
              if (index !== sportIndex) {
                let newSkills = [...sports[index - 1].skills];
                setSkills(newSkills);
                setMinSkill(0);
                setMaxSkill(newSkills.length - 1);
              }
            }
          }}
          value={sportIndex}
        >
          {["Select sport", ...sports].map((sport, index) => (
              <option
                  key={index && sport.id}
                  value={index}
              >
                  {sports[index - 1]?.Name || "Select sport"}
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

        {!sportIndex ? null :
          <>
          {/* DRY up following code by implementing a Skill component, w/some props (one boolean + ???) */}
            <span>Lower limit of skill-level:</span>
            <select
              onChange={e => setMinSkill(Number(e.target.value))}
              value={minSkill}
            >
              {skills.slice(0, maxSkill + 1).map((skill, index) => (
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
              onChange={e => setMaxSkill(Number(e.target.value))}
              value={maxSkill}
            >
              {skills.slice(minSkill).map((skill, index) => (
                  <option
                      key={`${index}`}
                      value={index + minSkill}
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
