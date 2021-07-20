import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import AuthContext from '../../auth';

const ViewGame = ({ match }) => {
  const { fetchWithCSRF, rerender, setRerender } = useContext(AuthContext);
  const gameProps = ['address', 'dateTime', 'extraInfo', 'minSkill', 'maxSkill'];
  const userProps = ['email', 'nickName', 'cell', 'skill','photo'];

  const [game, setGame] = useState(gameProps.reduce((pojo, prop) => {
    return {[prop]: '', ...pojo};
  }, {id: Number(match.params.gameId)}));
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  useEffect(() => {
    (async() => {
        const res = await fetch(`/api/games/${game.id}`);
        let data = await res.json();
        console.log("data = ", data);
        let newGame = data.game;
        console.log("newGame = ", newGame);
        let newPlayers = newGame.players;
        console.log("newPlayers = ", newPlayers);
        setPlayers(newPlayers);
        // React does not like null value, which might be stored in db.
        Object.keys(newGame).forEach(key => {
          if (newGame[key] === null) newGame[key] = '';
        });
        newGame.dateTime = moment(newGame.dateTime).local().format().slice(0,-6);
        setGame(newGame)
    })();
  }, [game.id]);

  const handleDelete = async e => {
    const res = await fetch(`/api/games/${game.id}`, { method: 'DELETE'});
    if (res.ok) {
      let nullGame = gameProps.reduce((pojo, prop) => {
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
        <h4>Game details</h4>
        <div>address: {game.address}</div>
        <div>Date/time: {game.dateTime}</div>
        <div>Minimum skill-level allowed: {game.minSkill}</div>
        <div>Maximum skill-level allowed: {game.maxSkill}</div>
        <div>Extra info: {game.extraInfo || "nothing"} </div>
    </main>
  );
}

export default ViewGame;
