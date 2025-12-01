import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Share2,
  Heart,
  Minus,
  Plus,
  ArrowLeft,
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { formatPrice, formatDate } from '../utils/helpers';
import { useCartStore } from '../store';
import { eventService } from '../services';
import { Event } from '../types';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [standardQuantity, setStandardQuantity] = React.useState(1);
  const [vipQuantity, setVipQuantity] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const eventData = await eventService.getEventById(id);
        setEvent(eventData);
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Erreur lors du chargement de l\'événement');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !event) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Événement non trouvé</h1>
          <p className="text-muted-foreground mb-6">{error || 'Cet événement n\'existe pas ou a été supprimé.'}</p>
          <Button onClick={() => navigate('/events')}>
            Retour aux événements
          </Button>
        </div>
      </MainLayout>
    );
  }

  const total =
    standardQuantity * event.price + vipQuantity * (event.vipPrice || 0);

  const handleAddToCart = () => {
    if (standardQuantity > 0 || vipQuantity > 0) {
      addToCart({
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        eventImage: event.image,
        standardQuantity,
        vipQuantity,
        standardPrice: event.price,
        vipPrice: event.vipPrice || 0,
      });
      navigate('/checkout');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-96 rounded-lg overflow-hidden"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </Button>
                <Button variant="secondary" size="icon" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4">
                <Badge className="text-lg px-4 py-2">{event.category}</Badge>
              </div>
            </motion.div>

            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Heure</p>
                    <p className="font-semibold">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lieu</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Organisateur</p>
                    <p className="font-semibold">{event.organizer}</p>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-4">À propos de l'événement</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Booking */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-20"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Réserver vos billets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Availability */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Disponibilité</span>
                      <span className="font-semibold">
                        {event.capacity - event.sold} / {event.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${((event.capacity - event.sold) / event.capacity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Standard Ticket */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Billet Standard</p>
                        <p className="text-lg text-primary font-bold">
                          {formatPrice(event.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setStandardQuantity(Math.max(0, standardQuantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {standardQuantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setStandardQuantity(standardQuantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* VIP Ticket */}
                  {event.vipPrice && (
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold flex items-center gap-2">
                            Billet VIP
                            <Badge variant="secondary">Premium</Badge>
                          </p>
                          <p className="text-lg text-primary font-bold">
                            {formatPrice(event.vipPrice)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setVipQuantity(Math.max(0, vipQuantity - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">
                            {vipQuantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setVipQuantity(vipQuantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-4">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(total)}
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={standardQuantity === 0 && vipQuantity === 0}
                    >
                      Continuer vers le paiement
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Paiement sécurisé • Billets envoyés par email
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EventDetailsPage;
