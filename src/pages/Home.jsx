import { Link } from 'react-router-dom';
import { Leaf, Map, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div
        className="relative min-h-[70vh] flex items-center justify-center text-center px-4"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(20,50,30,0.6), rgba(20,50,30,0.7)), url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-6 h-6 text-green-300" />
            <span className="text-green-300 text-sm font-medium tracking-widest uppercase">Farm Trail</span>
          </div>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Know Your Food's Journey
          </h1>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Explore how farm-to-table restaurants connect with local farms. See the real distance your food travels from field to fork.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
              <Link to="/Map">
                <Map className="w-5 h-5 mr-2" />
                Explore the Map
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/Restaurants">
                <Search className="w-5 h-5 mr-2" />
                Browse Restaurants
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="font-playfair text-3xl font-bold text-center text-foreground mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🔍',
              title: 'Search a Restaurant',
              desc: 'Find any farm-to-table restaurant and see which local farms supply their ingredients.',
            },
            {
              icon: '🗺️',
              title: 'Visualize the Route',
              desc: 'See the exact path food travels on an interactive map with distance and drive time.',
            },
            {
              icon: '🌱',
              title: 'Understand Sourcing',
              desc: 'Learn what specific ingredients come from each farm, including certifications.',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-primary-foreground py-16 text-center px-4">
        <TrendingUp className="w-10 h-10 mx-auto mb-4 opacity-80" />
        <h2 className="font-playfair text-3xl font-bold mb-3">Want to add your restaurant or farm?</h2>
        <p className="text-primary-foreground/80 mb-6">Help grow the database with open-source and manual data.</p>
        <Button asChild size="lg" variant="secondary" className="font-semibold">
          <Link to="/Admin">Add Data</Link>
        </Button>
      </div>
    </div>
  );
}
