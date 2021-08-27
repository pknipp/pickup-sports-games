const fetch = require('node-fetch');
const { mapsConfig: { mapsApiKey } } = require('../../config');

const checkLocation = async LocationIn => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins= ${LocationIn}&destinations=New+York+NY&key=${mapsApiKey}`);
    let data = await response.json();
    let success = response.ok && data.status === "OK" && data.rows[0].elements[0].status === "OK";
    let Location = success ? data.origin_addresses[0] : LocationIn;
    return {Location, success};
}
module.exports = checkLocation;
