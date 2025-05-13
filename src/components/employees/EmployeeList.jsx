import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  BarChart,
  Plus,
  RefreshCcw,
  User,
  Truck,
  Megaphone,
  Filter,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Sample data
const initialAdmins = [
  {
    id: 1,
    name: "Admin Utama",
    phone: "081234567890",
    email: "admin@example.com",
    active: true,
  },
];

const initialCouriers = [
  {
    id: 1,
    name: "Agus Subagyo",
    phone: "081234567890",
    plateNumber: "B 1234 XYZ",
    active: true,
    deliveries: 150,
    successful: 142,
    failed: 8,
    inProgress: 0,
  },
];

const initialMarketers = [
  {
    id: 1,
    name: "Marketing Utama",
    phone: "081234567890",
    address: "Jl. Contoh No. 123",
    active: true,
    deliveries: 300,
    successful: 280,
    failed: 20,
  },
];

// Form Components
const AdminForm = ({ isOpen, onClose, onSave, editingAdmin }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    status: true,
  });

  useEffect(() => {
    if (editingAdmin) {
      setFormData({
        name: editingAdmin.name,
        phone: editingAdmin.phone,
        email: editingAdmin.email,
        password: "",
        status: editingAdmin.active,
      });
    } else {
      // Reset form untuk create
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        status: true,
      });
    }
  }, [editingAdmin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const admin = {
      id: editingAdmin?.id || Date.now(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      password: formData.password || editingAdmin?.password,
      active: formData.status,
    };
    onSave(admin);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0">
        <div className="p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-semibold text-[#0C4A6E]">
              {editingAdmin ? "Edit Admin" : "Tambah Admin Baru"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0C4A6E]">
                Nama
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Masukkan nama admin"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#0C4A6E]">
                No. Telepon
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Masukkan nomor telepon"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0C4A6E]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Masukkan email"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#0C4A6E]">
                Password{" "}
                {editingAdmin && "(kosongkan jika tidak ingin mengubah)"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Masukkan password"
                className="bg-white border-gray-200"
              />
            </div>

            {editingAdmin && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      status: checked,
                    })
                  }
                />
                <Label htmlFor="status" className="text-[#0C4A6E]">
                  Status Aktif
                </Label>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-9 px-4 text-sm font-medium hover:bg-gray-50"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-[#0C4A6E] hover:bg-[#0C4A6E]/90 text-white h-9 px-4 text-sm font-medium"
              >
                {editingAdmin ? "Simpan Perubahan" : "Tambah Admin"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CourierForm = ({ isOpen, onClose, onSave, editingCourier }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    plateNumber: "",
    status: true,
    email: "",
    password: "",
  });

  useEffect(() => {
    if (editingCourier) {
      setFormData({
        name: editingCourier.name,
        phone: editingCourier.phone,
        plateNumber: editingCourier.plateNumber,
        status: editingCourier.active,
        email: editingCourier.email || "",
        password: "",
      });
    } else {
      // Reset form untuk create
      setFormData({
        name: "",
        phone: "",
        plateNumber: "",
        status: true,
        email: "",
        password: "",
      });
    }
  }, [editingCourier]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const courier = {
      id: editingCourier?.id || Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      plateNumber: formData.plateNumber,
      password: formData.password || editingCourier?.password,
      active: formData.status,
    };
    onSave(courier);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0">
        <div className="p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-semibold text-[#0C4A6E]">
              {editingCourier ? "Edit Kurir" : "Tambah Kurir Baru"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0C4A6E]">
                Nama
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Masukkan nama kurir"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#0C4A6E]">
                No. Telepon
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Masukkan nomor telepon"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plateNumber" className="text-[#0C4A6E]">
                Nomor Plat
              </Label>
              <Input
                id="plateNumber"
                value={formData.plateNumber}
                onChange={(e) =>
                  setFormData({ ...formData, plateNumber: e.target.value })
                }
                placeholder="Masukkan nomor plat kendaraan"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0C4A6E]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Masukkan email"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#0C4A6E]">
                Password{" "}
                {editingCourier && "(kosongkan jika tidak ingin mengubah)"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Masukkan password"
                className="bg-white border-gray-200"
              />
            </div>

            {editingCourier && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      status: checked,
                    })
                  }
                />
                <Label htmlFor="status" className="text-[#0C4A6E]">
                  Status Aktif
                </Label>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-9 px-4 text-sm font-medium hover:bg-gray-50"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-[#0C4A6E] hover:bg-[#0C4A6E]/90 text-white h-9 px-4 text-sm font-medium"
              >
                {editingCourier ? "Simpan Perubahan" : "Tambah Kurir"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MarketingForm = ({ isOpen, onClose, onSave, editingMarketer }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    status: true,
    email: "",
    password: "",
  });

  useEffect(() => {
    if (editingMarketer) {
      setFormData({
        name: editingMarketer.name,
        phone: editingMarketer.phone,
        address: editingMarketer.address,
        status: editingMarketer.active,
        email: editingMarketer.email || "",
        password: "",
      });
    } else {
      // Reset form untuk create
      setFormData({
        name: "",
        phone: "",
        address: "",
        status: true,
        email: "",
        password: "",
      });
    }
  }, [editingMarketer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const marketer = {
      id: editingMarketer?.id || Date.now(),
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      email: formData.email,
      password: formData.password || editingMarketer?.password,
      active: formData.status,
    };
    onSave(marketer);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0">
        <div className="p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-semibold text-[#0C4A6E]">
              {editingMarketer ? "Edit Marketing" : "Tambah Marketing Baru"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0C4A6E]">
                Nama
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Masukkan nama marketing"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#0C4A6E]">
                No. Telepon
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Masukkan nomor telepon"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#0C4A6E]">
                Alamat
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Masukkan alamat"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0C4A6E]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Masukkan email"
                className="bg-white border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#0C4A6E]">
                Password{" "}
                {editingMarketer && "(kosongkan jika tidak ingin mengubah)"}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Masukkan password"
                className="bg-white border-gray-200"
              />
            </div>

            {editingMarketer && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      status: checked,
                    })
                  }
                />
                <Label htmlFor="status" className="text-[#0C4A6E]">
                  Status Aktif
                </Label>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-9 px-4 text-sm font-medium hover:bg-gray-50"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-[#0C4A6E] hover:bg-[#0C4A6E]/90 text-white h-9 px-4 text-sm font-medium"
              >
                {editingMarketer ? "Simpan Perubahan" : "Tambah Marketing"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EmployeeList = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [admins, setAdmins] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [marketers, setMarketers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL =
    import.meta.env.VITE_SUPABASE_URL || "http://localhost:54321";
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/functions/v1/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log("response data:", jsonData);

      if (jsonData.success) {
        const users = jsonData.data;
        console.log("data user:", users);
        // Filter berdasarkan role
        const adminData = users.filter(
          (user) =>
            user.role.name === "super_admin" || user.role.name === "admin"
        );

        const courierData = users.filter((user) => user.role.id === 3);

        const marketingData = users.filter(
          (user) => user.role.name === "marketing"
        );

        // Memetakan data ke format yang sesuai dengan komponen
        setAdmins(
          adminData.map((user) => ({
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email || "-",
            active: user.is_active,
            role: user.role.name,
            role_id: user.role.id,
            tenant_info: user.tenant_info,
            created_at: user.created_at,
            auth_user: user.auth_user,
          }))
        );

        setCouriers(
          courierData.map((user) => ({
            id: user.id,
            name: user.name,
            phone: user.phone,
            plateNumber: user.courier?.vehicle_plate || "-",
            active: user.is_active,
            email: user.email || null,
            role_id: user.role.id,
            tenant_info: user.tenant_info,
            created_at: user.created_at,
            auth_user: user.auth_user,
          }))
        );

        setMarketers(
          marketingData.map((user) => ({
            id: user.id,
            name: user.name,
            phone: user.phone,
            address: user.marketer?.address || "-",
            active: user.is_active,
            email: user.email || null,
            role_id: user.role.id,
            tenant_info: user.tenant_info,
            created_at: user.created_at,
            auth_user: user.auth_user,
          }))
        );
      } else {
        toast.error(jsonData.message || "Gagal memuat data pengguna");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat data pengguna");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // CREATE User
  const createUser = async (userData) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/functions/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const jsonData = await response.json();

      if (jsonData.success) {
        toast.success(jsonData.message || "Pengguna berhasil dibuat");
        fetchUsers(); // Refresh data
        return true;
      } else {
        toast.error(jsonData.message || "Gagal membuat pengguna");
        return false;
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Gagal membuat pengguna");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATE User
  const updateUser = async (userId, userData) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_BASE_URL}/functions/v1/users?id=${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const jsonData = await response.json();

      if (jsonData.success) {
        toast.success(jsonData.message || "Pengguna berhasil diperbarui");
        fetchUsers(); // Refresh data
        return true;
      } else {
        toast.error(jsonData.message || "Gagal memperbarui pengguna");
        return false;
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Gagal memperbarui pengguna");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE User
  const deleteUser = async (userId) => {
    try {
      // Konfirmasi penghapusan
      if (!window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
        return false;
      }

      setIsLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_BASE_URL}/functions/v1/users?id=${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const jsonData = await response.json();

      if (jsonData.success) {
        toast.success(jsonData.message || "Pengguna berhasil dihapus");
        fetchUsers(); // Refresh data
        return true;
      } else {
        toast.error(jsonData.message || "Gagal menghapus pengguna");
        return false;
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Gagal menghapus pengguna");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowDialog(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowDialog(true);
  };

  const handleSave = async (item) => {
    let result = false;

    if (activeTab === "admin") {
      // Membuat data request untuk admin
      const userData = {
        name: item.name,
        phone: item.phone,
        role_id: 2, // Asumsi role_id admin adalah 2
      };

      // Tambahkan email dan password jika ada
      if (item.email) {
        userData.email = item.email;
      }

      if (item.password) {
        userData.password = item.password;
      }

      if (editingItem) {
        // Update - tambahkan is_active
        userData.is_active = item.active;
        result = await updateUser(editingItem.id, userData);
      } else {
        // Create (memerlukan email dan password)
        if (!userData.email || !userData.password) {
          toast.error(
            "Email dan password diperlukan untuk membuat pengguna baru"
          );
          return;
        }
        // Tambahkan flag untuk melewati verifikasi email
        userData.skip_email_verification = true;
        result = await createUser(userData);
      }
    } else if (activeTab === "courier") {
      // Membuat data request untuk kurir
      const userData = {
        name: item.name,
        phone: item.phone,
        role_id: 3, // role_id kurir
        vehicle_plate: item.plateNumber,
      };

      // Tambahkan email dan password jika ada
      if (item.email) {
        userData.email = item.email;
      }

      if (item.password) {
        userData.password = item.password;
      }

      if (editingItem) {
        // Update - tambahkan is_active
        userData.is_active = item.active;
        result = await updateUser(editingItem.id, userData);
      } else {
        // Create
        if (!userData.email || !userData.password) {
          toast.error(
            "Email dan password diperlukan untuk membuat pengguna baru"
          );
          return;
        }
        // Tambahkan flag untuk melewati verifikasi email
        userData.skip_email_verification = true;
        result = await createUser(userData);
      }
    } else if (activeTab === "marketing") {
      // Membuat data request untuk marketing
      const userData = {
        name: item.name,
        phone: item.phone,
        role_id: 4, // role_id marketing
        address: item.address,
      };

      // Tambahkan email dan password jika ada
      if (item.email) {
        userData.email = item.email;
      }

      if (item.password) {
        userData.password = item.password;
      }

      if (editingItem) {
        // Update - tambahkan is_active
        userData.is_active = item.active;
        result = await updateUser(editingItem.id, userData);
      } else {
        // Create
        if (!userData.email || !userData.password) {
          toast.error(
            "Email dan password diperlukan untuk membuat pengguna baru"
          );
          return;
        }
        // Tambahkan flag untuk melewati verifikasi email
        userData.skip_email_verification = true;
        result = await createUser(userData);
      }
    }

    if (result) {
      setShowDialog(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
  };

  const calculateSuccessRate = (successful, total) => {
    if (total === 0) return "0%";
    return `${Math.round((successful / total) * 100)}%`;
  };

  const renderAdminTable = () => {
    const filteredAdmins = admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (admin.email &&
          admin.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100 hover:bg-transparent">
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              Nama
            </TableHead>
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              Email
            </TableHead>
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              No. Telepon
            </TableHead>
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              Role
            </TableHead>
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              Status
            </TableHead>
            <TableHead className="text-right text-[#0C4A6E]/70 font-medium">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAdmins.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-gray-500"
              >
                Tidak ada data admin
              </TableCell>
            </TableRow>
          ) : (
            filteredAdmins.map((admin) => (
              <TableRow
                key={admin.id}
                className="hover:bg-gray-50/80 transition-all border-b border-gray-100"
              >
                <TableCell className="font-medium text-[#0C4A6E]">
                  {admin.name}
                </TableCell>
                <TableCell className="text-[#0C4A6E]/80">
                  {admin.email}
                </TableCell>
                <TableCell className="text-[#0C4A6E]/80">
                  {admin.phone}
                </TableCell>
                <TableCell className="text-[#0C4A6E]/80">
                  {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={admin.active ? "success" : "destructive"}
                    className={
                      admin.active
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }
                  >
                    {admin.active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                      onClick={() => handleEdit(admin)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100 text-[#0C4A6E]/70 hover:text-[#0C4A6E]"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleEdit(admin)}
                          className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(admin.id)}
                          className="text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  };

  const renderCourierTable = () => {
    const filteredCouriers = couriers.filter(
      (courier) =>
        courier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courier.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100 hover:bg-transparent">
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              Nama
            </TableHead>
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              Email
            </TableHead>
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              No. Telepon
            </TableHead>
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              Plat Nomor
            </TableHead>
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              Status
            </TableHead>
            {/* <TableHead className="text-[#0C4A6E]/70 font-medium">
              Akun
            </TableHead> */}
            <TableHead className="text-right text-[#0C4A6E]/70 font-medium">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCouriers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-gray-500"
              >
                Tidak ada data kurir
              </TableCell>
            </TableRow>
          ) : (
            filteredCouriers.map((courier) => (
              <TableRow
                key={courier.id}
                className="hover:bg-gray-50/80 transition-all border-b border-gray-100"
              >
                <TableCell className="font-medium text-[#0C4A6E]">
                  {courier.name}
                </TableCell>
                <TableCell className="text-[#0C4A6E]/80">
                  {courier.email}
                </TableCell>
                <TableCell className="text-[#0C4A6E]/80">
                  {courier.phone}
                </TableCell>
                <TableCell className="text-[#0C4A6E]/80">
                  {courier.plateNumber}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={courier.active ? "success" : "destructive"}
                    className={
                      courier.active
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }
                  >
                    {courier.active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                {/* <TableCell>
                  <Badge
                    variant={courier.email ? "default" : "secondary"}
                    className={
                      courier.email
                        ? "bg-[#0C4A6E]/10 text-[#0C4A6E] border-[#0C4A6E]/20"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }
                  >
                    {courier.email ? "Memiliki Akun" : "Tidak Memiliki Akun"}
                  </Badge>
                </TableCell> */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                      onClick={() => handleEdit(courier)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100 text-[#0C4A6E]/70 hover:text-[#0C4A6E]"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleEdit(courier)}
                          className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(courier.id)}
                          className="text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  };

  const renderMarketingTable = () => {
    const filteredMarketers = marketers.filter(
      (marketer) =>
        marketer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        marketer.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100 hover:bg-transparent">
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              Nama
            </TableHead>
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              Email
            </TableHead>
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              No. Telepon
            </TableHead>
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              Alamat
            </TableHead>
            <TableHead className="text-[#0C4A6E]/70 font-medium">
              Status
            </TableHead>
            {/* <TableHead className="text-[#0C4A6E]/70 font-medium">
              Akun
            </TableHead> */}
            <TableHead className="text-right text-[#0C4A6E]/70 font-medium">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMarketers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-gray-500"
              >
                Tidak ada data marketing
              </TableCell>
            </TableRow>
          ) : (
            filteredMarketers.map((marketer) => (
              <TableRow
                key={marketer.id}
                className="hover:bg-gray-50/80 transition-all border-b border-gray-100"
              >
                <TableCell className="font-medium text-[#0C4A6E]">
                  {marketer.name}
                </TableCell>
                <TableCell className="text-[#0C4A6E]/80">
                  {marketer.email}
                </TableCell>
                <TableCell className="text-[#0C4A6E]/80">
                  {marketer.phone}
                </TableCell>
                <TableCell className="text-[#0C4A6E]/80">
                  {marketer.address}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={marketer.active ? "success" : "destructive"}
                    className={
                      marketer.active
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }
                  >
                    {marketer.active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                {/* <TableCell>
                  <Badge
                    variant={marketer.email ? "default" : "secondary"}
                    className={
                      marketer.email
                        ? "bg-[#0C4A6E]/10 text-[#0C4A6E] border-[#0C4A6E]/20"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }
                  >
                    {marketer.email ? "Memiliki Akun" : "Tidak Memiliki Akun"}
                  </Badge>
                </TableCell> */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                      onClick={() => handleEdit(marketer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100 text-[#0C4A6E]/70 hover:text-[#0C4A6E]"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleEdit(marketer)}
                          className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(marketer.id)}
                          className="text-red-600 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div
        className="bg-white rounded-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]"
        style={{ marginTop: "20px" }}
      >
        <Tabs
          defaultValue="admin"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="px-6 pt-6">
            <TabsList className="inline-flex p-1 gap-1 bg-gray-100/80 rounded-lg">
              <TabsTrigger
                value="admin"
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
              >
                <User className="mr-2 h-4 w-4" />
                Admin
              </TabsTrigger>
              <TabsTrigger
                value="courier"
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
              >
                <Truck className="mr-2 h-4 w-4" />
                Kurir
              </TabsTrigger>
              <TabsTrigger
                value="marketing"
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
              >
                <Megaphone className="mr-2 h-4 w-4" />
                Marketing
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-50/80 rounded-lg p-1 gap-1.5">
                  <Input
                    placeholder={`Cari ${
                      activeTab === "admin"
                        ? "admin"
                        : activeTab === "courier"
                        ? "kurir"
                        : "marketing"
                    }...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-72 border-0 bg-transparent focus:ring-0 placeholder:text-gray-400 text-sm"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-gray-400 hover:text-[#FF6B2C]"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={fetchUsers}
                  disabled={isLoading}
                  className="h-9 w-9 text-[#0C4A6E] hover:text-[#0C4A6E] hover:bg-[#0C4A6E]/10"
                >
                  <RefreshCcw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
              <Button
                size="sm"
                onClick={handleAddNew}
                className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white shadow-sm px-4 h-9"
              >
                <Plus className="mr-2 h-4 w-4" />
                {`Tambah ${
                  activeTab === "admin"
                    ? "Admin"
                    : activeTab === "courier"
                    ? "Kurir"
                    : "Marketing"
                }`}
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-[#0C4A6E]" />
                <span className="ml-3 text-[#0C4A6E]">Memuat data...</span>
              </div>
            ) : (
              <>
                <TabsContent value="admin" className="mt-0">
                  <div className="bg-white rounded-xl border border-gray-100">
                    {renderAdminTable()}
                  </div>
                </TabsContent>

                <TabsContent value="courier" className="mt-0">
                  <div className="bg-white rounded-xl border border-gray-100">
                    {renderCourierTable()}
                  </div>
                </TabsContent>

                <TabsContent value="marketing" className="mt-0">
                  <div className="bg-white rounded-xl border border-gray-100">
                    {renderMarketingTable()}
                  </div>
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>

        {activeTab === "admin" && (
          <AdminForm
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
            onSave={handleSave}
            editingAdmin={editingItem}
          />
        )}

        {activeTab === "courier" && (
          <CourierForm
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
            onSave={handleSave}
            editingCourier={editingItem}
          />
        )}

        {activeTab === "marketing" && (
          <MarketingForm
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
            onSave={handleSave}
            editingMarketer={editingItem}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
