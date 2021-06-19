import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from '../../auth';
import Game from './Game';

const Home = () => {
    const { currentUser, rerender } = useContext(AuthContext);
    const [games, setGames] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/games`);
            let data = await response.json();
            // console.log("data = ", data);
            if (response.ok) {
              setGames(data.games);
            } else {
              setMessage(data.message || data.error.errors[0]);
            }
        })()
    }, [rerender]);

    return (
        <>
            <div>
                <div className="welcome">
                    <p> Here goes a welcome message.</p>
                </div>
            </div>
            Upcoming games ...
            {!games.length ? null :
                <>
                    <div>
                        ... owned by you:
                        <ol>
                            {games.filter(game => (game.ownerId === currentUser.id)).map(game => (
                                <Game key={game.id} game={game} />
                            ))}
                        </ol>
                    </div>
                    <div>
                        ... for which you have a reservation:
                        <ol>
                            {games.filter(game => game.reserved).map(game => (
                                <Game key={game.id} canEditReservation={true} game={game} />
                            ))}
                        </ol>
                    </div>
                    <div>
                        ... neither owned by you nor for which you have a reservation:
                        <ol>
                            {games.filter(game => (game.ownerId !== currentUser.id && !game.reserved)).map(game => (
                                <Game key={game.id} game={game} />
                            ))}
                        </ol>
                    </div>
                </>
            }
        </>
    )
}

export default Home;
