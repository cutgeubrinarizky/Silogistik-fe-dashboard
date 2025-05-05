import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus,
  UserCheck,
  ShieldCheck,
  Eye,
  RefreshCcw
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Sample users data
const initialUsers = [
  {
    id: 1,
    name: 'Administrator',
    email: 'admin@cargopilot.com',
    role: 'super_admin',
    active: true,
    lastLogin: '2025-05-05 08:45',
  },
  {
    id: 2,
    name: 'Wati Susanti',
    email: 'wati@cargopilot.com',
    role: 'admin',
    active: true,
    lastLogin: '2025-05-04 14:30',
  },
  {
    id: 3,
    name: 'Hadi Gunawan',
    email: 'hadi@cargopilot.com',
    role: 'viewer',
    active: true,
    lastLogin: '2025-05-05 10:15',
  },
];

// Helper function to get role badge
const getRoleBadge = (role: string) => {
  switch(role) {
    case 'super_admin':
      return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Super Admin</Badge>;
    case 'admin':
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Admin</Badge>;
    case 'viewer':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Viewer</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

const UserForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingUser = null 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (user: any) => void,
  editingUser: any | null
}) => {
  const [name, setName] = useState(editingUser?.name || '');
  const [email, setEmail] = useState(editingUser?.email || '');
  const [role, setRole] = useState(editingUser?.role || 'viewer');
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(editingUser?.active ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      id: editingUser?.id || Date.now(),
      name,
      email,
      role,
      active,
      lastLogin: editingUser?.lastLogin || '-',
    };
    
    onSave(user);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select 
            value={role} 
            onValueChange={setRole}
          >
            <SelectTrigger id="role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {!editingUser && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required={!editingUser} 
              autoComplete="new-password"
            />
          </div>
        )}
        
        <div className="flex items-center space-x-2 pt-2">
          <input 
            type="checkbox"
            id="active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="active">Akun Aktif</Label>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">
            {editingUser ? 'Simpan' : 'Tambah Pengguna'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddNewUser = () => {
    setEditingUser(null);
    setShowDialog(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowDialog(true);
  };

  const handleSaveUser = (user: any) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => 
        prev.map(u => u.id === user.id ? user : u)
      );
      toast.success('Data pengguna berhasil diperbarui');
    } else {
      // Add new user
      setUsers(prev => [...prev, user]);
      toast.success('Pengguna baru berhasil ditambahkan');
    }
  };

  const handleDeleteUser = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    toast.success('Pengguna berhasil dihapus');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
      
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 space-y-4 sm:space-y-0">
          <CardTitle>Daftar Pengguna</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-9">
              <RefreshCcw size={16} className="mr-2" />
              Refresh
            </Button>
            <Button size="sm" className="h-9" onClick={handleAddNewUser}>
              <Plus size={16} className="mr-2" /> Tambah Pengguna
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Input 
                  placeholder="Cari nama atau email..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Login Terakhir</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.active ? (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Aktif</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Nonaktif</Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditUser(user)}>
                              <Edit size={16} className="mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <UserCheck size={16} className="mr-2" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 size={16} className="mr-2" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Tidak ada data pengguna yang sesuai
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Log Aktivitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Aktivitas</TableHead>
                  <TableHead>Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2025-05-05 10:45</TableCell>
                  <TableCell>Administrator</TableCell>
                  <TableCell>Pengiriman dibuat</TableCell>
                  <TableCell>Nomor resi: CGO123456</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2025-05-05 09:30</TableCell>
                  <TableCell>Wati Susanti</TableCell>
                  <TableCell>Status diperbarui</TableCell>
                  <TableCell>Resi CGO345678: Pickup → Transit</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2025-05-05 09:15</TableCell>
                  <TableCell>Hadi Gunawan</TableCell>
                  <TableCell>Login</TableCell>
                  <TableCell>Login berhasil</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <UserForm 
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          onSave={handleSaveUser}
          editingUser={editingUser}
        />
      </Dialog>
    </div>
  );
};

export default Users;
