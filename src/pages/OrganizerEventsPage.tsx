import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { mockEvents } from '../data/mockData';
import { formatPrice, formatShortDate } from '../utils/helpers';

const OrganizerEventsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const myEvents = mockEvents;

  const filteredEvents = myEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      // Simulate delete
      alert(`Événement ${id} supprimé`);
    }
  };

  const statusColors = {
    upcoming: 'default',
    ongoing: 'secondary',
    completed: 'outline',
    cancelled: 'destructive',
  } as const;

  const statusLabels = {
    upcoming: 'À venir',
    ongoing: 'En cours',
    completed: 'Terminé',
    cancelled: 'Annulé',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes événements</h1>
            <p className="text-muted-foreground">
              Gérez et suivez vos {filteredEvents.length} événements
            </p>
          </div>
          <Link to="/organizer/events/create">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Créer un événement
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un événement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Events Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Événement</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                    <th className="text-left p-4 font-semibold">Statut</th>
                    <th className="text-left p-4 font-semibold">Billets</th>
                    <th className="text-left p-4 font-semibold">Revenus</th>
                    <th className="text-right p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event, index) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold line-clamp-1">{event.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {event.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">{formatShortDate(event.date)}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </td>
                      <td className="p-4">
                        <Badge variant={statusColors[event.status]}>
                          {statusLabels[event.status]}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium">
                          {event.sold} / {event.capacity}
                        </p>
                        <div className="w-24 bg-muted rounded-full h-1.5 mt-1">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${(event.sold / event.capacity) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">
                          {formatPrice(event.sold * event.price)}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Link to={`/events/${event.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Aucun événement trouvé</p>
            <Button onClick={() => setSearchQuery('')}>Réinitialiser</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrganizerEventsPage;
