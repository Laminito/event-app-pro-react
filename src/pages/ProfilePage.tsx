import React, { useState, useEffect } from 'react';
import { getAvatarUrl } from '../utils/apiMappers';
import { Camera, Mail, Phone, MapPin, Calendar as CalendarIcon, User as UserIcon, Save, X, Edit, Shield, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  // Fonction helper pour formater la date en yyyy-MM-dd
  const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    birthdate: formatDateForInput(user?.birthdate),
  });

  // Synchroniser formData avec user quand il change
  useEffect(() => {
    if (user) {
      const formattedDate = formatDateForInput(user.birthdate);
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        birthdate: formattedDate,
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Appel API pour mettre à jour le profil
      const updatedUser = await userService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        birthdate: formData.birthdate,
      });

      // Mettre à jour le contexte avec les nouvelles données
      updateUser(updatedUser);
      
      setSuccess('Profil mis à jour avec succès !');
      setIsEditing(false);
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message
        || err.response?.data?.message 
        || err.message 
        || 'Erreur lors de la mise à jour du profil';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      birthdate: formatDateForInput(user?.birthdate),
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleChangePassword = async () => {
    setPasswordError(null);

    // Validations
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Tous les champs sont requis');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caract\u00e8res');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess('Mot de passe chang\u00e9 avec succ\u00e8s !');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Erreur lors du changement de mot de passe'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La taille du fichier ne doit pas dépasser 5MB');
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // L'API retourne l'utilisateur complet avec le nouvel avatar
      const updatedUser = await userService.uploadAvatar(file);
      
      // Mettre à jour le contexte avec l'utilisateur complet
      updateUser(updatedUser);
      
      setSuccess('Photo de profil mise à jour !');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'Erreur lors de l\'upload de la photo');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500">Admin</Badge>;
      case 'organizer':
        return <Badge className="bg-blue-500">Organisateur</Badge>;
      default:
        return <Badge variant="secondary">Utilisateur</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Mon Profil</h1>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier le profil
              </Button>
            )}
          </div>
          
          {/* Messages de succès et d'erreur */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
            >
              {success}
            </motion.div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Photo et infos rapides */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    {user?.avatar ? (
                      <img
                        src={getAvatarUrl(user.avatar)}
                        alt={user.name}
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
                        {getInitials(user?.name || 'U')}
                      </div>
                    )}
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors cursor-pointer">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </div>
                  <h2 className="text-xl font-bold mb-1">{user?.name}</h2>
                  <p className="text-sm text-muted-foreground mb-3">{user?.email}</p>
                  {user?.role && (
                    <div className="flex justify-center mb-4">
                      {getRoleBadge(user.role)}
                    </div>
                  )}
                  <Button
                    className="w-full"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    Changer la photo
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Statistiques utilisateur */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Événements assistés</span>
                    <span className="font-bold text-lg">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Billets achetés</span>
                    <span className="font-bold text-lg">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Favoris</span>
                    <span className="font-bold text-lg">0</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sécurité */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Changer le mot de passe
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    Authentification 2FA
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main content - Formulaire */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Nom complet */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      Nom complet
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Adresse email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      disabled={true}
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      L'email ne peut pas être modifié. Cette adresse est utilisée pour la connexion.
                    </p>
                  </div>

                  {/* Téléphone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Numéro de téléphone
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="+221 77 123 45 67"
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>

                  {/* Localisation */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Localisation
                    </label>
                    <Input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Dakar, Sénégal"
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>

                  {/* Date de naissance */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      Date de naissance
                    </label>
                    <Input
                      type="date"
                      value={formData.birthdate}
                      onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>

                  {/* Boutons d'action */}
                  {isEditing && (
                    <div className="flex gap-4 pt-4 border-t">
                      <Button onClick={handleSave} className="flex-1" disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                      </Button>
                      <Button onClick={handleCancel} variant="outline" className="flex-1" disabled={isLoading}>
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Préférences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Newsletters</p>
                      <p className="text-sm text-muted-foreground">
                        Recevoir les nouveautés et événements à venir
                      </p>
                    </div>
                    <input type="checkbox" className="h-5 w-5 rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifications événements</p>
                      <p className="text-sm text-muted-foreground">
                        Alertes pour les événements que vous suivez
                      </p>
                    </div>
                    <input type="checkbox" className="h-5 w-5 rounded" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Recommandations</p>
                      <p className="text-sm text-muted-foreground">
                        Suggestions personnalisées basées sur vos intérêts
                      </p>
                    </div>
                    <input type="checkbox" className="h-5 w-5 rounded" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal Changement de mot de passe */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Changer le mot de passe
              </h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError(null);
                }}
                className="text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {passwordError && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {passwordError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Mot de passe actuel
                </label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Entrez votre mot de passe actuel"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Nouveau mot de passe
                </label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Minimum 6 caract\u00e8res"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="R\u00e9p\u00e9tez le nouveau mot de passe"
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleChangePassword}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Modification...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Modifier
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError(null);
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default ProfilePage;
