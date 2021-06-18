import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from '../../auth';
import info from "../info.png";
import cancel from "../cancel.jpeg";
const Home = () => {
    const { currentUser } = useContext(AuthContext);
    const [games, setGames] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/games`);
            let data = await response.json();
            console.log("data = ", data);
            if (response.ok) {
              setGames(data.games);
            } else {
              setMessage(data.message || data.error.errors[0]);
            }
        })()
    }, []);

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
                        ... owned by me:
                        <ol>
                            {games.filter(game => (game.ownerId === currentUser.id)).map(game => (
                                <div key={game.id}>
                                    <li>
                                        <div>Game location: {game.address}</div>
                                        <div>Game dateTime: {game.dateTime}</div>
                                        <div>
                                            {game.count} player{game.count > 1 ? 's' : ''} reserved thus far
                                        </div>
                                    </li>
                                    {currentUser.id !== game.ownerId ? null :
                                        <button>Edit game details</button>
                                    }
                                </div>
                            ))}
                        </ol>
                    </div>
                    <div>
                        ... for which I have a reservation:
                        <ol>
                            {games.filter(game => game.reserved).map(game => (
                                <div key={game.id}>
                                    <li>
                                        <div>Game location: {game.address}</div>
                                        <div>Game dateTime: {game.dateTime}</div>
                                        <div>
                                            {game.count} player{game.count > 1 ? 's' : ''} reserved thus far
                                        </div>
                                    </li>
                                </div>
                            ))}
                        </ol>
                    </div>
                    <div>
                        ... neither owned by me nor for which I have a reservation:
                        <ol>
                            {games.filter(game => (game.ownerId !== currentUser.id && !game.reserved)).map(game => (
                                <div key={game.id}>
                                    <li>
                                        <div>Game location: {game.address}</div>
                                        <div>Game dateTime: {game.dateTime}</div>
                                        <div>
                                            {game.count} player{game.count > 1 ? 's' : ''} reserved thus far
                                        </div>
                                    </li>
                                </div>
                            ))}
                        </ol>
                    </div>
                </>
            }
        </>
    )
}

export default Home;
