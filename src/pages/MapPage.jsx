import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Leaf } from 'lucide-react';
import { Input } from '@/components/ui/input';
import FarmTrailMap from '@/components/map/FarmTrailMap';
import DistanceCard from '@/components/map/DistanceCard';
import RestaurantCard from '@/components/restaurants/RestaurantCard';

export default function MapPage() {
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
    r.city?.toLowerCase().includes(search.toLowerCase())
  );

  const linkedFarms = selectedRestaurant
    ? links
        .filter(l => l.restaurant_id === selectedRestaurant.id)
        .map(l => ({ farm: farms.find(f => f.id === l.farm_id), link: l }))
        .filter(({ farm }) => farm)
    : [];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col border-r border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search restaurants or city..."
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
        </div>

        <div className="flex-1 overflow-y-auto">
          {!selectedRestaurant ? (
            <div className="p-3 space-y-2">
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No restaurants found
                </div>
              )}
              {filtered.map(r => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  farmCount={links.filter(l => l.restaurant_id === r.id).length}
                  onClick={() => setSelectedRestaurant(r)}
                  isSelected={selectedRestaurant?.id === r.id}
                />
              ))}
            </div>
          ) : (
            <div className="p-4">
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <X className="w-4 h-4" /> Back to all
              </button>

              <div className="mb-4">
                <h2 className="font-playfair text-xl font-bold text-foreground">{selectedRestaurant.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedRestaurant.city}, {selectedRestaurant.state}</p>
                {selectedRestaurant.description && (
                  <p className="text-sm text-muted-foreground mt-1">{selectedRestaurant.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {linkedFarms.length} Farm Source{linkedFarms.length !== 1 ? 's' : ''}
                </span>
              </div>

              {linkedFarms.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No farm sources linked yet.</p>
              )}

              <div className="space-y-3">
                {linkedFarms.map(({ farm, link }) => (
                  <DistanceCard
                    key={farm.id}
                    restaurant={selectedRestaurant}
                    farm={farm}
                    link={link}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 h-64 md:h-full">
        <FarmTrailMap
          restaurants={filtered}
          farms={farms}
          links={links}
          selectedRestaurant={selectedRestaurant}
          onRestaurantClick={setSelectedRestaurant}
        />
      </div>
    </div>
  );
}
