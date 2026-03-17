import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const restaurantIcon = new L.DivIcon({
  html: `<div style="background:#2d6a4f;border:2px solid white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px;">🍽️</div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
});

const farmIcon = new L.DivIcon({
  html: `<div style="background:#e76f51;border:2px solid white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:14px;">🌾</div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16],
});

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 1) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [60, 60] });
    } else if (positions && positions.length === 1) {
      map.setView(positions[0], 12);
    }
  }, [positions, map]);
  return null;
}

export default function FarmTrailMap({ restaurants, farms, links, selectedRestaurant, onRestaurantClick }) {
  const center = selectedRestaurant
    ? [selectedRestaurant.lat, selectedRestaurant.lng]
    : [39.5, -98.35];
  const zoom = selectedRestaurant ? 8 : 4;

  // Build routes: for selected restaurant, draw lines to its farms
  const routes = [];
  if (selectedRestaurant && links && farms) {
    const restaurantLinks = links.filter(l => l.restaurant_id === selectedRestaurant.id);
    restaurantLinks.forEach(link => {
      const farm = farms.find(f => f.id === link.farm_id);
      if (farm) {
        routes.push({
          positions: [
            [selectedRestaurant.lat, selectedRestaurant.lng],
            [farm.lat, farm.lng],
          ],
          farm,
          link,
        });
      }
    });
  }

  const allPositions = selectedRestaurant
    ? [[selectedRestaurant.lat, selectedRestaurant.lng], ...routes.map(r => r.positions[1])]
    : null;

  return (
    <MapContainer center={center} zoom={zoom} className="w-full h-full rounded-xl" style={{ minHeight: '400px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {allPositions && allPositions.length > 0 && (
        <FitBounds positions={allPositions} />
      )}

      {/* Restaurant markers */}
      {restaurants && restaurants.map(r => (
        <Marker key={r.id} position={[r.lat, r.lng]} icon={restaurantIcon}
          eventHandlers={{ click: () => onRestaurantClick && onRestaurantClick(r) }}>
          <Popup>
            <strong>{r.name}</strong><br />
            {r.city}, {r.state}<br />
            {r.cuisine && <span className="text-xs text-gray-500">{r.cuisine}</span>}
          </Popup>
        </Marker>
      ))}

      {/* Farm markers (only farms linked to selected restaurant) */}
      {routes.map(({ farm, link }) => (
        <Marker key={farm.id} position={[farm.lat, farm.lng]} icon={farmIcon}>
          <Popup>
            <strong>{farm.name}</strong><br />
            {farm.city}, {farm.state}<br />
            {link.ingredients && link.ingredients.length > 0 && (
              <span className="text-xs">Supplies: {link.ingredients.join(', ')}</span>
            )}
          </Popup>
        </Marker>
      ))}

      {/* Route lines */}
      {routes.map(({ positions, farm }) => (
        <Polyline
          key={farm.id}
          positions={positions}
          pathOptions={{ color: '#e76f51', weight: 2.5, dashArray: '6,6', opacity: 0.85 }}
        />
      ))}
    </MapContainer>
  );
}
