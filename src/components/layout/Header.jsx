import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Header = ({ onMenuClick }) => {
  return (
    <header className="border-b bg-background h-16 px-4 flex items-center justify-between">
      <div className="flex items-center md:w-72">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari..."
            className="w-full pl-8 rounded-md"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute h-2 w-2 top-1.5 right-1.5 bg-rose-500 rounded-full" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
