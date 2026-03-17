import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Trash2, Link } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function RestaurantForm({ onSuccess }) {
  const [form, setForm] = useState({ name: '', address: '', city: '', state: '', lat: '', lng: '', cuisine: '', website: '', description: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.Restaurant.create({ ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng) });
    toast.success('Restaurant added!');
    setForm({ name: '', address: '', city: '', state: '', lat: '', lng: '', cuisine: '', website: '', description: '' });
    setLoading(false);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Restaurant Name *</Label>
          <Input value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div className="col-span-2">
          <Label>Address</Label>
          <Input value={form.address} onChange={e => set('address', e.target.value)} />
        </div>
        <div>
          <Label>City</Label>
          <Input value={form.city} onChange={e => set('city', e.target.value)} />
        </div>
        <div>
          <Label>State</Label>
          <Input value={form.state} onChange={e => set('state', e.target.value)} />
        </div>
        <div>
          <Label>Latitude *</Label>
          <Input type="number" step="any" value={form.lat} onChange={e => set('lat', e.target.value)} required placeholder="e.g. 40.7128" />
        </div>
        <div>
          <Label>Longitude *</Label>
          <Input type="number" step="any" value={form.lng} onChange={e => set('lng', e.target.value)} required placeholder="e.g. -74.0060" />
        </div>
        <div>
          <Label>Cuisine Type</Label>
          <Input value={form.cuisine} onChange={e => set('cuisine', e.target.value)} placeholder="e.g. American, Italian" />
        </div>
        <div>
          <Label>Website</Label>
          <Input type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://" />
        </div>
        <div className="col-span-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Adding...' : 'Add Restaurant'}
      </Button>
    </form>
  );
}

function FarmForm({ onSuccess }) {
  const [form, setForm] = useState({ name: '', address: '', city: '', state: '', lat: '', lng: '', website: '', description: '' });
  const [produce, setProduce] = useState('');
  const [produceList, setProduceList] = useState([]);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addProduce = () => {
    if (produce.trim()) { setProduceList(p => [...p, produce.trim()]); setProduce(''); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.Farm.create({ ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng), produce_types: produceList });
    toast.success('Farm added!');
    setForm({ name: '', address: '', city: '', state: '', lat: '', lng: '', website: '', description: '' });
    setProduceList([]);
    setLoading(false);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Farm Name *</Label>
          <Input value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div className="col-span-2">
          <Label>Address</Label>
          <Input value={form.address} onChange={e => set('address', e.target.value)} />
        </div>
        <div>
          <Label>City</Label>
          <Input value={form.city} onChange={e => set('city', e.target.value)} />
        </div>
        <div>
          <Label>State</Label>
          <Input value={form.state} onChange={e => set('state', e.target.value)} />
        </div>
        <div>
          <Label>Latitude *</Label>
          <Input type="number" step="any" value={form.lat} onChange={e => set('lat', e.target.value)} required placeholder="e.g. 40.7128" />
        </div>
        <div>
          <Label>Longitude *</Label>
          <Input type="number" step="any" value={form.lng} onChange={e => set('lng', e.target.value)} required placeholder="e.g. -74.0060" />
        </div>
        <div className="col-span-2">
          <Label>What do they grow?</Label>
          <div className="flex gap-2 mt-1">
            <Input value={produce} onChange={e => setProduce(e.target.value)} placeholder="e.g. Tomatoes, Herbs"
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addProduce())} />
            <Button type="button" variant="outline" onClick={addProduce}><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {produceList.map((p, i) => (
              <span key={i} className="flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                {p}
                <button type="button" onClick={() => setProduceList(l => l.filter((_, j) => j !== i))}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Adding...' : 'Add Farm'}
      </Button>
    </form>
  );
}

function LinkForm({ restaurants, farms, onSuccess }) {
  const [restaurantId, setRestaurantId] = useState('');
  const [farmId, setFarmId] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    if (ingredient.trim()) { setIngredients(i => [...i, ingredient.trim()]); setIngredient(''); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.FarmRestaurantLink.create({ restaurant_id: restaurantId, farm_id: farmId, ingredients, notes });
    toast.success('Link created!');
    setRestaurantId(''); setFarmId(''); setIngredients([]); setNotes('');
    setLoading(false);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <Label>Restaurant *</Label>
        <Select value={restaurantId} onValueChange={setRestaurantId} required>
          <SelectTrigger><SelectValue placeholder="Select restaurant" /></SelectTrigger>
          <SelectContent>
            {restaurants.map(r => <SelectItem key={r.id} value={r.id}>{r.name} — {r.city}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Farm *</Label>
        <Select value={farmId} onValueChange={setFarmId} required>
          <SelectTrigger><SelectValue placeholder="Select farm" /></SelectTrigger>
          <SelectContent>
            {farms.map(f => <SelectItem key={f.id} value={f.id}>{f.name} — {f.city}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Ingredients Sourced</Label>
        <div className="flex gap-2 mt-1">
          <Input value={ingredient} onChange={e => setIngredient(e.target.value)} placeholder="e.g. Arugula, Basil"
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIngredient())} />
          <Button type="button" variant="outline" onClick={addIngredient}><Plus className="w-4 h-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {ingredients.map((ing, i) => (
            <span key={i} className="flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
              {ing}
              <button type="button" onClick={() => setIngredients(l => l.filter((_, j) => j !== i))}>
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Any additional details..." />
      </div>
      <Button type="submit" disabled={loading || !restaurantId || !farmId} className="w-full">
        {loading ? 'Linking...' : 'Link Farm to Restaurant'}
      </Button>
    </form>
  );
}

export default function Admin() {
  const queryClient = useQueryClient();

  const { data: restaurants = [] } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => base44.entities.Restaurant.list(),
  });

  const { data: farms = [] } = useQuery({
    queryKey: ['farms'],
    queryFn: () => base44.entities.Farm.list(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    queryClient.invalidateQueries({ queryKey: ['farms'] });
    queryClient.invalidateQueries({ queryKey: ['links'] });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">Add Data</h1>
        <p className="text-muted-foreground">Manually enter restaurants, farms, and their sourcing connections.</p>
      </div>

      <Tabs defaultValue="restaurant">
        <TabsList className="mb-6">
          <TabsTrigger value="restaurant">🍽️ Restaurant</TabsTrigger>
          <TabsTrigger value="farm">🌾 Farm</TabsTrigger>
          <TabsTrigger value="link">🔗 Link</TabsTrigger>
        </TabsList>
        <TabsContent value="restaurant">
          <h2 className="font-semibold text-lg mb-4 text-foreground">Add a Restaurant</h2>
          <RestaurantForm onSuccess={invalidate} />
        </TabsContent>
        <TabsContent value="farm">
          <h2 className="font-semibold text-lg mb-4 text-foreground">Add a Farm</h2>
          <FarmForm onSuccess={invalidate} />
        </TabsContent>
        <TabsContent value="link">
          <h2 className="font-semibold text-lg mb-4 text-foreground">Link a Farm to a Restaurant</h2>
          {restaurants.length === 0 || farms.length === 0 ? (
            <p className="text-muted-foreground text-sm">You need at least one restaurant and one farm to create a link.</p>
          ) : (
            <LinkForm restaurants={restaurants} farms={farms} onSuccess={invalidate} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
