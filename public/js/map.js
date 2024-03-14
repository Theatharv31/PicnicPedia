mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates, // Change coordinates to cordinates
    zoom: 9 ,// starting zoom
});

console.log(coordinates);

const marker = new mapboxgl.Marker()
    .setLngLat(coordinates) // Change coordinates to cordinates
    .addTo(map);
