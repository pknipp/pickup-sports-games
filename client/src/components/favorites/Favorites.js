import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';

import Context from '../../context';

const Favorites = () => {
  const columns = [["Follow?", 20], ["Sport", 30], ["Select skill-level", 50]].map(([key, width]) => {
    return {dataField: key, text: key, headerStyle: {width: `${width}%`}, sort: true};
  });
  columns[0].sortFunc = (a, b, order, dataField, rowA, rowB) => {
    return (order === "asc" ? 1 : -1) * (Number(rowA.wantsToPlay) - Number(rowB.wantsToPlay));
  };
  columns[2].sortFunc = (a, b, order, dataField, rowA, rowB) => {
    return (order === "asc" ? 1 : -1) * (rowA.Skill - rowB.Skill);
  };
  const { user } = useContext(Context);
  const [favorites, setFavorites] = useState([]);
  const [sports, setSports] = useState([]);
  const [refetch, setRefetch] = useState(false);

  // let history = useHistory();

  useEffect(() => {
    (async() => {
      let newFavorites = (await (await fetch('/api/favorites')).json()).favorites;
      setFavorites(newFavorites.sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0));
      let newSports = (await (await fetch('/api/sports')).json()).sports;
      newSports.forEach(sport => {
        sport.Sport = sport.Name;
        let index = newFavorites.map(fav => fav.sportId).indexOf(sport.id);
        sport.favoriteId = newFavorites[index]?.id;
        sport.wantsToPlay = !!sport.favoriteId;
        sport.Skill = (Number(!!sport.favoriteId) && newFavorites[index].Skill + 1) - 1;
      });
      setSports(newSports.sort((a, b) => a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0));
    })();
  }, [refetch]);

  return (
    <div className="container narrow">
      <BootstrapTable keyField='id' columns={columns} data={sports.map(sport => {
        return {...sport, ["Follow?"]: (
          <input
            key={sport.id}
            name="wantsToPlay"
            type="checkbox"
            checked={sport.favoriteId >= 0}
            onChange={async e => {
              if (e.target.checked) {
                await fetch("/api/favorites", { method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({sportId: sport.id})
                });
              } else {
                await fetch(`/api/favorites/${sport.favoriteId}`, { method: 'DELETE'});
              }
              setRefetch(!refetch);
            }}
          />
        ),
        ["Select skill-level"]: (
          <select
            disabled={!sport.favoriteId}
            onChange={async e => {
              await fetch(`/api/favorites/${sport.favoriteId}`, { method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({Skill: Number(e.target.value)})
              });
              setRefetch(!refetch);
            }}
            value={favorites.filter(favorite => favorite.sportId === sport.id)[0]?.Skill}
          >
            {(sport.favoriteId ? sport.Skills : ["not following"]).map((element, newIndex) => (
              <option key={newIndex} value={newIndex}>
                {element}
              </option>
            ))}
          </select>
        )}
      })}/>
    </div>
  );
}

export default Favorites;
