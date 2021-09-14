import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import Context from '../../context';

const Favorites = () => {
  const { currentUser } = useContext(Context);
  const [favorites, setFavorites] = useState([]);
  const [sports, setSports] = useState([]);
  const [refetch, setRefetch] = useState(false);

  let history = useHistory();

  useEffect(() => {
    (async() => {
      let data = await (await fetch('/api/sports')).json();
      setSports(data.sports.sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0));
      data = await (await fetch('/api/favorites')).json();
      setFavorites(data.favorites.sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0));
    })();
  }, [refetch]);

  return (
    <div className="horizontal">
    <div className="vertical">
      <span>Follow?</span>
      {sports.map(sport => (
        <div className="same">
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
        <>
        <div className="same">{sport.Name}</div>
        </>
      ))}
    </div>
    <div className="vertical">
      <span>Select skill-level</span>
      {sports.map(sport => (
        <div className="same">
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
            {(!favorites.map(favorite => favorite.sportId).includes(sport.id) ? ["Ignore"] : sport.Skills).map((element, newIndex) => (
              <option key={newIndex} value={newIndex}>
                {element}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
    </div>
  );
}

export default Favorites;
