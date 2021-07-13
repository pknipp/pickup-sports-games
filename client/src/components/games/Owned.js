import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
// import bootstrap from 'bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';

import AuthContext from '../../auth';
import Game from './Game';

const Owned = () => {
    const { currentUser, rerender } = useContext(AuthContext);
    const [gamesOwned, setGamesOwned] = useState([]);
    const [gamesReserved, setGamesReserved] = useState([]);
    const [gamesOther, setGamesOther] = useState([]);
    const [message, setMessage] = useState('');

    const keys = [
        ['date', 'Game date'],
        ['time', 'Start time'],
        ['address', 'Address'],
        ['duration', 'Travel time'],
        ['count', 'Player reservations'],
        ['editGame', '']
    ];
    let newOwned = keys.reduce((owned, key) => ({...owned, [key[0]]: []}), {});

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/games`);
            let data = await response.json();
            if (response.ok) {
                console.log("data.games = ", data.games)
                setGamesOwned(data.games.filter(game => game.ownerId === currentUser.id).map(game => {
                    const [date, time] = game.dateTime.split("T");
                    return {
                        id: game.id,
                        date,
                        time: time.slice(0, -8),
                        address: game.address,
                        duration: game.duration.text,
                        count: game.count,
                        editGame: (
                            <NavLink exact to={`/games/${game.id}`} className="nav" activeClassName="active">
                                Edit game
                            </NavLink>
                        )
                    }
                }));
            } else {
                setMessage(data.message || data.error.errors[0]);
            }
        })()
    }, [rerender, currentUser.id]);

    const columns = keys.map(key => ({dataField: key[0], text: key[1], sort: true}));

    return (
        <>
            <div>
                <NavLink exact to={"/games/0"} className="nav" activeClassName="active">
                    Create new Game
                </NavLink>
            </div>
            <BootstrapTable keyField='id' data={ gamesOwned } columns={ columns } />
        </>
    )
}

export default Owned;
