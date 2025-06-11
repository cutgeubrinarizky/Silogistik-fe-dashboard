import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Banknote,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [userRoleId, setUserRoleId] = useState(null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [tenantInfo, setTenantInfo] = useState({});

  useEffect(() => {
    try {
      const userRoleId = localStorage.getItem("role") || "";
      const userInfoStr = localStorage.getItem("user") || "{}";
      const tenantInfoStr = localStorage.getItem("tenant_info") || "{}";

      setUserRoleId(userRoleId);
      setUserInfo(JSON.parse(userInfoStr));
      setTenantInfo(JSON.parse(tenantInfoStr));
    } catch (error) {
      console.error("Error parsing user/tenant info:", error);
      // Set nilai default jika terjadi error
      setUserInfo({});
      setTenantInfo({});
    }
  }, []);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);
  // Menu item untuk semua user
  const baseNavItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/" },
    { icon: <Package size={20} />, label: "Pengiriman", path: "/shipments" },
    {
      icon: <Banknote size={20} />,
      label: "Manajemen Ongkir",
      path: "/shipping-rates",
    },
    // {
    //   icon: <Wallet size={20} />,
    //   label: "Manajemen Keuangan",
    //   path: "/finance",
    // },
  ];

  // Menu item hanya untuk admin (role_id 1 atau 2)
  const adminNavItems = [
    {
      icon: <Users size={20} />,
      label: "Manajemen Pegawai",
      path: "/employees",
    },
    {
      icon: <Wallet size={20} />,
      label: "Manajemen Keuangan",
      path: "/finance",
    },
    { icon: <FileText size={20} />, label: "Label & Invoice", path: "/labels" },
    { icon: <BarChart size={20} />, label: "Laporan", path: "/reports" },
    { icon: <Settings size={20} />, label: "Pengaturan", path: "/settings" },
    { icon: <UserRound size={20} />, label: "Pengguna", path: "/users" },
  ];

  // Gabungkan menu item sesuai dengan role
  const navItems = [
    ...baseNavItems,
    ...(userRoleId === "1" || userRoleId === 2 ? adminNavItems : []),
  ];

  return (
    <div
      className={cn(
        "h-screen transition-all border-r bg-white text-[#0C4A6E]",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img
              src="/images/logosilogistik.png"
              alt="Logo Silogistik"
              className="h-8 w-auto"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/160x40/FF6B2C/white?text=SiLogistik";
              }}
            />
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
              className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-slate-100"
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-4 w-full px-4">
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <Avatar>
              <AvatarImage src={""} />
              <AvatarFallback>
                {userInfo?.full_name
                  ? userInfo.full_name.charAt(0)
                  : tenantInfo?.name
                  ? tenantInfo.name.charAt(0)
                  : "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-medium">
                {userRoleId === "1"
                  ? tenantInfo?.name || "Tenant"
                  : userInfo?.full_name || "User"}
              </span>
              <span className="text-xs text-[#0C4A6E]/70">
                {userRoleId === "1"
                  ? "Super Admin"
                  : userRoleId === "2"
                  ? "Admin"
                  : userRoleId === "3"
                  ? "Kurir"
                  : userRoleId === "4"
                  ? "Marketing"
                  : userInfo?.email || ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
