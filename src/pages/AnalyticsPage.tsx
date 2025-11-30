import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatPrice } from '../utils/helpers';

const AnalyticsPage: React.FC = () => {
  const revenueData = [
    { month: 'Jan', revenue: 4500000 },
    { month: 'Fév', revenue: 5200000 },
    { month: 'Mar', revenue: 4800000 },
    { month: 'Avr', revenue: 6100000 },
    { month: 'Mai', revenue: 7200000 },
    { month: 'Jun', revenue: 8500000 },
  ];

  const visitorsData = [
    { day: 'Lun', visitors: 245 },
    { day: 'Mar', visitors: 312 },
    { day: 'Mer', visitors: 289 },
    { day: 'Jeu', visitors: 401 },
    { day: 'Ven', visitors: 532 },
    { day: 'Sam', visitors: 678 },
    { day: 'Dim', visitors: 598 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Statistiques & Analytics</h1>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Revenus ce mois', value: formatPrice(8500000), change: '+23%', icon: DollarSign },
            { label: 'Visiteurs', value: '3,055', change: '+12%', icon: Users },
            { label: 'Taux de conversion', value: '4.8%', change: '+2.1%', icon: TrendingUp },
            { label: 'Événements actifs', value: '12', change: '+3', icon: Calendar },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <Badge variant="secondary">{stat.change}</Badge>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatPrice(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Visitors Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Visiteurs cette semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitorsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
