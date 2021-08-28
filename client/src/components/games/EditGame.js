import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import Context from '../../context';
import fetch from 'node-fetch';

const EditGame = ({ match }) => {
  const { fetchWithCSRF, rerender, setRerender } = useContext(Context);
  // const skills = ['unspecified', '1','2','3','4','5','6','7','8','9'];
  const properties = [
    'gameTypeId',
    'Location',
    'dateTime',
    'Extra info',
    'Minimum skill',
    'Maximum skill'
  ];

  const [gameTypes, setGameTypes] = useState([]);
  const [game, setGame] = useState(properties.reduce((pojo, prop) => {
    return {[prop]: '', Sports: [], ...pojo};
  }, {id: Number(match.params.gameId)}));
  const [wantsToPlay, setWantsToPlay] = useState(false);
  const [skills, setSkills] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  // useEffect(() => {
  //   (async() => {
  //     let newGameTypes = (await (await fetch('/api/gameTypes')).json()).gameTypes;
  //     console.log("1st ue says that newGameTypes = ", newGameTypes);
  //     setGameTypes(newGameTypes);
  //   })();
  // }, []);

  useEffect(() => {
    (async() => {
      let newGameTypes = (await (await fetch('/api/gameTypes')).json()).gameTypes;
      setGameTypes(newGameTypes);
      if (game.id) {
        const res = await fetch(`/api/games/${game.id}`);
        let newGame = (await res.json()).game;
        // React does not like null value, which might be stored in db.
        Object.keys(newGame).forEach(key => {
          if (newGame[key] === null) newGame[key] = '';
        });
        newGame.dateTime = moment(newGame.dateTime).local().format().slice(0, -6);
        setGame(newGame);
        setSkills(["unspecified", ...newGameTypes[newGame.gameTypeId].skills]);
      }
    })();
  }, [game.id]);

  const handlePutPost = async e => {
    e.preventDefault();
    game['Minimum skill'] = isNaN(game['Minimum skill']) ? 0 : Number(game['Minimum skill']);
    game['Maximum skill'] = isNaN(game['Maximum skill']) ? 0 : Number(game['Maximum skill']);
    const res = await fetch(`/api/games${game.id ? ('/' + game.id) : ''}`, { method: game.id ? 'PUT': 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game)
    });
    let {id, newMessage} = await res.json();
    // React likes '' but does not like null.
    // Object.entries(newGame).forEach(([key, value]) => {
    //   if (value === null) newGame[key] = '';
    // });
    // newGame.dateTime = moment(newGame.dateTime).local().format().slice(0, -6);
    setMessage(newMessage || "Success!");
    setGame({...game, id});
    if (!newMessage) history.push(wantsToPlay ? `/reservations/0-${id}` : '/');
    setRerender(rerender + 1);
  };

  const handleDelete = async e => {
    e.preventDefault();
    const res = await fetch(`/api/games/${game.id}`, { method: 'DELETE'});
    if (res.ok) {
      let nullGame = properties.reduce((pojo, prop) => {
        return {[prop]: '', ...pojo};
      }, {wantsToPlay: false});
      [nullGame.id, nullGame.ownerId] = [0, 0];
      setGame(nullGame);
      setRerender(rerender + 1);
      history.push('/');
    }
  }

  return (
    <div className="simple">
      <form className="auth" onSubmit={handlePutPost}>
        <h4>
          {game.id ?
            "Change the Game details?"
          :
            "Choose the Game details."
          }
        </h4>
        <span>Sport:</span>
        <select
          onChange={e => {
            let index = Number(e.target.value);
            let newGameTypeId = index && gameTypes[index - 1].id;
            let sameGameType = Number(game.gameTypeId === newGameTypeId);
            let newGame = {...game};
            ["Minimum skill", "Maximum skill"].forEach(key => newGame[key] = sameGameType && newGame[key]);
            if (index) {
              setGame({...newGame, gameTypeId: newGameTypeId});
              setSkills(["unspecified", ...gameTypes[newGameTypeId - 1].skills]);
            }
          }}
          value={1 + gameTypes.map(gameType => gameType.id).indexOf(game.gameTypeId)}
        >
          {gameTypes.map((gameType, index) => (
              <option
                  key={`${index && gameTypes[index - 1].id}`}
                  value={index}
              >
                  {index ? gameTypes[index - 1].Sport : "Select sport"}
              </option>
          ))}
        </select>

        <span>Game location:</span>
        <input
          type="text" placeholder="Location" name="Location" value={game.Location}
          onChange={e => setGame({...game, Location: e.target.value})}
        />
        <span>Date/time:</span>
        <input
          type="datetime-local"
          value={game.dateTime}
          onChange={e => setGame({...game, dateTime: e.target.value})}
        />

        <span>Lower limit of skill-level:</span>

        <select
          onChange={e => setGame({...game, ['Minimum skill']: !Number(e.target.value) ? 'none' : e.target.value})}
          value={game['Minimum skill']}
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

        <span>Upper limit of skill-level:</span>

        {/* <input
          type="number" placeholder="maxSkill" name="maxSkill" value={game.maxSkill}
          onChange={e => setGame({...game, maxSkill: Number(e.target.value)})}
        /> */}

        <select
          onChange={e => setGame({...game, ['Maximum skill']: !Number(e.target.value) ? 'none' : e.target.value})}
          value={Number(game['Maximum skill'])}
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

        <span>Extra info (optional):</span>
        <input
          type="text" placeholder="Extra Info about event" name="Extra info" value={game['Extra info']}
          onChange={e => setGame({...game, ['Extra info']: e.target.value})}
        />

        {game.id ? null :
          <>
          <br/>
          <span>You want to play in this game.
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
          {game.id ? "Update game" : "Create game"}
        </button>
        <span style={{color: "red", paddingLeft:"10px"}}>{message}</span>
      </form>
      {!game.id ? null :
        <form className="auth" onSubmit={handleDelete}>
          <button color="primary" variant="outlined" type="submit">
            Delete game
          </button>
        </form>
      }
    </div>
  );
}

export default EditGame;
