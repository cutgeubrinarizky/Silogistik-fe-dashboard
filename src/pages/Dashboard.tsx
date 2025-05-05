
import React from 'react';
import { Package, TrendingUp, User, ActivitySquare } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ShipmentChart from '@/components/dashboard/ShipmentChart';
import StatusSummary from '@/components/dashboard/StatusSummary';
import QuickActions from '@/components/dashboard/QuickActions';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pengiriman Hari Ini"
          value="24"
          icon={<Package size={20} />}
          trend={8}
        />
        <StatCard 
          title="Paket Dalam Perjalanan"
          value="42"
          icon={<TrendingUp size={20} />}
          trend={-3}
        />
        <StatCard 
          title="Kurir Aktif"
          value="8"
          icon={<User size={20} />}
          description="Dari total 12 kurir"
        />
        <StatCard 
          title="Total Bulan Ini"
          value="342"
          icon={<ActivitySquare size={20} />}
          trend={14}
          trendLabel="dibanding bulan lalu"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ShipmentChart />
        <div className="md:col-span-1 space-y-6">
          <StatusSummary />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
