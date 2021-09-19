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
    ['Extra info', 'Misc info?'],
    'Skill',
  ];

  const [event, setEvent] = useState(eventProps.reduce((pojo, prop) => {
    return {[prop]: '', ...pojo};
  }, {id: Number(match.params.eventId)}));
  const [players, setPlayers] = useState([]);
  const [boolTypes, setBoolTypes] = useState({genders});
  const [bools, setBools] = useState([[]]);
  const [Skills, setSkills] = useState([]);

  const [columns, setColumns] = useState(columns2.map((column, index) => {
    return {
      dataField: typeof(column) === 'string' ? column : column[0],
      // Make columns narrower by breaking multiple words, wherever possible.
      text: (typeof(column) === 'string' ? column : column[1]).split(' ').join('\n'),
      sort: true,
      headerStyle: {width: `${index > 3 ? "6%" : "10%"}`, whiteSpace: 'pre'},
      sortFunc: (a, b, order, dataField) => {
        return (a < b ? -1 : a > b ? 1 : 0) * (order === 'asc' ? 1 : -1);
      },
    }
  }));

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);

  let history = useHistory();

  // const createMarkup = header => ({__html: `<span>${header}</span>`});
  // const MyComponent = header => <div dangerouslySetInnerHTML={createMarkup(header)} />;

  const defaultSorted = [{dataField: 'Nickname', order: 'asc'}];

  useEffect(() => {
    (async() => {
        const res = await fetch(`/api/events/${event.id}`);
        let newEvent = (await res.json()).event;
        let newSkills = [...newEvent.Skills];
        setSkills(newSkills);
        let newBoolTypes = {genders: genders.slice(0, newEvent.sport.nGenders), ...newEvent.boolTypes};
        newEvent.Sport = newEvent.sport.Name;
        let newPlayers = newEvent.players;
        newPlayers.forEach(player => {
          player.Skill = newSkills[player.Skill];
          player.Email = player.Email.split("@").join("@ ");
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
            headerStyle: {width: `${index > 3 ? "9%" : "10%"}`, whiteSpace: 'pre'},
            sortFunc: (a, b, order, dataField) => {
              let diff;
              if (newSkills.includes(a)) {
                diff = a === b ? 0 : newSkills.indexOf(a) < newSkills.indexOf(b) ? -1 : 1;
              } else {
                diff = a === b ? 0 : a < b ? -1 : 1;
              }
              return diff * (order === 'asc' ? 1 : -1);
            },
          }
        });

        if (newEvent.Sports) {
          let sportIndex = newEvent.Sports.map(sport => sport.id).indexOf(newEvent.sportId);
          ["Minimum skill", "Maximum skill"].forEach(key => {
            newEvent[key] = newSkills[newEvent[key]];
          })
        }

        setColumns(newColumns.map(column => ({...column, style: (cell, row) => {
          return {color:
            newSkills.indexOf(row.Skill) < newSkills.indexOf(newEvent["Minimum skill"]) ? 'red' :
            newSkills.indexOf(row.Skill) > newSkills.indexOf(newEvent["Maximum skill"]) ? 'blue' : 'black'
          };
        }})));

        newPlayers = newPlayers.map(player => {
          player = Object.entries(player).reduce((player, [key, value]) => {
            return {...player,
              [key]:
                value === true ? "x" :
                value === false ? "" :
                value === 0 ? "none" :
                value && key === 'Extra info' ? <span className="ttip" data-toggle="tooltip" title={value}>y</span> :
                value};
          }, {});
          player.createdAt = player.createdAt.split('T')[0];
          let updatedAt = player.updatedAt.split('T');
          player.updatedAt = updatedAt[0].slice(5) + ' ' + updatedAt[1].slice(0, -8);
          let Cell = player.Cell;
          player.Cell = `(${Cell.slice(0,3)})${Cell.slice(3,6)}-${Cell.slice(6)}`;
          // player.photo = 'photo';
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
    <div className="simple wide">
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
        {event['Minimum skill'] !== Skills[0] || event['Maximum skill'] !== Skills[Skills.length - 1] ? <div>Key for color of player:
          {event['Minimum skill'] !== Skills[0] ? <span style={{color: 'red'}}> insufficiently </span> : null}
          {event['Minimum skill'] !== Skills[0] && event['Maximum skill'] !== Skills[Skills.length - 1] ? 'or ' : ' '}
          {event['Maximum skill'] !== Skills[Skills.length - 1] ? <span style={{color: 'blue'}}> excessively </span> : null}
          skilled</div>
        : null}
        <br/>
        {
        // !columns?.length ||
        !players?.length ? <span><h4>NO PLAYERS YET</h4></span> : <BootstrapTable
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
