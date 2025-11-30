import React from 'react';
import { Search } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const OrganizerTicketsPage: React.FC = () => {
  const tickets = [
    { id: 'TKT-001', event: 'Festival Dakar Music', holder: 'Amadou Diallo', type: 'VIP', status: 'valid' },
    { id: 'TKT-002', event: 'Tech Summit', holder: 'Fatou Sow', type: 'Standard', status: 'used' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestion des billets</h1>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Rechercher un billet..." className="pl-10" />
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">Événement</th>
                  <th className="text-left p-4">Titulaire</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-muted/30">
                    <td className="p-4 font-mono text-sm">{ticket.id}</td>
                    <td className="p-4">{ticket.event}</td>
                    <td className="p-4">{ticket.holder}</td>
                    <td className="p-4"><Badge>{ticket.type}</Badge></td>
                    <td className="p-4">
                      <Badge variant={ticket.status === 'valid' ? 'default' : 'secondary'}>
                        {ticket.status === 'valid' ? 'Valide' : 'Utilisé'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerTicketsPage;
