import React from "react";
import { NavLink } from "react-router-dom";
import info from "../info.png";
import cancel from "../cancel.jpeg";
const Home = _ => {
    return (
    <div>
        <div className="welcome">
            <p> Here goes a welcome message.</p>
        </div>
        <ul className="descriptions">
            <li> Here goes an overview of <NavLink to="/feature1"> feature1 </NavLink>.</li>
        </ul>
        Note: in these features click "<img src={info} alt="Show information." />/<img src={cancel} alt="Hide information." />" in order to toggle the display of information about various details.
    </div>
)}
export default Home;
