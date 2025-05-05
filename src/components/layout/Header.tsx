
import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isMobile?: boolean;
  toggleSidebar: () => void;
}

const Header = ({ isMobile = false, toggleSidebar }: HeaderProps) => {
  return (
    <div className="h-14 md:h-16 border-b border-gray-100 bg-white/90 backdrop-blur-md flex items-center justify-between px-3 md:px-6 shadow-sm">
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 text-gray-600" 
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>
      )}
      
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Cari pengiriman..."
            className="pl-8 bg-gray-50/80 border-gray-200 focus:border-modern-primary focus:ring-modern-primary transition-all duration-300"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="icon" className="relative bg-white hover:bg-gray-50 border-gray-200 text-gray-700 transition-all duration-300">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
