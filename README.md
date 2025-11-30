# Event APP Pro - Plateforme Événementielle Sénégal

Application web événementielle moderne construite avec React, TypeScript, Tailwind CSS et Framer Motion.

![YOUWARE](https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=400&fit=crop)

## 🚀 Fonctionnalités

### Pack 1 - MVP Public
✅ **Page d'accueil animée** - Hero section, catégories, événements populaires  
✅ **Catalogue d'événements** - Recherche, filtres, pagination  
✅ **Détails événement** - Sélection de billets (Standard/VIP)  
✅ **Paiement** - Carte bancaire, Wave, Orange Money, Free Money  
✅ **E-Ticket** - QR Code, téléchargement, partage  

### Pack 2 - Espace Organisateur
✅ **Dashboard** - Statistiques, revenus, billets vendus  
✅ **Gestion événements** - CRUD complet  
✅ **Création événement** - Formulaire avancé  
✅ **Scanner QR Code** - Validation des billets  
✅ **Profil** - Gestion utilisateur  

### Pack 3 - Application Complète
✅ **Catégories** - Pages dédiées par thématique  
✅ **Historique achats** - Commandes passées  
✅ **Gestion billets** - Table avancée  
✅ **Analytics** - Graphiques Recharts  
✅ **Blog** - Articles et SEO  
✅ **Paramètres** - Notifications, langue  
✅ **Pages légales** - CGU, confidentialité  

## 🛠️ Stack Technique

- **Framework:** React 19 + Vite
- **Langage:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Routing:** React Router DOM v7
- **State Management:** Zustand
- **Icons:** Lucide React
- **Charts:** Recharts
- **QR Code:** qrcode.react

## 📦 Installation

```bash
# Cloner le projet
cd EventApp

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Ouvrir http://localhost:5173
```

## 🏗️ Structure du Projet

```
EventApp/
├── src/
│   ├── components/
│   │   ├── ui/              # Composants réutilisables (Button, Card, Input...)
│   │   └── layout/          # Layouts (MainLayout, DashboardLayout)
│   ├── pages/               # Toutes les pages de l'application
│   │   ├── HomePage.tsx
│   │   ├── EventListPage.tsx
│   │   ├── EventDetailsPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── TicketPage.tsx
│   │   ├── OrganizerDashboard.tsx
│   │   ├── OrganizerEventsPage.tsx
│   │   ├── CreateEventPage.tsx
│   │   ├── ScannerPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── PurchaseHistoryPage.tsx
│   │   ├── OrganizerTicketsPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── BlogListPage.tsx
│   │   ├── BlogDetailsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── LegalPage.tsx
│   ├── store/               # Zustand stores (cart, orders)
│   ├── data/                # Mock data (events, blog posts)
│   ├── types/               # TypeScript types
│   ├── utils/               # Helper functions
│   ├── App.tsx              # Router configuration
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles + Tailwind
├── public/                  # Assets statiques
├── tailwind.config.js       # Configuration Tailwind
├── tsconfig.json            # Configuration TypeScript
└── vite.config.js           # Configuration Vite
```

## 🎨 Design System

### Couleurs
- **Primary:** Purple gradient (#8B5CF6)
- **Secondary:** Blue (#3B82F6)
- **Destructive:** Red (#EF4444)
- **Muted:** Gray (#6B7280)

### Composants UI
Tous les composants suivent le style shadcn/ui:
- Button (variants: default, destructive, outline, secondary, ghost, link)
- Input (avec labels et erreurs)
- Card (Header, Content, Footer)
- Badge (variants: default, secondary, destructive, outline)
- Skeleton (loading states)

## 🔐 Fonctionnalités Clés

### Paiement Mobile Money
Support natif pour les plateformes de paiement sénégalaises:
- 📱 Wave
- 🍊 Orange Money  
- 💚 Free Money
- 💳 Carte bancaire

### Gestion des Billets
- QR Code unique par billet
- Validation en temps réel
- E-mail automatique
- Téléchargement PDF
- Partage social

### Analytics Avancés
- Graphiques de revenus (Recharts)
- Taux de conversion
- Statistiques par événement
- Données en temps réel

## 📱 Responsive Design

L'application est 100% responsive avec une approche mobile-first:
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Navigation mobile avec menu hamburger
- Cartes adaptatives
- Tables scrollables

## 🚀 Déploiement

```bash
# Build de production
npm run build

# Le dossier dist/ contient les fichiers optimisés
```

## 🌐 Routes Disponibles

### Public
- `/` - Page d'accueil
- `/events` - Liste des événements
- `/events/:id` - Détails d'un événement
- `/checkout` - Paiement
- `/ticket` - E-Ticket
- `/blog` - Liste des articles
- `/blog/:id` - Article détaillé
- `/profile` - Profil utilisateur
- `/purchase-history` - Historique
- `/settings` - Paramètres
- `/legal` - Mentions légales

### Organisateur
- `/organizer` - Dashboard
- `/organizer/events` - Gestion événements
- `/organizer/events/create` - Créer un événement
- `/organizer/tickets` - Billets vendus
- `/organizer/scanner` - Scanner QR
- `/organizer/analytics` - Statistiques

## 🎯 Roadmap

- [ ] Authentification (Firebase/Auth0)
- [ ] Paiement réel (Wave API, Orange Money API)
- [ ] Notifications push
- [ ] Système de commentaires
- [ ] Chat en direct
- [ ] Export PDF des rapports
- [ ] Application mobile (React Native)

## 📄 Licence

© 2025 YOUWARE - Tous droits réservés

## 👨‍💻 Développement

Projet développé avec ❤️ pour révolutionner l'événementiel au Sénégal.

---

**Stack:** React 19 • TypeScript • Tailwind CSS • Vite  
**Version:** 1.0.0  
**Dernière mise à jour:** Novembre 2025
