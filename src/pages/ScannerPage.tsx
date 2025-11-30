import React from 'react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const ScannerPage: React.FC = () => {
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanResult, setScanResult] = React.useState<'success' | 'error' | null>(null);
  const [ticketInfo, setTicketInfo] = React.useState<any>(null);

  const handleScan = () => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate scan
    setTimeout(() => {
      const isValid = Math.random() > 0.3;
      setScanResult(isValid ? 'success' : 'error');
      setIsScanning(false);

      if (isValid) {
        setTicketInfo({
          id: 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          event: 'Festival Dakar Music',
          holder: 'Amadou Diallo',
          type: 'VIP',
          date: '15 Déc 2025',
        });
      }
    }, 2000);
  };

  const resetScan = () => {
    setScanResult(null);
    setTicketInfo(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Scanner de billets</h1>
          <p className="text-muted-foreground">
            Scannez les QR codes pour valider l'entrée
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            {/* Camera Simulation */}
            <div className="relative aspect-square bg-black rounded-lg overflow-hidden mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                {!isScanning && !scanResult && (
                  <Camera className="h-24 w-24 text-white/20" />
                )}
                {isScanning && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-48 h-48 border-4 border-primary rounded-lg"
                  />
                )}
                {scanResult === 'success' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-500 rounded-full p-8"
                  >
                    <CheckCircle className="h-24 w-24 text-white" />
                  </motion.div>
                )}
                {scanResult === 'error' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-red-500 rounded-full p-8"
                  >
                    <XCircle className="h-24 w-24 text-white" />
                  </motion.div>
                )}
              </div>

              {/* Scan Frame */}
              {!scanResult && (
                <div className="absolute inset-0 p-12">
                  <div className="w-full h-full border-4 border-dashed border-primary/50 rounded-lg" />
                </div>
              )}
            </div>

            {/* Result */}
            {scanResult && ticketInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={scanResult === 'success' ? 'border-green-500' : 'border-red-500'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {scanResult === 'success' ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          Billet valide
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          Billet invalide
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Billet</span>
                      <span className="font-mono font-semibold">{ticketInfo.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Événement</span>
                      <span className="font-semibold">{ticketInfo.event}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Titulaire</span>
                      <span className="font-semibold">{ticketInfo.holder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <Badge>{ticketInfo.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {scanResult === 'error' && !ticketInfo && (
              <div className="text-center">
                <p className="text-red-500 font-semibold mb-2">Erreur de scan</p>
                <p className="text-sm text-muted-foreground">
                  Le billet n'est pas valide ou a déjà été utilisé
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              {!scanResult ? (
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleScan}
                  disabled={isScanning}
                >
                  {isScanning ? 'Scan en cours...' : 'Scanner un billet'}
                </Button>
              ) : (
                <Button className="flex-1" size="lg" onClick={resetScan}>
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Scanner un autre billet
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">142</p>
              <p className="text-sm text-muted-foreground">Scans aujourd'hui</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-500">138</p>
              <p className="text-sm text-muted-foreground">Validés</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-500">4</p>
              <p className="text-sm text-muted-foreground">Rejetés</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScannerPage;
