import L from 'leaflet';

const CustomMarkerIcon = new L.Icon({
  iconUrl: '/custom-marker.svg',
  iconRetinaUrl: '/custom-marker.svg',
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 40),
  popupAnchor: new L.Point(0, -40),
});

export default CustomMarkerIcon;

