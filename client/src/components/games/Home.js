import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';

import AuthContext from '../../auth';
import Game from './Game';

const Home = () => {
    const { currentUser, rerender } = useContext(AuthContext);
    const [games, setGames] = useState([]);
    const [gamesOwned, setGamesOwned] = useState([]);
    const [gamesReserved, setGamesReserved] = useState([]);
    const [gamesOther, setGamesOther] = useState([]);
    const [message, setMessage] = useState('');

    const keys = [
        ['date', 'Game date'],
        ['time', 'Start time'],
        ['address', 'Address'],
        ['duration', 'Travel time (hr:min)'],
        ['count', 'Player reservations'],
        ['owner', 'Game organizer'],
        // ['editGame', '']
    ];
    // let newGames = keys.reduce((owned, key) => ({...owned, [key[0]]: []}), {});
    const columns = keys.map(key => ({dataField: key[0], text: key[1], sort: true}));

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/games`);
            let data = await response.json();
            if (response.ok) {
                let newGames = [];
                data.games.forEach(game => {
                    let {id, dateTime, address, duration, count, owner} = game;
                    let newGame = {id, address, count, owner: owner.nickName}
                    let [date, time] = game.dateTime.split("T");
                    time = time.slice(0, 5);
                    let minutes = Math.round(duration.value / 60);
                    let hours = Math.floor(minutes / 60);
                    hours = (!hours ? "00" : hours < 10 ? "0" : "") + hours;
                    minutes -= hours * 60;
                    minutes = (!minutes ? "00" : minutes < 10 ? "0" : "") + minutes;
                    duration = hours + ":" + minutes;
                    newGame = {...newGame, date, time, duration};
                    newGames.push(newGame);
                })
                setGames(newGames);
              setGamesOwned(data.games.filter(game => {
                  return game.ownerId === currentUser.id;
              }).sort((game1, game2) => new Date(game1.dateTime) - new Date(game2.dateTime)));
              setGamesReserved(data.games.filter(game => {
                  return !!game.reservationId;
              }).sort((game1, game2) => game1.owner.nickName.localeCompare(game2.owner.nickName)));
              setGamesOther(data.games.filter(game => {
                  return !game.reservationId;
              }).sort((game1, game2) => game1.duration.value - game2.duration.value));
            } else {
              setMessage(data.message || data.error.errors[0]);
            }
        })()
    }, [rerender, currentUser.id]);



    return (
        <>
            <div>
                <div className="welcome">
                    <p>Here goes a welcome message.</p>
                </div>
            </div>
            <div>
                <NavLink exact to={"/games/0"} className="nav" activeClassName="active">
                    Create new Game
                </NavLink>
            </div>
            <BootstrapTable keyField='id' data={ games } columns={ columns } />

            {!gamesOwned.length ? null :
                <div>
                    Game{gamesOwned.length > 1 ? "s" : ""} owned by you (sorted    chronologically):
                    <ul>
                        {gamesOwned.map(game => {
                        return <Game key={game.id} game={game} type={"Edit game"}/>;
                        })}
                    </ul>
                </div>
            }
            {!gamesReserved.length ? null :
                <div>
                    Game{gamesReserved.length > 1 ? "s" : ""} for which you have a reservation (sorted by game owner):
                    <ul>
                        {gamesReserved.map(game => {
                            return <Game key={game.id} type={"Edit reservation"} game={game} />;
                        })}
                    </ul>
                </div>
            }
            {!gamesOther.length ? null :
                <div>
                    Game{gamesOther.length > 1 ? "s" : ""} for which you have not yetmade a reservation (sorted geographically):
                    <ul>
                        {gamesOther.map(game => {
                            return <Game key={game.id} game={game} type={"Makereservation"}    />;
                        })}
                    </ul>
                </div>
            }
        </>
    )
}

export default Home;
