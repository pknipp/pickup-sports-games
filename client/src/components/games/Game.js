import React from "react";
import { NavLink } from "react-router-dom";

// import AuthContext from '../../auth';
const Game = ({game, type }) => {

    return (
        <div>
            <li>
                <div>Game dateTime: {game.dateTime}</div>
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
