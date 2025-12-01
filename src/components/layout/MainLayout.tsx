import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, User, ShoppingCart, Search, LogOut, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { useCartStore } from '../../store';
import { useAuth } from '../../context/AuthContext';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/events', label: 'Événements' },
    { to: '/blog', label: 'Blog' },
  ];

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.standardQuantity + item.vipQuantity,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Event App Pro</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.to
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/search">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/checkout" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/profile">
                    <Button variant="ghost" size="icon" title={user?.name}>
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  {(user?.role === 'organizer' || user?.role === 'admin') && (
                    <Link to="/organizer">
                      <Button>Espace Organisateur</Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="icon" onClick={handleLogout} title="Déconnexion">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">
                      <LogIn className="h-4 w-4 mr-2" />
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button>S'inscrire</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
            >
              <nav className="container mx-auto px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-sm font-medium hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t space-y-2">
                  <Link to="/checkout" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Panier ({totalItems})
                    </Button>
                  </Link>
                  
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <User className="h-4 w-4 mr-2" />
                          Mon Profil
                        </Button>
                      </Link>
                      {(user?.role === 'organizer' || user?.role === 'admin') && (
                        <Link to="/organizer" onClick={() => setIsMenuOpen(false)}>
                          <Button className="w-full">Espace Organisateur</Button>
                        </Link>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <LogIn className="h-4 w-4 mr-2" />
                          Connexion
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full">S'inscrire</Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Event App Pro</span>
              </div>
              <p className="text-sm text-muted-foreground">
                La plateforme événementielle #1 au Sénégal
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Événements</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/events?category=Concert" className="hover:text-foreground">Concerts</Link></li>
                <li><Link to="/events?category=Conférence" className="hover:text-foreground">Conférences</Link></li>
                <li><Link to="/events?category=Sport" className="hover:text-foreground">Sport</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link to="/organizer" className="hover:text-foreground">Devenir organisateur</Link></li>
                <li><Link to="/legal" className="hover:text-foreground">Mentions légales</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><Link to="/settings" className="hover:text-foreground">Paramètres</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Event App Pro. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
