import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const LegalPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conditions Générales d'Utilisation</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                En accédant et en utilisant Event App Pro, vous acceptez d'être lié par les présentes
                conditions générales d'utilisation...
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Politique de Confidentialité</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Nous nous engageons à protéger vos données personnelles. Cette politique explique
                comment nous collectons, utilisons et protégeons vos informations...
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Politique de Remboursement</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Les billets achetés sur Event App Pro peuvent être remboursés jusqu'à 48h avant
                l'événement, sous réserve de l'accord de l'organisateur...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default LegalPage;
