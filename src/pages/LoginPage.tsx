import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  // Mode démo - connexion rapide avec simulation de données complètes
  const handleDemoLogin = async (role: 'user' | 'organizer') => {
    setLoading(true);
    setError('');
    
    try {
      // Simuler une connexion avec données de démo
      const demoUser = {
        id: role === 'user' ? 'demo-user-001' : 'demo-org-001',
        name: role === 'user' ? 'Amadou Diallo' : 'Karim Faye',
        email: role === 'user' ? 'user@demo.com' : 'organizer@demo.com',
        phone: role === 'user' ? '+221 77 123 45 67' : '+221 76 987 65 43',
        role: role,
        avatar: undefined,
        location: role === 'user' ? 'Dakar, Sénégal' : 'Thiès, Sénégal',
        birthdate: role === 'user' ? '2000-11-28T00:00:00.000Z' : '1985-03-15T00:00:00.000Z',
      };
      
      const demoToken = 'demo-token-' + Math.random().toString(36).substr(2, 9);
      
      localStorage.setItem('auth_token', demoToken);
      localStorage.setItem('auth_user', JSON.stringify(demoUser));
      
      // Forcer le rechargement pour mettre à jour le contexte
      window.location.href = from;
    } catch (err) {
      setError('Erreur lors de la connexion démo');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
          <Logo size="xl" />
          <span className="text-2xl font-bold">Hello Ticket</span>
        </Link>

        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Connexion</h1>
              <p className="text-muted-foreground">
                Connectez-vous à votre compte
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {location.state?.expired && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-500">
                  Votre session a expiré. Veuillez vous reconnecter.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-muted-foreground">Se souvenir de moi</span>
                </label>
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">
                    Mode démo
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('user')}
                >
                  👤 Utilisateur
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('organizer')}
                >
                  💼 Organisateur
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                S'inscrire
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          En vous connectant, vous acceptez nos{' '}
          <Link to="/legal" className="text-primary hover:underline">
            conditions d'utilisation
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
