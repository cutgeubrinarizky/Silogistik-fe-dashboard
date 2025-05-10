import React from 'react';
import EmployeeList from '@/components/employees/EmployeeList';
import { User } from 'lucide-react';

const Employees = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#FF6B2C]/10">
            <User className="h-6 w-6 text-[#FF6B2C]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0C4A6E]">
              Manajemen Pegawai
            </h1>
            <p className="text-[#0C4A6E]/70 mt-1">
              Kelola semua pegawai Anda dengan mudah dan efisien
            </p>
          </div>
        </div>
      </div>
      <EmployeeList />
    </div>
  );
};

export default Employees;
