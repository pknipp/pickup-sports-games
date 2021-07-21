import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';

import AuthContext from '../../auth';

const ViewGame = ({ match }) => {
  const { fetchWithCSRF, rerender, setRerender } = useContext(AuthContext);
  const gameProps = ['address', 'dateTime', 'extraInfo', 'minSkill', 'maxSkill'];
  const userProps = ['email', 'nickName', 'cell', 'skill','photo'];

  const [game, setGame] = useState(gameProps.reduce((pojo, prop) => {
    return {[prop]: '', ...pojo};
  }, {id: Number(match.params.gameId)}));
  const [players, setPlayers] = useState([]);
  const [columns, setColumns] = useState([{}]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  useEffect(() => {
    (async() => {
        const res = await fetch(`/api/games/${game.id}`);
        let newGame = (await res.json()).game;
        let newPlayers = newGame.players;
        let newColumns = Object.entries(newPlayers[0]).sort((a, b) => typeof(a[1]) < typeof(b[1]) ? 1 : typeof(a[1]) > typeof(b[1]) ? -1 : 0).map(([key]) => ({dataField: key, text: key, sort: true})).filter(key => key.text !== 'id');
        setColumns(newColumns);
        newPlayers = newPlayers.map(player => {
          return Object.entries(player).reduce((player, prop) => {
            return {...player, [prop[0]]: prop[1] === true ? "x" : prop[1] === false ? "" : prop[1]};
          })
        })
        setPlayers(newPlayers);
        // React does not like null value, which might be stored in db.
        Object.keys(newGame).forEach(key => {
          if (newGame[key] === null) newGame[key] = '';
        });
        newGame.dateTime = moment(newGame.dateTime).local().format().slice(0,-6);
        setGame(newGame);
    })();
  }, [game.id]);

  return (
    <main className="centered middled">
        <h4>Game details</h4>
        <div>address: {game.address}</div>
        <div>Date/time: {game.dateTime}</div>
        <div>Minimum skill-level allowed: {game.minSkill}</div>
        <div>Maximum skill-level allowed: {game.maxSkill}</div>
        <div>Extra info: {game.extraInfo || "nothing"} </div>
        <BootstrapTable keyField='id' data={ players } columns={ columns } />
    </main>
  );
}

export default ViewGame;
