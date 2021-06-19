import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import AuthContext from '../../auth';

const EditGame = ({ match }) => {
  const { fetchWithCSRF, currentUser, rerender, setRerender } = useContext(AuthContext);
  const properties = [
    'address',
    'extraInfo',
    'minSkill',
    'maxSkill'
  ];

  // const [gameId, setGameId] = useState(Number(match.params.gameId));
  const [game, setGame] = useState(properties.reduce((pojo, prop) => {
    return {[prop]: '', ...pojo};
  }, {id: Number(match.params.gameId)}));
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      if (game.id) {
        const res = await fetch(`/api/games/${game.id}`);
        let fetchedGame = (await res.json()).game;
        Object.keys(fetchedGame).forEach(key => {
          if (fetchedGame[key] === null) fetchedGame[key] = '';
        })
        setGame(fetchedGame);
      }
    })();
  }, [game.id]);

  const deleteGame = async () => {
    const res = await fetch(`/api/games/${game.id}`, { method: 'DELETE'});
    if (res.ok) {
      let nullGame = properties.reduce((pojo, prop) => {
        return {[prop]: '', ...pojo};
      }, {});
      [nullGame.id, nullGame.ownerId] = [0, 0];
      setGame(nullGame);
      setRerender(rerender + 1);
      history.push('/');
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("top of handleSubmit says that game = ", game);
    const res = await fetch(`/api/games${game.id ? ('/' + game.id) : ''}`, { method: game.id ? 'PUT': 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game)
    });
    let data = await res.json();
    console.log("data = ", data);
    let fetchedGame = data.game;
    // let fetchedGame = (await res.json()).game;
    if (game.id) {
      setMessage("Success");
    } else {
      history.push('/');
    }
    setGame(fetchedGame);
    setRerender(rerender + 1);
  };

  const handleDelete = e => {
    e.preventDefault();
    deleteGame();
  }

  let newGame = {...game};
  return (
    <main className="centered middled">
      <form className="auth" onSubmit={handleSubmit}>
        <h4>
          {game.id ?
            "Change the Game details?"
          :
            "Choose the Game details."
          }
        </h4>
        <span>Game address:</span>
        <input
          type="text" placeholder="address" name="address" value={game.address}
          onChange={e => setGame({...newGame, address: e.target.value})}
        />
        <span>Extra info (optional):</span>
        <input
          type="text" placeholder="extraInfo" name="extraInfo" value={game.extraInfo}
          onChange={e => setGame({...newGame, extraInfo: e.target.value})}
        />
        {/* <span>Date and time:</span>
        <input
          type="text" placeholder="dateTime" name="dateTime" value={game.dateTime}
          onChange={e => setGame({...newGame, dateTime: e.target.value})}
        /> */}
        <span>Minimum skill-level allowed:</span>
        <input
          type="number" placeholder="minSkill" name="minSkill" value={game.minSkill}
          onChange={e => setGame({...newGame, minSkill: Number(e.target.value)})}
        />
        <span>Maximum skill-level allowed:</span>
        <input
          type="number" placeholder="maxSkill" name="maxSkill" value={game.maxSkill}
          onChange={e => setGame({...newGame, maxSkill: Number(e.target.value)})}
        />

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
