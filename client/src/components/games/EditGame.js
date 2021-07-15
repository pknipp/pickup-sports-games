import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import AuthContext from '../../auth';

const EditGame = ({ match }) => {
  const { fetchWithCSRF, rerender, setRerender } = useContext(AuthContext);
  const properties = [
    'address',
    'dateTime',
    'extraInfo',
    'minSkill',
    'maxSkill'
  ];

  const [game, setGame] = useState(properties.reduce((pojo, prop) => {
    return {[prop]: '', ...pojo};
  }, {id: Number(match.params.gameId)}));
  const [wantsToPlay, setWantsToPlay] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      if (game.id) {
        const res = await fetch(`/api/games/${game.id}`);
        let newGame = (await res.json()).game;
        // React does not like null value, which might be stored in db.
        Object.keys(newGame).forEach(key => {
          if (newGame[key] === null) newGame[key] = '';
        });
        newGame.dateTime = moment(newGame.dateTime).local().format().slice(0,-6);
        setGame(newGame)
      }
    })();
  }, [game.id]);

  const handlePutPost = async e => {
    e.preventDefault();
    const res = await fetch(`/api/games${game.id ? ('/' + game.id) : ''}`, { method: game.id ? 'PUT': 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game)
    });
    let newGame = (await res.json()).game;
    // React likes '' but does not like null.
    Object.entries(newGame).forEach(([key, value]) => {
      if (value === null) newGame[key] = '';
    });
    newGame.dateTime = moment(newGame.dateTime).local().format().slice(0,-6);
    setMessage(newGame.message || "Success!");
    if (game.id) {
      // PUT route
      setGame(newGame);
    } else {
      // POST route
      if (!newGame.message) history.push(wantsToPlay ? `/reservations/0-${newGame.id}` : '/');
    }
    setRerender(rerender + 1);
  };

  const handleDelete = async e => {
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
    <main className="centered middled">
      <form className="auth" onSubmit={handlePutPost}>
        <h4>
          {game.id ?
            "Change the Game details?"
          :
            "Choose the Game details."
          }
        </h4>
        <span>Game address:</span>
        <input
          type="text" placeholder="Address" name="address" value={game.address}
          onChange={e => setGame({...game, address: e.target.value})}
        />
        <span>Date/time:</span>
        <input
          type="datetime-local"
          value={game.dateTime}
          onChange={e => setGame({...game, dateTime: e.target.value})}
        />
        <span>Minimum skill-level allowed:</span>
        <input
          type="number" placeholder="minSkill" name="minSkill" value={game.minSkill}
          onChange={e => setGame({...game, minSkill: Number(e.target.value)})}
        />
        <span>Maximum skill-level allowed:</span>
        <input
          type="number" placeholder="maxSkill" name="maxSkill" value={game.maxSkill}
          onChange={e => setGame({...game, maxSkill: Number(e.target.value)})}
        />
        <span>Extra info (optional):</span>
        <input
          type="text" placeholder="Extra Info about event" name="extraInfo" value={game.extraInfo}
          onChange={e => setGame({...game, extraInfo: e.target.value})}
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
    </main>
  );
}

export default EditGame;
