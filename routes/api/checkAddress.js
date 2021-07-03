const fetch = require('node-fetch');
const { mapsConfig: { mapsApiKey } } = require('../../config');

const checkAddress = async addressIn => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins= ${addressIn.split(" ").join("+")}&destinations=New+York+NY&key=${mapsApiKey}`);
    let data = await response.json();
    let success = response.ok && data.status === "OK" && data.rows[0].elements[0].status === "OK";
    let address = success ? data.origin_addresses[0] : addressIn;
    return {address, success};
}
module.exports = checkAddress;
