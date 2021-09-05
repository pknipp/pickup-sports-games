import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';

import Context from '../../context';
import { time } from 'faker';

const ViewEvent = ({ match }) => {
  const { fetchWithCSRF, rerender, setRerender, genders } = useContext(Context);
  const eventProps = ['Location', 'dateTime', 'Extra info', 'Minimum skill', 'Maximum skill'];
  const userProps = ['Email', 'Nickname', 'Cell',
  // 'photo'
  ];
  const topColumns = [
    'Sport',
    'Location',
    'Date',
    'Time',
    'Lower limit of skill-level',
    'Upper limit of skill-level',
    'Extra info'
  ].map((text, index) => ({dataField: String(index), text}));

  const columns2 = [
    'Nickname',
  //   // ['photo', ''],
    'Email',
    'Cell',
    ['createdAt', 'Member since'],
    ['updatedAt', 'When signed up'],
    ['Extra info', 'Misc info? (hover)'],
    'Skill',
  ];

  const [event, setEvent] = useState(eventProps.reduce((pojo, prop) => {
    return {[prop]: '', ...pojo};
  }, {id: Number(match.params.eventId)}));
  const [players, setPlayers] = useState([]);
  const [boolTypes, setBoolTypes] = useState({genders});
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
        const res = await fetch(`/api/events/${event.id}`);
        let newEvent = (await res.json()).event;
        // Recode following to handle non-sequential sport ids.
        let eventSkills = ['none', ...newEvent.Sports[newEvent.sportId - 1].skills];
        let rowSkills =['???',...newEvent.Sports[newEvent.sportId - 1].skills];
        // setSkills(newSkills);
        let newBoolTypes = {genders, ...newEvent.boolTypes};
        // Recode following line to handle non-sequential sport ids.
        newEvent.Sport = newEvent.Sports[newEvent.sportId - 1].Name;
        // let positionBools = newEvent.positions || [];
        // let sizeBools = newEvent.sizes || [];

        let newPlayers = newEvent.players;
        newPlayers.forEach(player => {
          player.Skill = rowSkills[player.Skill];
          Object.entries(newBoolTypes).forEach(([boolType, bools]) => {
            bools.forEach((bool, i) => {
              const boolVal = player.boolVals[boolType] % 2;
              player[bool] = !!boolVal;
              player.boolVals[boolType] -= boolVal;
              player.boolVals[boolType] /= 2;
            })
          });
        });

        let bools = Object.values(newBoolTypes).reduce((bools, boolArray) => {
          return [...bools, ...boolArray];
        }, []);
        let newColumns = [...columns2, ...bools];

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
              return diff * (order === 'asc' ? 1 : -1);
            },
          }
        });
        console.log("newColumns = ", newColumns);

        if (newEvent.Sports) {
          ["Minimum skill", "Maximum skill"].forEach(key => {
            let sportIndex = newEvent.Sports.map(sport => sport.id).indexOf(newEvent.sportId);
            newEvent[key] = ["none", ...newEvent.Sports[sportIndex].skills][newEvent[key]];
          })
        }

        setColumns(newColumns.map(column => ({...column, style: (cell, row) => {
          // console.log(row.Skill, newSkills.indexOf(row.Skill), newEvent["Minimum skill"], newSkills.indexOf(newEvent["Minimum skill"]));
          return {color:
            newEvent["Minimum skill"] !== "none" && rowSkills.indexOf(row.Skill) < eventSkills.indexOf(newEvent["Minimum skill"]) ? 'red' :
            newEvent["Maximum skill"] !== "none" && rowSkills.indexOf(row.Skill) > eventSkills.indexOf(newEvent["Maximum skill"]) ? 'blue' : 'black'
          };
        }})));

        console.log(newPlayers[0]);
        newPlayers = newPlayers.map(player => {
          player = Object.entries(player).reduce((player, prop) => {
            return {...player,
              [prop[0]]:
                prop[1] === true ? "x" :
                prop[1] === false ? "" :
                prop[1] === 0 ? "none" :
                prop[1] && prop[0] === 'Extra info' ? <span className="ttip" data-toggle="tooltip" title={prop[1]}>y</span> :
                prop[1]};
          }, {});
          player.createdAt = player.createdAt.split('T')[0];
          let updatedAt = player.updatedAt.split('T');
          player.updatedAt = updatedAt[0].slice(5) + ' ' + updatedAt[1].slice(0, -8);
          let Cell = player.Cell;
          player.Cell = `(${Cell.slice(0,3)})${Cell.slice(3,6)}-${Cell.slice(6)}`;
          // bools.forEach((bool, index) => {
          //   player[bool] = player.bools % 2;
          //   player.bools -= player[bool];
          //   player[bool] = player[bool] ? 'x' : '';
          //   player.bools /= 2;
          // })
          // player.photo = 'photo';
          console.log("player = ", player);
          return player;
        });
        setPlayers(newPlayers);
        // React does not like null value, which might be stored in db.
        Object.keys(newEvent).forEach(key => {
          if (newEvent[key] === null) newEvent[key] = '';
        });
        newEvent.dateTime = moment(newEvent.dateTime).local().format().slice(0,-9);
        setEvent(newEvent);
    })();
  }, [event.id]);

  return (
    <div className="simple">
        <h4>Event details:</h4>
        <BootstrapTable
          keyField='id'
          data={[
            {id: 1, ...[
                event.Sport,
                event.Location,
                event.dateTime.split('T')[0],
                event.dateTime.split('T')[1],
                event['Minimum skill'],
                event['Maximum skill'],
                event['Extra info']
              ].reduce((pojo, value, index) => {
                return {...pojo, [String(index)]: value};
              }, {})
            }
          ]}
          columns={topColumns.slice(...(event['Extra info'] ? [0] : [0, -1]))}
        />
        <br/>
        <h4>Event lineup:</h4>
        {event['Minimum skill'] !== "none" || event['Maximum skill'] !== "none" ? <div>Key for color of player:
          {event['Minimum skill'] !== "none" ? <span style={{color: 'red'}}> insufficiently </span> : null}
          {event['Minimum skill'] !== "none" && event['Maximum skill'] !== "none" ? 'or ' : null}
          {event['Maximum skill'] !== "none" ? <span style={{color: 'blue'}}> excessively </span> : null}
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

export default ViewEvent;
