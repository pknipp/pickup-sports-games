import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';

import Context from '../../context';

const Home = () => {
    const options = [
        ["games organized by you", "Edit game details", "View game details"],
        ["games for which you are registered to play", "Edit reservation"],
        ["games for which you are not registered to play", "Make reservation"]
    ];
    // let allKeys = [
    //     ['sport', 'Sport'],
    //     ['date', 'Game date'],
    //     ['time', 'Start time'],
    //     ['address', 'Address'],
    //     ['duration', 'Travel time (hr:min)'],
    //     ['count', 'Player reservations'],
    //     ['owner', 'Game organizer'],
    //     ['edit', ''],
    //     ['view', '']
    // ];
    const { currentUser, gender } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [allGames, setAllGames] = useState([]);
    const [games, setGames] = useState([]);
    const [keys, setKeys] = useState([]);
    const [selectedOption, setSelectedOption] = useState(0);
    const [columns, setColumns] = useState(keys.map(key => ({dataField: key, text: key, sort: true})));
    const [message, setMessage] = useState('');

    const defaultSorted = [{dataField: 'date', order: 'asc'}];

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/games`);
            let data = await response.json();
            if (response.ok) {
                let newAllGames = [];
                data.games.forEach(game => {
                    let [GameDate, GameTime] = game.dateTime.split("T");
                    GameTime = GameTime.slice(0, 5);
                    let minutes = Math.round(game.duration.value / 60);
                    let hours = Math.floor(minutes / 60);
                    hours = (!hours ? "00" : hours < 10 ? "0" : "") + hours;
                    minutes -= hours * 60;
                    minutes = (!minutes ? "00" : minutes < 10 ? "0" : "") + minutes;
                    game["Travel time"] = hours + ":" + minutes;
                    let newGame = {...game, ["Game date"]: GameDate, ["Game time"]: GameTime};
                    ['dateTime', 'duration'].forEach(key => delete newGame[key]);
                    newGame['Extra info'] = newGame['Extra info'] && <span className="ttip" data-toggle="tooltip" title={newGame['Extra info']}>
                        yes (hover)
                    </span>;
                    newAllGames.push(newGame);
                });
                setAllGames(newAllGames);
            } else {
                setMessage(data.message || data.error.errors[0]);
            }
            setLoading(false);
        })()
    }, [currentUser.id]);

    useEffect(() => {
        let newGames = allGames.filter((game, i) => {
            let bool;
            if (selectedOption) {
                bool = (!(selectedOption - 1) !== !game.reservationId);
            } else {
                bool = (game["Game organizer"] === currentUser.Nickname);
            }
            return bool;
        });
        newGames.forEach(game => {
            let editPath;
            if (selectedOption) {
                editPath = `/reservations/${game.reservationId}-${game.id}`;
            } else {
                editPath = `/editGames/${game.id}`;
            }
            let viewPath = `/viewGames/${game.id}`;
            game.edit = (
                <NavLink
                    exact to={editPath}
                    className="nav"
                    activeClassName="active"
                >
                    {options[selectedOption][1]}
                </NavLink>
            );
            game.view = (
                <NavLink
                    exact to={viewPath}
                    className="nav"
                    activeClassName="active"
                >
                    {options[selectedOption][2]}
                </NavLink>
            )
        });
        setGames(newGames);
        let newColumns = (!newGames.length ? [] : Object.keys(newGames[0]).filter(col => {
            return !["id", "reservationId", "Minimum skill", "Maximum skill",
            // "Extra info",
            !selectedOption ? 'Game organizer' : 'view'].includes(col);
        }).map(col => {
            let text = ['edit', 'view'].includes(col) ? '' : col
            return {dataField: col, text, sort: !!text};
        }));
        setColumns(newColumns);
    }, [allGames, selectedOption]);

    return (
        <div className="simple">
            <div className="welcome">
                <h4>Below are tabulated games of interest to you.</h4>
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
                    <NavLink exact to={"/editGames/0"} className="nav" activeClassName="active">
                        <div>Create new Game</div>
                    </NavLink>
                </div>
            }
            {loading ? <h2>Loading data</h2> :
                !columns.length ? <h3>No games</h3> :
                    <BootstrapTable keyField='id' data={games} columns={columns} defaultSorted={defaultSorted}/>
            }
        </div>
    )
}
export default Home;
