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
  { name: '01 Mei', total: 15, weight: 40, revenue: 450000 },
  { name: '02 Mei', total: 25, weight: 60, revenue: 600000 },
  { name: '03 Mei', total: 18, weight: 45, revenue: 400000 },
  { name: '04 Mei', total: 22, weight: 55, revenue: 500000 },
  { name: '05 Mei', total: 20, weight: 50, revenue: 550000 },
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
      <h1 className="text-3xl font-bold">Laporan & Ekspor Data</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label>Jenis Laporan</label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label>Tanggal Awal</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1.5" />
            </div>
            <div className="space-y-2">
              <label>Tanggal Akhir</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1.5" />
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Search className="w-4 h-4 mr-2" /> Tampilkan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pengiriman</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100</div>
            <p className="text-xs text-muted-foreground">Periode: 1 - 5 Mei 2025</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Berat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250 kg</div>
            <p className="text-xs text-muted-foreground">Rata-rata 2.5 kg per kiriman</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Ongkir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 2,5 jt</div>
            <p className="text-xs text-muted-foreground">Rata-rata Rp 25.000 per kiriman</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="charts">
        <TabsList>
          <TabsTrigger value="charts">Grafik</TabsTrigger>
          <TabsTrigger value="details">Detail Data</TabsTrigger>
        </TabsList>
        <TabsContent value="charts">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tren Pengiriman Harian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" fill="#8884d8" name="Jumlah" />
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
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip formatter={(value, name) => [`${value} paket`, name]} />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
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
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Detail Pengiriman</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" /> Ekspor Excel
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left font-medium">Tanggal</th>
                      <th className="px-4 py-2 text-left font-medium">Total Kiriman</th>
                      <th className="px-4 py-2 text-left font-medium">Berat Total (kg)</th>
                      <th className="px-4 py-2 text-left font-medium">Total Ongkir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyData.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{row.name}</td>
                        <td className="px-4 py-2">{row.total}</td>
                        <td className="px-4 py-2">{row.weight}</td>
                        <td className="px-4 py-2">Rp {row.revenue.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/50 font-medium">
                      <td className="px-4 py-2">Total</td>
                      <td className="px-4 py-2">
                        {dailyData.reduce((sum, row) => sum + row.total, 0)}
                      </td>
                      <td className="px-4 py-2">
                        {dailyData.reduce((sum, row) => sum + row.weight, 0)} kg
                      </td>
                      <td className="px-4 py-2">
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
