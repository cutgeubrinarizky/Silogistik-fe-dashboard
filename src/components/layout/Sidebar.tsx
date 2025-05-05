
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  UserRound, 
  FileText, 
  BarChart, 
  Users, 
  LogOut,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation();
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Pengiriman', path: '/shipments' },
    { icon: UserRound, label: 'Kurir', path: '/couriers' },
    { icon: FileText, label: 'Label & Invoice', path: '/labels' },
    { icon: BarChart, label: 'Laporan', path: '/reports' },
    { icon: Settings, label: 'Pengaturan', path: '/settings' },
    { icon: Users, label: 'Pengguna', path: '/users' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-100 transition-all duration-300 flex flex-col shadow-sm",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {!collapsed && (
          <div className="font-bold text-xl text-gradient">CargoPilot</div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto text-gray-500 hover:text-gray-700 hover:bg-gray-100" 
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={20} />
        </Button>
      </div>

      <div className="flex-grow py-5 overflow-y-auto scrollbar-thin">
        <nav>
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-xl text-gray-700 transition-all duration-200",
                    isActive(item.path) 
                      ? "bg-modern-primary/10 text-modern-primary font-medium" 
                      : "hover:bg-gray-50 hover:text-modern-primary"
                  )}
                >
                  <item.icon 
                    size={20} 
                    className={cn(
                      "flex-shrink-0", 
                      isActive(item.path) ? "text-modern-primary" : "text-gray-500"
                    )} 
                  />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-modern-primary to-modern-accent flex items-center justify-center text-white font-bold">
            A
          </div>
          {!collapsed && (
            <div className="ml-3">
              <div className="font-medium text-sm">Admin User</div>
              <div className="text-xs text-gray-500">admin@cargopilot.com</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
