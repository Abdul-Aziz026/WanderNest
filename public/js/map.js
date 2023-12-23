// https://account.mapbox.com
mapboxgl.accessToken = mapToken;
// console.log(mapToken);
const map = new mapboxgl.Map({
        container: "map", // container ID
        style: "mapbox://styles/mapbox/streets-v12", // style url
        center: coordinates, // starting position [lng, lat]
        zoom: 8 // starting zoom
});

console.log(coordinates, "aaaaaaaaaaabc");

const marker = new mapboxgl.Marker({color: "red"})
.setLngLat(coordinates) // listing.geometry.coordinates
.addTo(map);
