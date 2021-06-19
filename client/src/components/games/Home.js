import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from '../../auth';
import Game from './Game';

const Home = () => {
    const { currentUser, rerender } = useContext(AuthContext);
    const [games, setGames] = useState([]);
    const [gamesOwned, setGamesOwned] = useState([]);
    const [gamesReserved, setGamesReserved] = useState([]);
    const [gamesOther, setGamesOther] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/games`);
            let data = await response.json();
            if (response.ok) {
              setGames(data.games);
              setGamesOwned(data.games.filter(game => game.ownerId === currentUser.id));
              setGamesReserved(data.games.filter(game => !!game.reservationId));
              setGamesOther(data.games.filter(game => !game.reservationId));
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
                    Game{gamesOwned.length > 1 ? "s" : ""} owned by you:
                    <ul>
                        {gamesOwned.map(game => {
                        return <Game key={game.id} game={game} type={"Edit game"}/>;
                        })}
                    </ul>
                </div>
            }
            {!gamesReserved.length ? null :
                <div>
                    Game{gamesReserved.length > 1 ? "s" : ""} for which you have a reservation:
                    <ul>
                        {gamesReserved.map(game => {
                            return <Game key={game.id} type={"Edit reservation"} game={game} />;
                        })}
                    </ul>
                </div>
            }
            {!gamesOther.length ? null :
                <div>
                    Game{gamesOther.length > 1 ? "s" : ""} for which you have not yet made a reservation:
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
