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
                    // Consolidate the following two lines, for the sake of DRY-ness.
                    // let {id, sport, dateTime, address, duration, count, owner, reservationId} = game;
                    // let newGame = {id, sport, address, count, reservationId, ["Game organizer"]: game["Game organizer"]}
                    let [GameDate, GameTime] = game.dateTime.split("T");
                    GameTime = GameTime.slice(0, 5);
                    let minutes = Math.round(game.duration.value / 60);
                    delete game.duration;
                    let hours = Math.floor(minutes / 60);
                    hours = (!hours ? "00" : hours < 10 ? "0" : "") + hours;
                    minutes -= hours * 60;
                    minutes = (!minutes ? "00" : minutes < 10 ? "0" : "") + minutes;
                    game["Travel time"] = hours + ":" + minutes;
                    let newGame = {...game, ["Game date"]: GameDate, ["Game time"]: GameTime};
                    // ['ownerId'].forEach(key => delete newGame[key]);
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
        // Do not include the "game owner" column for the zeroth value of selectOption
        // let newKeys = allKeys.filter(key => key[0] !== (!selectedOption ? 'owner' : "view"));
        let newKeys = !allGames.length ? [] : Object.keys(allGames[0]);
        setKeys(newKeys);
        console.log("newKeys = ", newKeys);
        setColumns(newKeys.map((key, index) => {
            return {dataField: key, text: key, sort: !!key};
        }));
        let newGames = allGames.filter((game, i) => {
            let bool;
            if (selectedOption) {
                bool = (!(selectedOption - 1) !== !game.reservationId);
            } else {
                bool = (game["Game organizer"] === currentUser.Nickname);
            }
            return bool;
        });
        console.log("newGames = ", newGames);
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
                <BootstrapTable keyField='id' data={games} columns={columns} defaultSorted={defaultSorted}/>
            }
        </div>
    )
}
export default Home;
