import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';

import AuthContext from '../../auth';
import { time } from 'faker';

const ViewGame = ({ match }) => {
  const { fetchWithCSRF, rerender, setRerender } = useContext(AuthContext);
  const gameProps = ['address', 'dateTime', 'extraInfo', 'minSkill', 'maxSkill'];
  const userProps = ['email', 'nickName', 'cell', 'skill',
  // 'photo'
  ];
  const topColumns = [
    'address',
    'date',
    'time',
    'lower limit of skill-level',
    'upper limit of skill-level',
    'extra info'
  ].map((text, index) => ({dataField: String(index), text}));

  const columns2 = [
    ['nickName', 'Name'],
    // ['photo', ''],
    ['email', 'Email'],
    ['createdAt', `Member since`],
    ['updatedAt', `Reservation date/time`],
    ['extraInfo', 'misc info?'],
    ['skill', 'Skill'],
    // ['setter', 'setter'],
    // ['middle', 'middle'],
    // ['rightSide', `right side`],
    // ['outside', 'outside'],
    // ['libero', 'libero'],
    // ['twos', 'twos'],
    // ['fours', 'fours'],
    // ['sixes', 'sixes']
  ];

  const [game, setGame] = useState(gameProps.reduce((pojo, prop) => {
    return {[prop]: '', ...pojo};
  }, {id: Number(match.params.gameId)}));
  const [players, setPlayers] = useState([]);
  const [columns, setColumns] = useState(columns2.map((pair, index) => {
    return {
      dataField: pair[0],
      // Make columns narrower by breaking multiple words, wherever possible.
      text: pair[1].split(' ').join('\n'),
      sort: true,
      headerStyle: {width: `${index > 3 ? "6%" : "10%"}`, whiteSpace: 'pre'},
      sortFunc: (a, b, order, dataField) => {
        let diff = a === 'unknown' ? -1 : b === 'unknown' ? 1 : a < b ? -1 : a > b ? 1 : 0;
        return diff * (order === 'asc' ? 1 : -1);
      },
    }
  }));

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  // const createMarkup = header => ({__html: `<span>${header}</span>`});
  // const MyComponent = header => <div dangerouslySetInnerHTML={createMarkup(header)} />;

  const defaultSorted = [{dataField: 'updatedAt', order: 'asc'}];

  useEffect(() => {
    (async() => {
        const res = await fetch(`/api/games/${game.id}`);
        let newGame = (await res.json()).game;
        let newPlayers = newGame.players;
        // Below sets the only prop of the columns prop which depends upon state.
        setColumns(columns.map(column => ({...column, style: (cell, row) => (
          {color:
              newGame.minSkill && (row.skill === "unknown" || row.skill < newGame.minSkill) ? 'red' :
              newGame.maxSkill && row.skill !== "unknown" && row.skill > newGame.maxSkill ? 'blue' : 'black'
          }
        )})));

        newPlayers = newPlayers.map(player => {
          player = Object.entries(player).reduce((player, prop) => {
            return {...player,
              [prop[0]]:
                prop[1] === true ? "x" :
                prop[1] === false ? "" :
                prop[1] === 0 ? "unknown" :
                prop[1] && prop[0] === 'extraInfo' ? 'y' :
                prop[1]};
          }, {});
          player.createdAt = player.createdAt.split('T')[0];
          let updatedAt = player.updatedAt.split('T');
          player.updatedAt = updatedAt[0].slice(5) + ' ' + updatedAt[1].slice(0, -8);
          // player.photo = 'photo';
          return player;
        });
        setPlayers(newPlayers);
        // React does not like null value, which might be stored in db.
        Object.keys(newGame).forEach(key => {
          if (newGame[key] === null) newGame[key] = '';
        });
        newGame.dateTime = moment(newGame.dateTime).local().format().slice(0,-9);
        setGame(newGame);
    })();
  }, [game.id]);


  return (
    <div className="simple">
        <h4>Game details:</h4>
        <BootstrapTable
          keyField='id'
          data={[
            {id: 1, ...[
                game.address,
                game.dateTime.split('T')[0],
                game.dateTime.split('T')[1],
                game.minSkill || 'none',
                game.maxSkill || 'none',
                game.extraInfo
              ].reduce((pojo, value, index) => {
                return {...pojo, [String(index)]: value};
              }, {})
            }
          ]}
          columns={topColumns.slice(...(game.extraInfo ? [0] : [0, -1]))}
        />
        <br/>
        <h4>Game lineup:</h4>
        {game.minSkill || game.maxSkill ? <div>Key for color of player:
          {game.minSkill ? <span style={{color: 'red'}}> insufficiently </span> : null}
          {game.minSkill && game.maxSkill ? 'or ' : null}
          {game.maxSkill ? <span style={{color: 'blue'}}> excessively </span> : null}
          skilled</div>
        : null}
        <br/>
        <BootstrapTable
          keyField='id'
          data={ players }
          columns={ columns }
          defaultSorted={defaultSorted}
          // rowStyle={rowStyleSkill}
        />
    </div>
  );
}

export default ViewGame;
