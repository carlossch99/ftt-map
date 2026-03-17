import { MapPin, Clock, Truck, Leaf } from 'lucide-react';

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateDriveTime(miles) {
  const hours = miles / 55; // avg 55 mph for trucks
  if (hours < 1) return `~${Math.round(hours * 60)} min`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `~${h}h ${m}m` : `~${h}h`;
}

export default function DistanceCard({ restaurant, farm, link }) {
  if (!restaurant || !farm) return null;

  const miles = haversineDistance(restaurant.lat, restaurant.lng, farm.lat, farm.lng);
  const driveTime = estimateDriveTime(miles);
  const isLocal = miles < 100;

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-lg">🌾</span>
            <span className="font-semibold text-sm text-foreground">{farm.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {farm.city}, {farm.state}
          </div>
        </div>
        {isLocal && (
          <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            <Leaf className="w-3 h-3" />
            Local
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-lg p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
            <Truck className="w-3 h-3" />
            <span className="text-xs">Distance</span>
          </div>
          <div className="font-bold text-foreground">{miles.toFixed(0)} <span className="text-xs font-normal">mi</span></div>
        </div>
        <div className="bg-muted rounded-lg p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
            <Clock className="w-3 h-3" />
            <span className="text-xs">Drive Time</span>
          </div>
          <div className="font-bold text-foreground text-sm">{driveTime}</div>
        </div>
      </div>

      {link?.ingredients && link.ingredients.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1.5">Supplies</p>
          <div className="flex flex-wrap gap-1.5">
            {link.ingredients.map(ing => (
              <span key={ing} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
