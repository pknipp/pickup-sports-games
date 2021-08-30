import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';

import Context from '../../context';
import { time } from 'faker';

const ViewGame = ({ match }) => {
  const { fetchWithCSRF, rerender, setRerender,
    genderBools
  } = useContext(Context);
  const gameProps = ['Location', 'dateTime', 'Extra info', 'Minimum skill', 'Maximum skill'];
  const userProps = ['Email', 'Nickname', 'Cell',
  // 'photo'
  ];
  const topColumns = [
    'Sport',
    'Location',
    'date',
    'time',
    'lower limit of skill-level',
    'upper limit of skill-level',
    'Extra info'
  ].map((text, index) => ({dataField: String(index), text}));

  const columns2 = [
    'Nickname',
  //   // ['photo', ''],
    'Email',
    'Cell',
    ['createdAt', 'Member since'],
    ['updatedAt', 'Reservation date/time'],
    ['Extra info', 'Misc info?'],
    'Skill',
  ];

  const [game, setGame] = useState(gameProps.reduce((pojo, prop) => {
    return {[prop]: '', ...pojo};
  }, {id: Number(match.params.gameId)}));
  const [players, setPlayers] = useState([]);
  const [bools, setBools] = useState([[]]);

  const [columns, setColumns] = useState(columns2.map((column, index) => {
    return {
      dataField: typeof(column) === 'string' ? column : column[0],
      // Make columns narrower by breaking multiple words, wherever possible.
      text: (typeof(column) === 'string' ? column : column[1]).split(' ').join('\n'),
      sort: true,
      headerStyle: {width: `${index > 3 ? "6%" : "10%"}`, whiteSpace: 'pre'},
      sortFunc: (a, b, order, dataField) => {
        let diff = a === 'none' ? -1 : b === 'none' ? 1 : a < b ? -1 : a > b ? 1 : 0;
        return diff * (order === 'asc' ? 1 : -1);
      },
    }
  }));

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  // const [skills, setSkills] = useState([]);

  let history = useHistory();

  // const createMarkup = header => ({__html: `<span>${header}</span>`});
  // const MyComponent = header => <div dangerouslySetInnerHTML={createMarkup(header)} />;

  const defaultSorted = [{dataField: 'updatedAt', order: 'asc'}];

  useEffect(() => {
    (async() => {
        const res = await fetch(`/api/games/${game.id}`);
        let newGame = (await res.json()).game;
        // Recode following to handle non-sequential gameType ids.
        let gameSkills = ['none', ...newGame.Sports[newGame.gameTypeId - 1].skills];
        let rowSkills =['unknown',...newGame.Sports[newGame.gameTypeId - 1].skills];
        // setSkills(newSkills);
        // Recode following line to handle non-sequential gameType ids.
        newGame.Sport = newGame.Sports[newGame.gameTypeId - 1].Sport;
        let positionBools = newGame.positions || [];
        let sizeBools = newGame.sizes || [];

        let bools = [
          ...genderBools,
          ...positionBools, ...sizeBools];
        let newColumns = [...columns2, ...bools];
        let newPlayers = newGame.players;
        newPlayers.forEach(player => {
          player.Skill = rowSkills[player.Skill];
          // Combine 3 boolean-encoded integers into a single one.
          player.bools = (player.sizeBools * 2 ** positionBools.length + player.positionBools) * 2 ** genderBools.length + player.genderBools;
        });
        // Below sets the only prop of the columns prop which depends upon state.

        newColumns = newColumns.map((column, index) => {
          return {
            dataField: typeof(column) === 'string' ? column : column[0],
            // Make columns narrower by breaking multiple words, wherever possible.
            text: (typeof(column) === 'string' ? column : column[1]).split(' ').join('\n'),
            sort: true,
            headerStyle: {width: `${index > 3 ? "6%" : "10%"}`, whiteSpace: 'pre'},
            sortFunc: (a, b, order, dataField) => {
              let diff;
              if (rowSkills.includes(a)) {
                diff = a === b ? 0 : rowSkills.indexOf(a) < rowSkills.indexOf(b) ? -1 : 1;
              } else {
                diff = a === b ? 0 : a < b ? -1 : 1;
              }
              // let diff = a === 'unknown' ? -1 : b === 'unknown' ? 1 : a < b ? -1 : a > b ? 1 : 0;
              return diff * (order === 'asc' ? 1 : -1);
            },
          }
        });

        if (newGame.Sports) {
          ["Minimum skill", "Maximum skill"].forEach(key => {
            let gameTypeIndex = newGame.Sports.map(sport => sport.id).indexOf(newGame.gameTypeId);
            newGame[key] = ["none", ...newGame.Sports[gameTypeIndex].skills][newGame[key]];
          })
        }

        setColumns(newColumns.map(column => ({...column, style: (cell, row) => {
          // console.log(row.Skill, newSkills.indexOf(row.Skill), newGame["Minimum skill"], newSkills.indexOf(newGame["Minimum skill"]));
          return {color:
            newGame["Minimum skill"] !== "none" && rowSkills.indexOf(row.Skill) < gameSkills.indexOf(newGame["Minimum skill"]) ? 'red' :
            newGame["Maximum skill"] !== "none" && rowSkills.indexOf(row.Skill) > gameSkills.indexOf(newGame["Maximum skill"]) ? 'blue' : 'black'
          };
        }})));

        newPlayers = newPlayers.map(player => {
          player = Object.entries(player).reduce((player, prop) => {
            return {...player,
              [prop[0]]:
                prop[1] === true ? "x" :
                prop[1] === false ? "" :
                prop[1] === 0 ? "none" :
                prop[1] && prop[0] === 'Extra info' ? 'y' :
                prop[1]};
          }, {});
          player.createdAt = player.createdAt.split('T')[0];
          let updatedAt = player.updatedAt.split('T');
          player.updatedAt = updatedAt[0].slice(5) + ' ' + updatedAt[1].slice(0, -8);
          bools.forEach((bool, index) => {
            player[bool] = player.bools % 2;
            player.bools -= player[bool];
            player[bool] = player[bool] ? 'x' : '';
            player.bools /= 2;
          })
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
                game.Sport,
                game.Location,
                game.dateTime.split('T')[0],
                game.dateTime.split('T')[1],
                game['Minimum skill'],
                game['Maximum skill'],
                game['Extra info']
              ].reduce((pojo, value, index) => {
                return {...pojo, [String(index)]: value};
              }, {})
            }
          ]}
          columns={topColumns.slice(...(game['Extra info'] ? [0] : [0, -1]))}
        />
        <br/>
        <h4>Game lineup:</h4>
        {game['Minimum skill'] !== "none" || game['Maximum skill'] !== "none" ? <div>Key for color of player:
          {game['Minimum skill'] !== "none" ? <span style={{color: 'red'}}> insufficiently </span> : null}
          {game['Minimum skill'] !== "none" && game['Maximum skill'] !== "none" ? 'or ' : null}
          {game['Maximum skill'] !== "none" ? <span style={{color: 'blue'}}> excessively </span> : null}
          skilled</div>
        : null}
        <br/>
        {!columns || !columns.length ? <span>NO COLUMNS</span> : <BootstrapTable
          keyField='id'
          data={ players }
          columns={ columns }
          defaultSorted={defaultSorted}
          // rowStyle={rowStyleSkill}
        />}
    </div>
  );
}

export default ViewGame;
