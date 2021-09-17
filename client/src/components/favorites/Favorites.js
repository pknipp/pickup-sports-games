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
      let newFavorites = (await (await fetch('/api/favorites')).json()).favorites;
      setFavorites(newFavorites.sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0));
      let newSports = (await (await fetch('/api/sports')).json()).sports;
      newSports.forEach(sport => {
        sport.Sport = sport.Name;
        // delete sport.Name;
      });
      setSports(newSports.sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0));
    })();
  }, [refetch]);

  return (
    <BootstrapTable keyField='id' columns={columns} data={sports.map(sport => {
      return {...sport, ["Follow?"]: (
        <input
          key={sport.id}
          name="wantsToPlay"
          type="checkbox"
          checked={favorites.map(favorite => favorite.sportId).includes(sport.id)}
          onChange={async e => {
            if (!e.target.checked) {
              let favoriteId = favorites.filter(favorite => favorite.sportId === sport.id)[0]?.id;
              await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE'});
            } else {
              await fetch("/api/favorites", { method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({sportId: sport.id})
              });
            }
            setRefetch(!refetch);
          }}
        />
      ),
      ["Select skill-level"]: (
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
          {(!favorites.map(favorite => favorite.sportId).includes(sport.id) ?
            ["not following"] : sport.Skills
            ).map((element, newIndex) => (
              <option key={newIndex} value={newIndex}>
                {element}
              </option>
          ))}
        </select>
      )}
    })}/>
  );
}

export default Favorites;
