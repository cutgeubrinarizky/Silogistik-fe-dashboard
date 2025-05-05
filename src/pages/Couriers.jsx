import React from 'react';
import CourierList from '@/components/couriers/CourierList';

const Couriers = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manajemen Kurir</h1>
      <CourierList />
    </div>
  );
};

export default Couriers;
