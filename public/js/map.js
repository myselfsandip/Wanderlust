// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
// console.log(mapToken);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', /*standard , dark-v11 */
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});
// console.log(listinggeometry.coordinates)

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: 'crimson' })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${listing.location}</h4><p>Exact location will be provided after booking.</p>`
    ))
    .addTo(map);



    //Icon Pointer On the MAP
    // let iconImage = 'https://res.cloudinary.com/deczqhug9/image/upload/v1721765756/maskIcon_wilzs7.png';
    // map.on('load', () => {
    //     // Load an image from an external URL.
    //     map.loadImage(
    //         iconImage,
    //         (error, image) => {
    //             if (error) throw error;
    
    //             // Add the image to the map style.
    //             map.addImage('maskIcon_wilzs7', image);
    
    //             // Add a data source containing one point feature.
    //             map.addSource('point', {
    //                 'type': 'geojson',
    //                 'data': {
    //                     'type': 'FeatureCollection',
    //                     'features': [
    //                         {
    //                             'type': 'Feature',
    //                             'geometry': {
    //                                 'type': 'Point',
    //                                 'coordinates': listing.geometry.coordinates
    //                             }
    //                         }
    //                     ]
    //                 }
    //             });
    
    //             // Add a layer to use the image to represent the data.
    //             map.addLayer({
    //                 'id': 'points',
    //                 'type': 'symbol',
    //                 'source': 'point', // reference the data source
    //                 'layout': {
    //                     'icon-image': 'maskIcon_wilzs7', // reference the image
    //                     'icon-size': 0.25
    //                 }
    //             });
    //         }
    //     );
    // });
    



















