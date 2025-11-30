import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Share2, CheckCircle, Calendar, MapPin, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useOrderStore } from '../store';
import { formatPrice, formatDate } from '../utils/helpers';

const TicketPage: React.FC = () => {
  const navigate = useNavigate();
  const orders = useOrderStore((state) => state.orders);
  const latestOrder = orders[orders.length - 1];

  if (!latestOrder) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Aucun billet trouvé</h1>
          <Button onClick={() => navigate('/events')}>
            Voir les événements
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleDownload = () => {
    // Simulate download
    alert('Téléchargement du billet...');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Billet - ${latestOrder.eventTitle}`,
        text: `J'ai réservé mon billet pour ${latestOrder.eventTitle}!`,
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto mb-8 text-center"
        >
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Paiement réussi !</h1>
            <p className="text-muted-foreground">
              Votre billet a été envoyé par email et est disponible ci-dessous
            </p>
          </div>
        </motion.div>

        {/* E-Ticket */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-primary to-purple-600 p-6 text-primary-foreground">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    E-TICKET
                  </Badge>
                  <h2 className="text-2xl font-bold">{latestOrder.eventTitle}</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-80">Commande</p>
                  <p className="font-mono font-semibold">{latestOrder.id}</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* QR Code */}
              <div className="flex justify-center py-6 bg-white rounded-lg">
                <QRCodeSVG
                  value={latestOrder.id}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>

              {/* Event Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">{formatDate(latestOrder.eventDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Titulaire</p>
                      <p className="font-semibold">Votre Nom</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Lieu</p>
                      <p className="font-semibold">Voir détails événement</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tickets */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Vos billets</h3>
                <div className="space-y-3">
                  {latestOrder.tickets.map((ticket, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{ticket.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantité: {ticket.quantity}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(ticket.price * ticket.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-lg font-semibold">Total payé</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(latestOrder.total)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>

              {/* Important Info */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-sm">ℹ️ Informations importantes</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Présentez ce QR code à l'entrée</li>
                  <li>• Arrivez 30 minutes avant le début</li>
                  <li>• Une pièce d'identité peut être demandée</li>
                  <li>• Le billet est nominatif et non transférable</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="mt-6 flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/events')}
              className="flex-1"
            >
              Découvrir d'autres événements
            </Button>
            <Button
              onClick={() => navigate('/purchase-history')}
              className="flex-1"
            >
              Voir mon historique
            </Button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default TicketPage;
