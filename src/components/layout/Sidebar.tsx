
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
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Pengiriman', path: '/shipments' },
    { icon: UserRound, label: 'Kurir', path: '/couriers' },
    { icon: FileText, label: 'Label & Invoice', path: '/labels' },
    { icon: BarChart, label: 'Laporan', path: '/reports' },
    { icon: Settings, label: 'Pengaturan', path: '/settings' },
    { icon: Users, label: 'Pengguna', path: '/users' },
  ];

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="font-bold text-xl text-logistics-700">CargoPilot</div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={20} />
        </Button>
      </div>

      <div className="flex-grow py-5">
        <nav>
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-md text-gray-700 hover:bg-logistics-50 hover:text-logistics-600 transition-colors",
                    "hover:bg-logistics-50 hover:text-logistics-600"
                  )}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-logistics-100 flex items-center justify-center text-logistics-700 font-bold">
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
