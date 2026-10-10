
const defaultCenter = [77.2089, 28.6139];
const parsedCoordinates = typeof listingCoordinates === 'string'
    ? JSON.parse(listingCoordinates)
    : listingCoordinates;

const coordinates = Array.isArray(parsedCoordinates) && parsedCoordinates.length === 2
    ? parsedCoordinates
    : defaultCenter;

const map = new mapboxgl.Map({
    accessToken: mapToken,
    container: 'map',
    center: coordinates,
    zoom: 10
});

const popup = new mapboxgl.Popup({
    offset: 20,
    closeButton: true,
    closeOnClick: true,
    className: 'custom-map-popup'
})
    .setHTML(`
        <div class="map-popup-card">
            <div class="map-popup-header">
                <span class="map-popup-badge">Exact location</span>
            </div>
            <h4 class="map-popup-title">${listingTitle || 'Listing'}</h4>
            <p class="map-popup-text">Exact location will be provided after booking.</p>
        </div>
    `);

const markerElement = document.createElement('div');
markerElement.style.width = '38px';
markerElement.style.height = '38px';
markerElement.style.borderRadius = '50%';
markerElement.style.backgroundColor = '#ff385c';
markerElement.style.border = '2px solid #fff';
markerElement.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.18)';
markerElement.style.display = 'flex';
markerElement.style.alignItems = 'center';
markerElement.style.justifyContent = 'center';
markerElement.style.fontSize = '18px';
markerElement.style.color = '#fff';
markerElement.style.fontWeight = 'bold';
markerElement.style.backdropFilter = 'blur(2px)';
markerElement.innerHTML = '🏠';

new mapboxgl.Marker({ element: markerElement })
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);