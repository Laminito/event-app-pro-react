import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  Ticket,
  DollarSign,
  Users,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { mockEvents } from '../data/mockData';
import { formatPrice, formatShortDate } from '../utils/helpers';

const OrganizerDashboard: React.FC = () => {
  const myEvents = mockEvents.slice(0, 5);

  const stats = [
    {
      title: 'Revenus totaux',
      value: formatPrice(15750000),
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Billets vendus',
      value: '23,456',
      change: '+8.2%',
      icon: Ticket,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Événements actifs',
      value: '12',
      change: '+3',
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Participants total',
      value: '45,234',
      change: '+15.3%',
      icon: Users,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Bienvenue sur votre espace organisateur
            </p>
          </div>
          <Link to="/organizer/events/create">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Créer un événement
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.bgColor} p-3 rounded-lg`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Events */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Événements récents</CardTitle>
                  <Link to="/organizer/events">
                    <Button variant="ghost" size="sm">
                      Voir tout
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                            {event.status === 'upcoming' ? 'À venir' : event.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatShortDate(event.date)} • {event.time}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">
                            {event.sold} / {event.capacity} billets
                          </span>
                          <span className="font-semibold text-primary">
                            {formatPrice(event.sold * event.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/organizer/events/create">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel événement
                  </Button>
                </Link>
                <Link to="/organizer/scanner">
                  <Button variant="outline" className="w-full justify-start">
                    <Ticket className="h-4 w-4 mr-2" />
                    Scanner des billets
                  </Button>
                </Link>
                <Link to="/organizer/analytics">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Voir les statistiques
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aide & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">
                  📚 Centre d'aide
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">
                  💬 Contacter le support
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">
                  📖 Documentation API
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerDashboard;
