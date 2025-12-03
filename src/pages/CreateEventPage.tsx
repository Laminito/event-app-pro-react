import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { EventCategory } from '../types';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';

const CreateEventPage: React.FC = () => {
    const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Concert' as EventCategory,
    capacity: '',
    image: null,
    featured: false,
    published: true,
  });
  const [tickets, setTickets] = React.useState([
    { type: 'Standard', price: '', quantity: '' },
    { type: 'VIP', price: '', quantity: '' },
  ]);
  const [tags, setTags] = React.useState<string>('');
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    let imageUrl = '';
    try {
      // Upload image si sélectionnée
      if (formData.image) {
        imageUrl = await eventService.uploadEventImage(formData.image);
      }
      // Préparer les tickets avec le champ 'available'
      const ticketsPayload = tickets
        .filter(t => t.price && t.quantity)
        .map(t => ({
          type: t.type,
          price: Number(t.price),
          quantity: Number(t.quantity),
          available: Number(t.quantity)
        }));
      // Préparer les tags
      const tagsPayload = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      // Préparer les données pour l'API
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        image: imageUrl,
        tickets: ticketsPayload,
        tags: tagsPayload,
        organizer: user?.id,
        status: formData.published ? 'published' : 'draft', // Utiliser status au lieu de published
      };
      // Retirer le champ published car le backend utilise status
      delete payload.published;
      
      console.log('📤 Payload envoyé:', payload);
      await eventService.createEvent(payload);
      alert('Événement créé avec succès !');
      navigate('/organizer/events');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Erreur lors de la création de l\'événement');
    } finally {
      setIsLoading(false);
    }
  };

  const categories: EventCategory[] = [
    'Concert',
    'Conférence',
    'Sport',
    'Festival',
    'Théâtre',
    'Formation',
    'Networking',
    'Autre',
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <h1 className="text-3xl font-bold mb-2">Créer un événement</h1>
        <p className="text-muted-foreground mb-8">
          Remplissez les informations pour créer votre événement
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Titre de l'événement"
                type="text"
                placeholder="Ex: Festival Dakar Music 2025"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full min-h-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Décrivez votre événement..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Date & Location */}
          <Card>
            <CardHeader>
              <CardTitle>Date et lieu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
                <Input
                  label="Heure"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Lieu"
                type="text"
                placeholder="Ex: Grand Théâtre National, Dakar"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </CardContent>
          </Card>

          {/* Tickets & Capacity */}
          <Card>
            <CardHeader>
              <CardTitle>Billets & Capacité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  label="Prix Standard (XOF)"
                  type="number"
                  placeholder="15000"
                  value={tickets[0].price}
                  onChange={(e) => setTickets([ { ...tickets[0], price: e.target.value }, tickets[1] ])}
                  required
                />
                <Input
                  label="Quantité Standard"
                  type="number"
                  placeholder="100"
                  value={tickets[0].quantity}
                  onChange={(e) => setTickets([ { ...tickets[0], quantity: e.target.value }, tickets[1] ])}
                  required
                />
                <Input
                  label="Prix VIP (XOF)"
                  type="number"
                  placeholder="35000"
                  value={tickets[1].price}
                  onChange={(e) => setTickets([ tickets[0], { ...tickets[1], price: e.target.value } ])}
                />
                <Input
                  label="Quantité VIP"
                  type="number"
                  placeholder="20"
                  value={tickets[1].quantity}
                  onChange={(e) => setTickets([ tickets[0], { ...tickets[1], quantity: e.target.value } ])}
                />
                <Input
                  label="Capacité"
                  type="number"
                  placeholder="120"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>
          {/* Tags, Featured, Published */}
          <Card>
            <CardHeader>
              <CardTitle>Options avancées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Tags (séparés par des virgules)"
                type="text"
                placeholder="tech, innovation, conférence"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  Mis en avant
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  />
                  Publié
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Image de l'événement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-2"
                  disabled={isLoading}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Aperçu" className="mx-auto mb-2 max-h-40 rounded" />
                )}
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Cliquez ou sélectionnez une image
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG jusqu'à 10MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit & Error */}
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">{error}</div>
          )}
          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer l\'événement'}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)} disabled={isLoading}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateEventPage;
