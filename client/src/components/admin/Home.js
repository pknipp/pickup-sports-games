import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import info from "../info.png";
import cancel from "../cancel.jpeg";
const Home = () => {
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
            Upcoming games:
            <ul>
                {!games.length ? null : games.map(game => (
                    <li key={game.id}>
                        <div>Game location: {game.address}</div>
                        <div>Game dateTime: {game.dateTime}</div>
                        <div>{game.count} player{game.count > 1 ? 's' : ''} registered thus far</div>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Home;
