import React from 'react';
import { Package, TrendingUp, User, ActivitySquare } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ShipmentChart from '@/components/dashboard/ShipmentChart';
import StatusSummary from '@/components/dashboard/StatusSummary';
import QuickActions from '@/components/dashboard/QuickActions';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Pengiriman Hari Ini"
          value="24"
          icon={<Package className="h-8 w-8" />}
          trend={8}
        />
        <StatCard 
          title="Paket Dalam Perjalanan"
          value="42"
          icon={<TrendingUp className="h-8 w-8" />}
          trend={-3}
        />
        <StatCard 
          title="Kurir Aktif"
          value="8"
          icon={<User className="h-8 w-8" />}
          description="Dari total 12 kurir"
        />
        <StatCard 
          title="Total Bulan Ini"
          value="342"
          icon={<ActivitySquare className="h-8 w-8" />}
          trend={14}
          trendLabel="dibanding bulan lalu"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ShipmentChart />
        </div>
        <div className="space-y-6">
          <StatusSummary />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
