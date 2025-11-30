import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Smartphone,
  Trash2,
  ArrowRight,
  ShoppingCart,
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useCartStore, useOrderStore } from '../store';
import { formatPrice, formatShortDate } from '../utils/helpers';
import { PaymentMethod } from '../types';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);
  const addOrder = useOrderStore((state) => state.addOrder);

  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('wave');
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = React.useState(false);

  const paymentMethods: { id: PaymentMethod; label: string; icon: any }[] = [
    { id: 'card', label: 'Carte bancaire', icon: CreditCard },
    { id: 'wave', label: 'Wave', icon: Smartphone },
    { id: 'orange-money', label: 'Orange Money', icon: Smartphone },
    { id: 'free-money', label: 'Free Money', icon: Smartphone },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create order
    cartItems.forEach((item) => {
      const tickets = [];
      if (item.standardQuantity > 0) {
        tickets.push({
          type: 'Standard' as const,
          quantity: item.standardQuantity,
          price: item.standardPrice,
        });
      }
      if (item.vipQuantity > 0) {
        tickets.push({
          type: 'VIP' as const,
          quantity: item.vipQuantity,
          price: item.vipPrice,
        });
      }

      addOrder({
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: 'user-1',
        eventId: item.eventId,
        eventTitle: item.eventTitle,
        eventDate: item.eventDate,
        tickets,
        total: item.standardQuantity * item.standardPrice + item.vipQuantity * item.vipPrice,
        paymentMethod,
        status: 'completed',
        purchaseDate: new Date().toISOString(),
      });
    });

    clearCart();
    navigate('/ticket');
  };

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-6">
            Découvrez nos événements et réservez vos billets
          </p>
          <Button onClick={() => navigate('/events')}>
            Voir les événements
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finaliser votre commande</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Informations de contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Nom complet"
                      type="text"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <Input
                      label="Téléphone"
                      type="tel"
                      placeholder="+221 XX XXX XX XX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Mode de paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                            paymentMethod === method.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {paymentMethod !== 'card' && (
                    <div className="mt-4">
                      <Input
                        label="Numéro de téléphone"
                        type="tel"
                        placeholder="+221 XX XXX XX XX"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Vous recevrez une notification pour valider le paiement
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="mt-4 space-y-4">
                      <Input
                        label="Numéro de carte"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Expiration" type="text" placeholder="MM/AA" />
                        <Input label="CVV" type="text" placeholder="123" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-20"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.eventId} className="space-y-3">
                      <div className="flex gap-3">
                        <img
                          src={item.eventImage}
                          alt={item.eventTitle}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm line-clamp-2">
                            {item.eventTitle}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {formatShortDate(item.eventDate)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.eventId)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-sm space-y-1 pl-1">
                        {item.standardQuantity > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {item.standardQuantity}x Standard
                            </span>
                            <span className="font-medium">
                              {formatPrice(item.standardQuantity * item.standardPrice)}
                            </span>
                          </div>
                        )}
                        {item.vipQuantity > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {item.vipQuantity}x VIP
                            </span>
                            <span className="font-medium">
                              {formatPrice(item.vipQuantity * item.vipPrice)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="border-b" />
                    </div>
                  ))}

                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span className="font-medium">{formatPrice(getTotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frais de service</span>
                      <span className="font-medium">Gratuit</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(getTotal())}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      'Traitement en cours...'
                    ) : (
                      <>
                        Payer {formatPrice(getTotal())}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      🔒 Paiement sécurisé
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
