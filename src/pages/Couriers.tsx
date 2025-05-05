
import React from 'react';
import CourierList from '@/components/couriers/CourierList';

const Couriers = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-modern-primary to-modern-accent">Manajemen Kurir</h1>
      <CourierList />
    </div>
  );
};

export default Couriers;
