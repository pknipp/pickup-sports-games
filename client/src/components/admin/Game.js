import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from '../../auth';
import info from "../info.png";
import cancel from "../cancel.jpeg";
const Game = ({game, canEditReservation}) => {
    const { currentUser } = useContext(AuthContext);

    return (
        <div>
            <li>
                <div>Game location: {game.address}</div>
                <div>Game dateTime: {game.dateTime}</div>
                <div>
                    {game.count} player{game.count > 1 ? 's' : ''} reserved thus far
                </div>
            </li>
            {canEditReservation ?
                <button>Change or cancel reservation</button>
            :
                <button>{game.ownerId === currentUser.id ? "Edit game" : "Make reservation"}</button>
            }
        </div>
    )
}

export default Game;
