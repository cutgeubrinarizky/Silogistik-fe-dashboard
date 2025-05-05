
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Cari pengiriman, kurir..."
            className="pl-8 bg-gray-50 border-gray-200"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
