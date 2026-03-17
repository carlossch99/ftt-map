import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Leaf, MapPin, Clock, Truck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import DistanceCard from '@/components/map/DistanceCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Restaurants() {
  const [search, setSearch] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const { data: restaurants = [] } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => base44.entities.Restaurant.list(),
  });

  const { data: farms = [] } = useQuery({
    queryKey: ['farms'],
    queryFn: () => base44.entities.Farm.list(),
  });

  const { data: links = [] } = useQuery({
    queryKey: ['links'],
    queryFn: () => base44.entities.FarmRestaurantLink.list(),
  });

  const filtered = restaurants.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.city?.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine?.toLowerCase().includes(search.toLowerCase())
  );

  const linkedFarms = selectedRestaurant
    ? links
        .filter(l => l.restaurant_id === selectedRestaurant.id)
        .map(l => ({ farm: farms.find(f => f.id === l.farm_id), link: l }))
        .filter(({ farm }) => farm)
    : [];

  if (selectedRestaurant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedRestaurant(null)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          ← Back to all restaurants
        </button>

        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
          <div
            className="h-40 bg-cover bg-center"
            style={{
              backgroundImage: selectedRestaurant.image_url
                ? `url(${selectedRestaurant.image_url})`
                : 'linear-gradient(135deg, hsl(142,38%,28%), hsl(142,38%,20%))',
            }}
          />
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-playfair text-2xl font-bold text-foreground">{selectedRestaurant.name}</h1>
                <div className="flex items-center gap-1 text-muted-foreground mt-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  {selectedRestaurant.address && `${selectedRestaurant.address}, `}
                  {selectedRestaurant.city}, {selectedRestaurant.state}
                </div>
              </div>
              {selectedRestaurant.cuisine && (
                <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full font-medium">
                  {selectedRestaurant.cuisine}
                </span>
              )}
            </div>
            {selectedRestaurant.description && (
              <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{selectedRestaurant.description}</p>
            )}
            <div className="flex items-center gap-3 mt-4">
              <Button asChild size="sm" variant="outline">
                <Link to="/Map" onClick={() => {}}>View on Map</Link>
              </Button>
              {selectedRestaurant.website && (
                <a href={selectedRestaurant.website} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline">
                  Visit Website →
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5 text-primary" />
          <h2 className="font-playfair text-xl font-semibold text-foreground">
            Farm Sources ({linkedFarms.length})
          </h2>
        </div>

        {linkedFarms.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>No farm sources linked yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {linkedFarms.map(({ farm, link }) => (
              <DistanceCard
                key={farm.id}
                restaurant={selectedRestaurant}
                farm={farm}
                link={link}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">Restaurants</h1>
        <p className="text-muted-foreground">Discover farm-to-table restaurants and their local sourcing.</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, city, or cuisine..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No restaurants found</p>
          <p className="text-sm mt-1">Try a different search or <Link to="/Admin" className="text-primary hover:underline">add one</Link></p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              farmCount={links.filter(l => l.restaurant_id === r.id).length}
              onClick={() => setSelectedRestaurant(r)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
