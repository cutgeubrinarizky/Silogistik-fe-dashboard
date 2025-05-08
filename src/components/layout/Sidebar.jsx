import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  UserRound, 
  FileText, 
  BarChart, 
  Users, 
  Bell, 
  LogOut,
  Menu,
  Banknote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Package size={20} />, label: 'Pengiriman', path: '/shipments' },
    { icon: <Banknote size={20} />, label: 'Manajemen Ongkir', path: '/shipping-rates' },
    { icon: <Users size={20} />, label: 'Kurir', path: '/couriers' },
    { icon: <FileText size={20} />, label: 'Label & Invoice', path: '/labels' },
    { icon: <BarChart size={20} />, label: 'Laporan', path: '/reports' },
    { icon: <Settings size={20} />, label: 'Pengaturan', path: '/settings' },
    { icon: <UserRound size={20} />, label: 'Pengguna', path: '/users' },
  ];

  return (
    <div className={cn(
      "h-screen transition-all border-r bg-white text-[#0C4A6E]", 
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between h-16 px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src="/images/logosilogistik.png" alt="Logo Silogistik" className="h-8 w-auto" />
            {/* <span className="font-bold text-xl text-[#0ea5e9]">Silogistik</span> */}
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCollapsed && setCollapsed(!collapsed)}
        >
          <Menu size={20} />
        </Button>
      </div>

      <div className="py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <Link 
              key={index}
              to={item.path} 
              className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-sidebar-accent"
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-4 w-full px-4">
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            A
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-medium">Admin User</span>
              <span className="text-xs text-sidebar-foreground/70">admin@cargopilot.com</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
