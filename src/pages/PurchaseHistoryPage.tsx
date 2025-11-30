import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useOrderStore } from '../store';
import { formatPrice, formatShortDate } from '../utils/helpers';

const PurchaseHistoryPage: React.FC = () => {
  const orders = useOrderStore((state) => state.orders);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Historique des achats</h1>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{order.eventTitle}</h3>
                      <p className="text-sm text-muted-foreground">
                        Commande #{order.id}
                      </p>
                    </div>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status === 'completed' ? 'Payé' : order.status}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatShortDate(order.eventDate)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Acheté le {formatShortDate(order.purchaseDate)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      {order.tickets.map((ticket, i) => (
                        <span key={i} className="text-sm text-muted-foreground mr-3">
                          {ticket.quantity}x {ticket.type}
                        </span>
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold text-primary">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">Aucun achat pour le moment</p>
              <Link to="/events" className="text-primary hover:underline">
                Découvrir les événements
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default PurchaseHistoryPage;
