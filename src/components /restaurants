import { MapPin, ExternalLink, Utensils } from 'lucide-react';

export default function RestaurantCard({ restaurant, farmCount, onClick, isSelected }) {
  return (
    <div
      onClick={onClick}
      className={`bg-card border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-border hover:border-primary/40'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Utensils className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{restaurant.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{restaurant.city}, {restaurant.state}</span>
          </div>
          {restaurant.cuisine && (
            <span className="inline-block text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full mt-1.5">
              {restaurant.cuisine}
            </span>
          )}
        </div>
        {farmCount > 0 && (
          <div className="flex-shrink-0 text-center">
            <div className="text-lg font-bold text-primary">{farmCount}</div>
            <div className="text-xs text-muted-foreground">farm{farmCount !== 1 ? 's' : ''}</div>
          </div>
        )}
      </div>
      {restaurant.description && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{restaurant.description}</p>
      )}
      {restaurant.website && (
        <a
          href={restaurant.website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs text-primary mt-2 hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          Website
        </a>
      )}
    </div>
  );
}
