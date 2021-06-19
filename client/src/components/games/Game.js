import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import AuthContext from '../../auth';
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
                <NavLink exact to={`/reservations/${game.reservationId}`} className="nav" activeClassName="active">
                    Change/cancel reservation
                </NavLink>
            :
                game.ownerId === currentUser.id ?
                    <NavLink exact to={`/games/${game.id}`} className="nav" activeClassName="active">
                        Edit game
                    </NavLink>
                :
                    <NavLink exact to={`/reservations/${game.reservationId}`} className="nav" activeClassName="active">
                        Make reservation
                    </NavLink>
            }
        </div>
    )
}

export default Game;
