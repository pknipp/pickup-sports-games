import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from '../../auth';
import Game from './Game';

const Home = () => {
    const { currentUser, rerender } = useContext(AuthContext);
    const [gamesOwned, setGamesOwned] = useState([]);
    const [gamesReserved, setGamesReserved] = useState([]);
    const [gamesOther, setGamesOther] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/games`);
            let data = await response.json();
            if (response.ok) {
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
    }, [rerender]);

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
            {!gamesOwned.length ? null :
                <div>
                    Game{gamesOwned.length > 1 ? "s" : ""} owned by you (sorted chronologically):
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
                    Game{gamesOther.length > 1 ? "s" : ""} for which you have not yet made a reservation (sorted geographically):
                    <ul>
                        {gamesOther.map(game => {
                            return <Game key={game.id} game={game} type={"Make reservation"} />;
                        })}
                    </ul>
                </div>
            }
        </>
    )
}

export default Home;
