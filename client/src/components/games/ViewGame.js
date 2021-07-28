import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';

import AuthContext from '../../auth';
import { time } from 'faker';

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
  const columns2 = [
    ['nickName', 'Name'],
    ['photo', ''],
    ['email', 'Email'],
    ['createdAt', `Member since`],
    ['updatedAt', `Reservation date/time`],
    ['skill', 'Skill'],
    ['setter', 'S'],
    ['middle', 'M'],
    ['rightSide', 'R'],
    ['outside', 'O'],
    ['libero', 'L'],
    ['twos', '2'],
    ['fours', '4'],
    ['sixes', '6']
  ];

  // const createMarkup = header => ({__html: `<span>${header}</span>`});
  // const MyComponent = header => <div dangerouslySetInnerHTML={createMarkup(header)} />;

  useEffect(() => {
    (async() => {
        const res = await fetch(`/api/games/${game.id}`);
        let newGame = (await res.json()).game;
        let newPlayers = newGame.players;
        // let newColumns = Object.entries(newPlayers[0]).sort((a, b) => typeof(a[1]) < typeof(b[1]) ? 1 : typeof(a[1]) > typeof(b[1]) ? -1 : 0).map(([key]) => ({dataField: key, text: key, sort: true})).filter(key => key.text !== 'id');
        let newColumns = columns2.map((pair, index) => ({dataField: pair[0], text: pair[1], sort: true,
          headerStyle: {width: `${pair[1].length === 1 ? "5px" : "10px"}`},
          style: (cell, row) => ({color:
            newGame.minSkill && (row.skill === "unknown" || row.skill < newGame.minSkill) ? 'red' :
            newGame.maxSkill && row.skill !== "unknown" && row.skill > newGame.maxSkill ? 'blue' : 'black'
          }),
          sortFunc: (a, b, order, dataField) => {
            let diff = a === 'unknown' ? -1 : b === 'unknown' ? 1 : a < b ? -1 : a > b ? 1 : 0;
            return diff * (order === 'asc' ? 1 : -1);
          },
          // The following pair of lines didn't work, when attempting to make headers diagonal.
          // text: MyComponent(pair[1]),
          // headerClasses: "rotate"
          // The following props did nothing:
          // condensed: true
          // headerStyle: {'white-space': 'nowrap'}
          // headerStyle: {whiteSpace: 'nowrap'}
        }));
        setColumns(newColumns);
        newPlayers = newPlayers.map(player => {
          player = Object.entries(player).reduce((player, prop) => {
            return {...player,
              [prop[0]]: prop[1] === true ? "x" : prop[1] === false ? "" : prop[1] === 0 ? "unknown" : prop[1]};
          }, {});
          player.createdAt = player.createdAt.split('T')[0];
          let updatedAt = player.updatedAt.split('T');
          player.updatedAt = updatedAt[0].slice(5) + ' ' + updatedAt[1].slice(0, -8);
          player.photo = 'photo';
          return player;
        });
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
        <div>date: {game.dateTime.split('T')[0]}</div>
        <div>time: {game.dateTime.split('T')[1]}</div>
        <div>lower limit of skill-level: {game.minSkill || 'none'}</div>
        <div>upper limit of skill-level: {game.maxSkill || 'none'}</div>
        <div>{game.extraInfo ? `extra info: ${game.extraInfo}` : ''}</div>
        <br/>
        <div>Key:</div>
        <ul>
          {game.minSkill || game.maxSkill ? <li>player skill:
            {game.minSkill ? <span style={{color: 'red'}}> insufficient </span> : null}
            {game.minSkill && game.maxSkill ? 'or ' : null}
            {game.maxSkill ? <span style={{color: 'blue'}}> excessive </span> : null}
          </li> : null}
          <li>player flexibility:
              {columns2.filter(pair => (pair[1].length === 1)).map(pair => {
                return (
                    ` "${pair[1]}" (${pair[0]})`
                )
              }).join(', ')}
          </li>
        </ul>
        <BootstrapTable
          keyField='id'
          data={ players }
          columns={ columns }
          // classes="table-header-rotated"
          // rowStyle={rowStyleSkill}
        />
    </main>
  );
}

export default ViewGame;
