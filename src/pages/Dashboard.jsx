import React from 'react';
import { Package, TrendingUp, User, ActivitySquare } from 'lucide-react';
import ShipmentChart from '@/components/dashboard/ShipmentChart';
import StatusSummary from '@/components/dashboard/StatusSummary';
import QuickActions from '@/components/dashboard/QuickActions';
import StatusPieChart from '@/components/dashboard/StatusPieChart';

const statCards = [
  {
    icon: <Package className="h-6 w-6 text-[#FF6B2C]" />, 
    label: 'Total Pengiriman Hari Ini', 
    value: 24, 
    sub: '+8 dari kemarin', 
    color: 'bg-gradient-to-br from-[#FF6B2C]/10 to-[#FF6B2C]/5'
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-[#FF6B2C]" />, 
    label: 'Paket Dalam Perjalanan', 
    value: 42, 
    sub: '-3 dari kemarin', 
    color: 'bg-gradient-to-br from-[#FF6B2C]/10 to-[#FF6B2C]/5'
  },
  {
    icon: <User className="h-6 w-6 text-[#FF6B2C]" />, 
    label: 'Kurir Aktif', 
    value: 8, 
    sub: 'Dari total 12 kurir', 
    color: 'bg-gradient-to-br from-[#FF6B2C]/10 to-[#FF6B2C]/5'
  },
  {
    icon: <ActivitySquare className="h-6 w-6 text-[#FF6B2C]" />, 
    label: 'Total Bulan Ini', 
    value: 342, 
    sub: '+14 dibanding bulan lalu', 
    color: 'bg-gradient-to-br from-[#FF6B2C]/10 to-[#FF6B2C]/5'
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0C4A6E] mb-3">
            Dashboard Silogistik
          </h1>
          <p className="text-lg text-[#0C4A6E]/70">
            Solusi Manajemen Pengiriman Modern & Terintegrasi
          </p>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${card.color}`}>
                {card.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#0C4A6E]">{card.value}</span>
                <span className="text-sm font-medium text-[#0C4A6E]/80">{card.label}</span>
                <span className="text-xs text-[#FF6B2C] mt-2 font-medium">{card.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Shipment Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-[#0C4A6E] mb-4">Grafik Pengiriman</h2>
            <ShipmentChart />
          </div>
          
          {/* Status Pie Charts */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-[#0C4A6E] mb-4">Distribusi Status</h2>
            <StatusPieChart />
          </div>
        </div>

        {/* Right Column - Quick Actions & Status Summary */}
        <div className="flex flex-col gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-[#0C4A6E] mb-4">Akses Cepat</h2>
            <QuickActions />
          </div>

          {/* Status Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-[#0C4A6E] mb-4">Ringkasan Status</h2>
            <StatusSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
