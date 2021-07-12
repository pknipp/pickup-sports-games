import React from "react";
import { NavLink } from "react-router-dom";

const Game = ({game, type }) => {
    const [date, time] = game.dateTime.split("T");
    return (
        <div>
            <li>
                <div>Date: {date}</div>
                <div>Starts: {time.slice(0, 5)}</div>
                {type === "Edit game" ? null :
                    <div>Organized by {game.owner.nickName}</div>
                }
                <div>Travel-time: {game.duration.text}</div>
                <div>Game location: {game.address}</div>
                <div>
                    {game.count} player{game.count > 1 ? 's' : ''} reserved thus far
                </div>
            </li>
            {type === "Edit reservation" ?
                <NavLink exact to={`/reservations/${game.reservationId}-${game.id}`} className="nav" activeClassName="active">
                    {type}
                </NavLink>
            :
                type === "Edit game" ?
                    <NavLink exact to={`/games/${game.id}`} className="nav" activeClassName="active">
                        {type}
                    </NavLink>
            :
                <NavLink exact to={`/reservations/${game.reservationId}-${game.id}`} className="nav" activeClassName="active">
                    {type}
                </NavLink>
            }
        </div>
    )
}

export default Game;
