
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, FileText, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data
const dailyData = [
  { name: '01 Mei', total: 18, weight: 45, revenue: 450000 },
  { name: '02 Mei', total: 24, weight: 60, revenue: 600000 },
  { name: '03 Mei', total: 16, weight: 40, revenue: 400000 },
  { name: '04 Mei', total: 20, weight: 50, revenue: 500000 },
  { name: '05 Mei', total: 22, weight: 55, revenue: 550000 },
];

const courierData = [
  { name: 'Agus Subagyo', value: 45 },
  { name: 'Budi Santoso', value: 32 },
  { name: 'Citra Dewi', value: 26 },
  { name: 'Dian Pratama', value: 38 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState('daily');
  const [startDate, setStartDate] = useState('2025-05-01');
  const [endDate, setEndDate] = useState('2025-05-05');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Laporan & Ekspor Data</h1>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Jenis Laporan</label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Tanggal Awal</label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Tanggal Akhir</label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1.5" />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Search size={16} className="mr-2" /> Tampilkan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Pengiriman</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">100</div>
            <div className="text-sm text-muted-foreground">Periode: 1 - 5 Mei 2025</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Berat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">250 kg</div>
            <div className="text-sm text-muted-foreground">Rata-rata 2.5 kg per kiriman</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Ongkir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">Rp 2,5 jt</div>
            <div className="text-sm text-muted-foreground">Rata-rata Rp 25.000 per kiriman</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="chart">Grafik</TabsTrigger>
          <TabsTrigger value="detail">Detail Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tren Pengiriman Harian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dailyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribusi Per Kurir</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={courierData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {courierData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="detail">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Detail Pengiriman</CardTitle>
              <Button>
                <FileText size={16} className="mr-2" /> Ekspor Excel
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left font-medium">Tanggal</th>
                      <th className="px-4 py-2 text-left font-medium">Total Kiriman</th>
                      <th className="px-4 py-2 text-left font-medium">Berat Total (kg)</th>
                      <th className="px-4 py-2 text-right font-medium">Total Ongkir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData.map((row, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{row.name}</td>
                        <td className="px-4 py-2">{row.total}</td>
                        <td className="px-4 py-2">{row.weight}</td>
                        <td className="px-4 py-2 text-right">Rp {row.revenue.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                    <tr className="border-t bg-gray-50 font-medium">
                      <td className="px-4 py-2">Total</td>
                      <td className="px-4 py-2">
                        {dailyData.reduce((sum, row) => sum + row.total, 0)}
                      </td>
                      <td className="px-4 py-2">
                        {dailyData.reduce((sum, row) => sum + row.weight, 0)} kg
                      </td>
                      <td className="px-4 py-2 text-right">
                        Rp {dailyData.reduce((sum, row) => sum + row.revenue, 0).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
