import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ClipboardList,
  RefreshCcw,
  Search,
  Calendar
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // Sample activity logs data
  const activityLogs = [
    {
      id: 1,
      timestamp: '2025-05-05 10:45',
      user: 'Administrator',
      activity: 'Pengiriman dibuat',
      detail: 'Nomor resi: CGO123456',
      type: 'create'
    },
    {
      id: 2,
      timestamp: '2025-05-05 09:30',
      user: 'Wati Susanti',
      activity: 'Status diperbarui',
      detail: 'Resi CGO345678: Pickup → Transit',
      type: 'update'
    },
    {
      id: 3,
      timestamp: '2025-05-05 09:15',
      user: 'Hadi Gunawan',
      activity: 'Login',
      detail: 'Login berhasil',
      type: 'auth'
    }
  ];

  const getActivityBadge = (type) => {
    const badges = {
      create: "bg-green-50 text-green-600 border-green-200",
      update: "bg-blue-50 text-blue-600 border-blue-200",
      auth: "bg-purple-50 text-purple-600 border-purple-200",
      delete: "bg-red-50 text-red-600 border-red-200"
    };
    return badges[type] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FF6B2C]/10">
              <ClipboardList className="h-6 w-6 text-[#FF6B2C]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0C4A6E]">Log Aktivitas Pengguna</h1>
              <p className="text-[#0C4A6E]/70 mt-1">
                Pantau semua aktivitas pengguna dalam sistem
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Cari aktivitas..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Filter waktu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Waktu</SelectItem>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="week">Minggu Ini</SelectItem>
                <SelectItem value="month">Bulan Ini</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="w-full sm:w-auto hover:bg-gray-50">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold text-[#0C4A6E]">Waktu</TableHead>
                  <TableHead className="font-semibold text-[#0C4A6E]">Pengguna</TableHead>
                  <TableHead className="font-semibold text-[#0C4A6E]">Aktivitas</TableHead>
                  <TableHead className="font-semibold text-[#0C4A6E]">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium text-gray-600">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#FF6B2C]/10 flex items-center justify-center">
                          <span className="text-[#FF6B2C] font-medium">
                            {log.user.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-700">{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getActivityBadge(log.type)} px-3 py-1`}
                      >
                        {log.activity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {log.detail}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Search className="h-8 w-8 mb-2 text-gray-400" />
                        <p>Tidak ada data aktivitas yang sesuai</p>
                        <p className="text-sm">Coba gunakan kata kunci pencarian yang berbeda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
