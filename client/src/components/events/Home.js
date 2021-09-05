import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';

import Context from '../../context';

const Home = () => {
    const options = [
        ["events organized by you", "Edit event details", "View event details"],
        ["events for which you are registered", "Edit reservation"],
        ["events for which you are not registered", "Make reservation"]
    ];
    const { currentUser, gender } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [allEvents, setAllEvents] = useState([]);
    const [events, setEvents] = useState([]);
    const [keys, setKeys] = useState([]);
    const [selectedOption, setSelectedOption] = useState(0);
    const [columns, setColumns] = useState(keys.map(key => ({dataField: key, text: key, sort: true})));
    const [message, setMessage] = useState('');

    const defaultSorted = [{dataField: 'date', order: 'asc'}];

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/events`);
            let data = await response.json();
            if (response.ok) {
                let newAllEvents = [];
                data.events.forEach(event => {
                    let [EventDate, EventTime] = event.dateTime.split("T");
                    EventTime = EventTime.slice(0, 5);
                    let minutes = Math.round(event.duration.value / 60);
                    let hours = Math.floor(minutes / 60);
                    hours = (!hours ? "00" : hours < 10 ? "0" : "") + hours;
                    minutes -= hours * 60;
                    minutes = (!minutes ? "00" : minutes < 10 ? "0" : "") + minutes;
                    event["Travel time"] = hours + ":" + minutes;
                    let newEvent = {...event, ["Event date"]: EventDate, ["Event time"]: EventTime};
                    ['dateTime', 'duration'].forEach(key => delete newEvent[key]);
                    newEvent['Extra info'] = newEvent['Extra info'] && <span className="ttip" data-toggle="tooltip" title={newEvent['Extra info']}>
                        yes (hover)
                    </span>;
                    ['Maximum skill', 'Minimum skill'].forEach(key => {
                        newEvent[key] = event.skills[newEvent[key]];
                    })
                    newAllEvents.push(newEvent);
                });
                setAllEvents(newAllEvents);
            } else {
                setMessage(data.message || data.error.errors[0]);
            }
            setLoading(false);
        })()
    }, [currentUser.id]);

    useEffect(() => {
        let newEvents = allEvents.filter((event, i) => {
            let bool;
            if (selectedOption) {
                bool = (!(selectedOption - 1) !== !event.reservationId);
            } else {
                bool = (event["Event organizer"] === currentUser.Nickname);
            }
            return bool;
        });
        newEvents.forEach(event => {
            let editPath;
            if (selectedOption) {
                editPath = `/reservations/${event.reservationId}-${event.id}`;
            } else {
                editPath = `/editEvents/${event.id}`;
            }
            let viewPath = `/viewEvents/${event.id}`;
            event.edit = (
                <NavLink
                    exact to={editPath}
                    className="nav"
                    activeClassName="active"
                >
                    {options[selectedOption][1]}
                </NavLink>
            );
            event.view = (
                <NavLink
                    exact to={viewPath}
                    className="nav"
                    activeClassName="active"
                >
                    {options[selectedOption][2]}
                </NavLink>
            )
        });
        setEvents(newEvents);
        let newColumns = (!newEvents.length ? [] : Object.keys(newEvents[0]).filter(col => {
            return !["id", "reservationId", "skills",
            // "Minimum skill", "Maximum skill", "Extra info",
            !selectedOption ? 'Event organizer' : 'view'].includes(col);
        }).map(col => {
            let text = ['edit', 'view'].includes(col) ? '' : col
            return {dataField: col, text, sort: !!text && !text.includes("skill")};
        }));
        setColumns(newColumns);
    }, [allEvents, selectedOption]);

    return (
        <div className="simple">
            <div className="welcome">
                <h4>Below are tabulated the events which may interest you.</h4>
            </div>
            <br/>
            <div>
                {options.map((option, i) => (
                    <span key={i}>
                        <input
                            type="radio"
                            value={i}
                            checked={i === selectedOption}
                            onChange={e => setSelectedOption(Number(e.target.value))}
                        />
                        <span>{option[0]}</span>
                    </span>
                ))}
            </div>
            <br/>
            {selectedOption ? null :
                <div>
                    <NavLink exact to={"/editEvents/0"} className="nav" activeClassName="active">
                        <div>Create new event</div>
                    </NavLink>
                </div>
            }
            {loading ? <h2>Loading data</h2> :
                !columns.length ? <h3>No events</h3> :
                    <BootstrapTable keyField='id' data={events} columns={columns} defaultSorted={defaultSorted}/>
            }
        </div>
    )
}
export default Home;
