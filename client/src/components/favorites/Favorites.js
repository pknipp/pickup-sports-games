import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';

import Context from '../../context';

const Favorites = () => {
  const columns = ["Follow?", "Sport", "Select skill-level"].map(key => {
    return {dataField: key, text: key, sort: true};
  });
  const { currentUser } = useContext(Context);
  const [favorites, setFavorites] = useState([]);
  const [sports, setSports] = useState([]);
  const [refetch, setRefetch] = useState(false);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      console.log("top of ue1 says that favorites.length/sports.length = ", favorites.length, sports.length);
      let newFavorites = (await (await fetch('/api/favorites')).json()).favorites;
      setFavorites(newFavorites.sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0));
      let newSports = (await (await fetch('/api/sports')).json()).sports;
      setSports(newSports.sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0));
      console.log("bottom of ue1 says that newFavorites.length/newSports.length = ", newFavorites.length, newSports.length);
    })();
  }, []);

  useEffect(() => {
    (async() => {
      console.log("top of ue2 says that favorites.length/sports.length = ", favorites.length, sports.length)
      let newSports = JSON.parse(JSON.stringify(sports));
      newSports.forEach(sport => {
        sport.Sport = sport.Name;
        sport["Follow?"] = (
          <input
            key={sport.id}
            name="wantsToPlay"
            type="checkbox"
            checked={favorites.map(favorite => favorite.sportId).includes(sport.id)}
            onChange={async e => {
              if (!e.target.checked) {
                console.log("delete a favorite")
                let favoriteId = favorites.filter(favorite => favorite.sportId === sport.id)[0]?.id;
                await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE'});
              } else {
                console.log("post a favorite");
                await fetch("/api/favorites", { method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({sportId: sport.id})
                });
              }
              setRefetch(!refetch);
            }}
          />
        );
        console.log(sport["Follow?"])
      });
      setSports(newSports);
    })();
  }, []);

  return (
    <>
    <BootstrapTable keyField='id' data={sports} columns={columns} />
    <div className="horizontal">
      <div className="vertical">
        <span>Follow?</span>
        {sports.map(sport => (
          <div className="same" key={sport.id}>
            <input
              name="wantsToPlay"
              type="checkbox"
              checked={favorites.map(favorite => favorite.sportId).includes(sport.id)}
              onChange={async e => {
                if (!e.target.checked) {
                  let favoriteId = favorites.filter(favorite => favorite.sportId === sport.id)[0]?.id;
                  await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE'});
                  setRefetch(!refetch);
                } else {
                  await fetch("/api/favorites", { method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({sportId: sport.id})
                  });
                }
                setRefetch(!refetch);
              }}
            />
          </div>
        ))}
      </div>
      <div className="vertical">
        <span>Sport</span>
        {sports.map(sport => (
          <div className="same" key={sport.id}>{sport.Name}</div>
        ))}
      </div>
      <div className="vertical">
        <span>Select skill-level</span>
        {sports.map(sport => (
          <div className="same" key={sport.id}>
            <select
              disabled={!favorites.map(favorite => favorite.sportId).includes(sport.id)}
              onChange={async e => {
                let favoriteId = favorites.filter(favorite => favorite.sportId === sport.id)[0]?.id;
                await fetch(`/api/favorites/${favoriteId}`, { method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({Skill: Number(e.target.value)})
                });
                setRefetch(!refetch);
              }}
              value={favorites.filter(favorite => favorite.sportId === sport.id)[0]?.Skill}
            >
              {(!favorites.map(favorite => favorite.sportId).includes(sport.id) ? ["Ignore"] : sport.Skills).map( (element, newIndex) => (
                <option key={newIndex} value={newIndex}>
                  {element}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default Favorites;
