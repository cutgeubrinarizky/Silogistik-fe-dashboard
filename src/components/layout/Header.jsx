import React, { useState, useEffect } from "react";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [userInitials, setUserInitials] = useState("U");
  const [userInfo, setUserInfo] = useState({});
  const [tenantInfo, setTenantInfo] = useState({});
  const [userRoleId, setUserRoleId] = useState(null);

  useEffect(() => {
    // Coba dapatkan data user dari localStorage
    const storedUser = localStorage.getItem("user");
    const storedTenant = localStorage.getItem("tenant_info");
    const userRoleId = localStorage.getItem("role");
    setUserRoleId(userRoleId);

    // Mengambil data tenant dan user
    const userData = storedUser ? JSON.parse(storedUser) : {};
    const tenantData = storedTenant ? JSON.parse(storedTenant) : {};

    setUserInfo(userData);
    setTenantInfo(tenantData);

    if (userData.full_name) {
      setUserName(userData.full_name);
      // Buat inisial dari nama
      const names = userData.full_name.split(" ");
      setUserInitials(names[0][0]);
    } else if (tenantData.name) {
      setUserName(tenantData.name);
      setUserInitials(tenantData.name[0]);
    }
  }, []);

  const handleLogout = () => {
    // Hapus semua data autentikasi dari localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("user");

    toast.success("Berhasil logout");
    navigate("/login");
  };

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

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute h-2 w-2 top-1.5 right-1.5 bg-rose-500 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#0C4A6E] text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm text-[#0C4A6E]">{userName}</p>
                <p className="w-[200px] truncate text-xs text-[#0C4A6E]/70">
                  {/* Tambahkan detail yang sesuai, misalnya: */}
                  {userRoleId === "1"
                    ? "Super Admin"
                    : userRoleId === "2"
                    ? "Admin"
                    : userRoleId === "3"
                    ? "Kurir"
                    : userRoleId === "4"
                    ? "Marketing"
                    : userInfo.role_id}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
