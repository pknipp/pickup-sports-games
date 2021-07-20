import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';

import AuthContext from '../../auth';

const Home = () => {
    const options = [
        ["games organized by you", "Edit game details", "View game details"],
        ["games for which you are registered to play", "Edit reservation"],
        ["games for which you are not registered to play", "Make reservation"]
    ];
    let allKeys = [
        ['date', 'Game date'],
        ['time', 'Start time'],
        ['address', 'Address'],
        ['duration', 'Travel time (hr:min)'],
        ['count', 'Player reservations'],
        ['owner', 'Game organizer'],
        ['edit', ''],
        ['view', '']
    ];
    const { currentUser } = useContext(AuthContext);
    const [allGames, setAllGames] = useState([]);
    const [games, setGames] = useState([]);
    const [keys, setKeys] = useState([...allKeys]);
    const [selectedOption, setSelectedOption] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/games`);
            let data = await response.json();
            if (response.ok) {
                let newAllGames = [];
                data.games.forEach(game => {
                    let {id, dateTime, address, duration, count, owner, reservationId} = game;
                    let newGame = {id, address, count, reservationId, owner: owner.nickName}
                    let [date, time] = dateTime.split("T");
                    time = time.slice(0, 5);
                    let minutes = Math.round(duration.value / 60);
                    let hours = Math.floor(minutes / 60);
                    hours = (!hours ? "00" : hours < 10 ? "0" : "") + hours;
                    minutes -= hours * 60;
                    minutes = (!minutes ? "00" : minutes < 10 ? "0" : "") + minutes;
                    duration = hours + ":" + minutes;
                    newGame = {...newGame, date, time, duration, ownerId: owner.id};
                    newGame.ownerId = owner.id;
                    newAllGames.push(newGame);
                });
                setAllGames(newAllGames);
            } else {
                setMessage(data.message || data.error.errors[0]);
            }
        })()
    }, [currentUser.id]);

    useEffect(() => {
        // Do not include the "game owner" column for the zeroth value of selectOption
        setKeys(allKeys.filter(key => selectedOption ? true : key[0] !== 'owner'));
        let bool;
        let newGames = allGames.filter((game, i) => {
            if (selectedOption) {
                bool = (!(selectedOption - 1) !== !game.reservationId);
            } else {
                bool = (game.ownerId === currentUser.id);
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
    }, [allGames, selectedOption]);

    const columns = keys.map((key, index) => {
        if (index < keys.length - 1 || !selectedOption) {
            return {dataField: key[0], text: key[1], sort: true};
        }
    });

    return (
        <>
            <div className="welcome">
                <p>Here goes a welcome message.</p>
            </div>
            {options.map((option, i) => (
                <>
                    <input
                        key={i}
                        type="radio"
                        value={i}
                        checked={i === selectedOption}
                        onChange={e => setSelectedOption(Number(e.target.value))}
                    />
                    <span>{option[0]}</span>
                </>
            ))}
            {selectedOption ? null :
                <div>
                    <NavLink exact to={"/games/0"} className="nav" activeClassName="active">
                        <div>Create new Game</div>
                    </NavLink>
                </div>
            }
            <BootstrapTable keyField='id' data={ games } columns={ columns } />
        </>
    )
}
export default Home;
