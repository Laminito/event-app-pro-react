# Intégration API - Event App Pro

## 📋 Structure des fichiers créés

```
src/
├── config/
│   └── api.ts                    # Configuration Axios avec intercepteurs
├── services/
│   ├── index.ts                  # Export de tous les services
│   ├── authService.ts            # Authentification (login, register, logout)
│   ├── eventService.ts           # Événements publics
│   ├── ticketService.ts          # Gestion des billets
│   ├── userService.ts            # Profil utilisateur
│   ├── orderService.ts           # Commandes
│   ├── organizerService.ts       # Espace organisateur
│   └── paymentService.ts         # Paiements
├── context/
│   └── AuthContext.tsx           # Context d'authentification
└── hooks/
    └── useApi.ts                 # Hook personnalisé pour les appels API
```

## 🚀 Configuration

### 1. Fichier .env
Créez un fichier `.env` à la racine du projet :

```bash
VITE_API_URL=http://localhost:5000/api/v1
```

Pour la production :
```bash
VITE_API_URL=https://api.eventapppro.sn/v1
```

### 2. Wrapper AuthProvider
Enveloppez votre application avec `AuthProvider` dans `main.tsx` :

```tsx
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

## 📖 Utilisation des Services

### Authentification

```tsx
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login, user, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
      // Redirection automatique après succès
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Bienvenue {user?.name}</p>
      ) : (
        <button onClick={handleLogin}>Se connecter</button>
      )}
    </div>
  );
}
```

### Événements

```tsx
import { eventService } from '../services';
import { useApiQuery } from '../hooks/useApi';

function EventList() {
  const { data, isLoading, error } = useApiQuery(
    () => eventService.getEvents({ category: 'Concert', limit: 10 })
  );

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div>
      {data?.events.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  );
}
```

### Billets

```tsx
import { ticketService } from '../services';
import { useApi } from '../hooks/useApi';

function PurchaseTickets() {
  const { execute, isLoading } = useApi(ticketService.purchaseTickets);

  const handlePurchase = async () => {
    const result = await execute({
      reservationId: 'res-123',
      paymentMethod: 'wave',
      customerInfo: {
        name: 'Amadou Diallo',
        email: 'amadou@example.com',
        phone: '+221771234567',
      },
    });

    if (result) {
      // Rediriger vers la page de paiement
      window.location.href = result.order.paymentUrl;
    }
  };

  return (
    <button onClick={handlePurchase} disabled={isLoading}>
      {isLoading ? 'Traitement...' : 'Acheter'}
    </button>
  );
}
```

### Organisateur

```tsx
import { organizerService } from '../services';
import { useApiQuery } from '../hooks/useApi';

function OrganizerDashboard() {
  const { data: stats, isLoading } = useApiQuery(
    () => organizerService.getDashboardStats()
  );

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Revenus totaux: {stats?.totalRevenue} FCFA</h1>
      <p>Événements: {stats?.totalEvents}</p>
      <p>Billets vendus: {stats?.totalTickets}</p>
    </div>
  );
}
```

### Profil utilisateur

```tsx
import { userService } from '../services';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { updateUser } = useAuth();

  const handleUpdate = async () => {
    const updatedUser = await userService.updateProfile({
      name: 'Nouveau Nom',
      phone: '+221771234567',
    });

    updateUser(updatedUser); // Met à jour le context
  };

  return <button onClick={handleUpdate}>Mettre à jour</button>;
}
```

## 🔐 Gestion de l'authentification

### Token JWT
Le token est automatiquement :
- Stocké dans `localStorage` après login/register
- Ajouté aux headers de toutes les requêtes via l'intercepteur Axios
- Supprimé lors du logout ou expiration (401)

### Redirection automatique
Si le token expire (401), l'utilisateur est automatiquement redirigé vers `/login`.

## 🛡️ Gestion des erreurs

Les erreurs sont gérées globalement par l'intercepteur Axios :

```typescript
// Les erreurs sont automatiquement loguées en console
// Vous pouvez les gérer individuellement dans vos composants

try {
  await eventService.getEvents();
} catch (error) {
  if (error.response?.status === 404) {
    console.log('Événement non trouvé');
  }
}
```

## 📊 Hook useApi

### useApi - Appels manuels
```tsx
const { data, isLoading, error, execute } = useApi(eventService.getEventById);

// Appeler manuellement
const loadEvent = async () => {
  await execute('event-id-123');
};
```

### useApiQuery - Chargement automatique
```tsx
// Se charge automatiquement au montage du composant
const { data, isLoading, error } = useApiQuery(
  () => eventService.getEvents({ featured: true }),
  [] // Dependencies
);
```

## 🔄 Upload de fichiers

```tsx
// Upload d'image d'événement
const uploadImage = async (file: File) => {
  const imageUrl = await organizerService.uploadEventImage(file);
  console.log('Image uploadée:', imageUrl);
};

// Upload d'avatar
const uploadAvatar = async (file: File) => {
  const avatarUrl = await userService.uploadAvatar(file);
  console.log('Avatar uploadé:', avatarUrl);
};
```

## 💳 Paiements

```tsx
import { paymentService } from '../services';

const initiatePayment = async () => {
  const payment = await paymentService.initiatePayment({
    orderId: 'order-123',
    method: 'wave',
    phone: '+221771234567',
  });

  // Rediriger vers la page de paiement
  window.location.href = payment.paymentUrl;
};

// Vérifier le statut
const checkPayment = async (paymentId: string) => {
  const status = await paymentService.getPaymentStatus(paymentId);
  console.log('Statut:', status.status);
};
```

## 🔍 Filtrage et recherche

```tsx
// Recherche d'événements avec filtres
const searchEvents = async () => {
  const result = await eventService.getEvents({
    search: 'concert',
    category: 'Concert',
    location: 'Dakar',
    minPrice: 5000,
    maxPrice: 50000,
    featured: true,
    sort: 'date',
    page: 1,
    limit: 20,
  });

  console.log('Événements trouvés:', result.events.length);
  console.log('Total:', result.pagination.total);
};
```

## ✅ Checklist d'intégration

- [x] Axios installé
- [x] Configuration API avec intercepteurs
- [x] Services pour tous les endpoints
- [x] Context d'authentification
- [x] Hooks personnalisés (useApi, useApiQuery)
- [x] Gestion automatique des tokens
- [x] Gestion des erreurs globale
- [x] Support du multipart/form-data (uploads)
- [x] Fichier .env pour configuration

## 🎯 Prochaines étapes

1. Créer les pages de login/register avec formulaires
2. Implémenter les routes protégées avec AuthGuard
3. Remplacer les données mockées par les appels API réels
4. Ajouter des loaders et états de chargement
5. Gérer les messages d'erreur utilisateur
6. Implémenter le refresh token automatique

## 📝 Exemple complet

```tsx
import React from 'react';
import { useAuth } from './context/AuthContext';
import { eventService } from './services';
import { useApiQuery } from './hooks/useApi';

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  
  const { data, isLoading } = useApiQuery(
    () => eventService.getFeaturedEvents(),
    []
  );

  return (
    <div>
      {isAuthenticated && (
        <div>
          <p>Bienvenue {user?.name}</p>
          <button onClick={logout}>Déconnexion</button>
        </div>
      )}

      <h1>Événements à la une</h1>
      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        <div>
          {data?.map(event => (
            <div key={event.id}>{event.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**🎉 L'intégration API est complète et prête à l'emploi !**
