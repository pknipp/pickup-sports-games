import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import info from "../info.png";
import cancel from "../cancel.jpeg";
const Home = () => {
    const [games, setGames] = useState([]);
    const [message, setMessage] = useState('');

    useEffect((async() => {
        const response = await fetch(`/api/games`);
        let data = await response.json();
        console.log("data = ", data);
        if (response.ok) {
          setGames(data.games);
        } else {
          setMessage(data.message || data.error.errors[0]);
        }
    })());

    // useEffect(getGames);

    return (
        <>
            <div>
                <div className="welcome">
                    <p> Here goes a welcome message.</p>
                </div>
            </div>
            <ul>
                {games.map(game => (
                    <li>
                        <div>{game.address} {game.dateTime}</div>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Home;
