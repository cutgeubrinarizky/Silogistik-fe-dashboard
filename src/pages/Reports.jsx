import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { Download, FileText, Search, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";

// Sample data
const dailyData = [
  { name: '01 Mei', total: 15, weight: 40, revenue: 450000 },
  { name: '02 Mei', total: 25, weight: 60, revenue: 600000 },
  { name: '03 Mei', total: 18, weight: 45, revenue: 400000 },
  { name: '04 Mei', total: 22, weight: 55, revenue: 500000 },
  { name: '05 Mei', total: 20, weight: 50, revenue: 550000 },
];

const courierData = [
  { name: 'Agus Subagyo', value: 45, fill: '#FF6B2C' },
  { name: 'Budi Santoso', value: 32, fill: '#0C4A6E' },
  { name: 'Citra Dewi', value: 26, fill: '#2563EB' },
  { name: 'Dian Pratama', value: 38, fill: '#10B981' },
];

const COLORS = ['#FF6B2C', '#0C4A6E', '#2563EB', '#10B981', '#6366F1'];

// Custom Tooltip untuk grafik area
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <p className="text-sm font-medium text-[#0C4A6E]">{label}</p>
        <p className="text-sm text-[#FF6B2C]">
          Total: {payload[0].value} pengiriman
        </p>
        <p className="text-sm text-[#0C4A6E]">
          Berat: {payload[1].value} kg
        </p>
      </div>
    );
  }
  return null;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="middle"
      fontSize="14px"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState('daily');
  const [startDate, setStartDate] = useState('2025-05-01');
  const [endDate, setEndDate] = useState('2025-05-05');
  const { toast } = useToast();

  const handleExportExcel = () => {
    try {
      // Menyiapkan data untuk ekspor
      const exportData = dailyData.map(row => ({
        'Tanggal': row.name,
        'Total Pengiriman': row.total,
        'Berat Total (kg)': row.weight,
        'Total Ongkir': `Rp ${row.revenue.toLocaleString('id-ID')}`,
      }));

      // Menambahkan baris total
      const totalRow = {
        'Tanggal': 'Total',
        'Total Pengiriman': dailyData.reduce((sum, row) => sum + row.total, 0),
        'Berat Total (kg)': dailyData.reduce((sum, row) => sum + row.weight, 0),
        'Total Ongkir': `Rp ${dailyData.reduce((sum, row) => sum + row.revenue, 0).toLocaleString('id-ID')}`,
      };
      exportData.push(totalRow);

      // Membuat workbook baru
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Mengatur lebar kolom
      const colWidths = [
        { wch: 15 }, // Tanggal
        { wch: 20 }, // Total Pengiriman
        { wch: 20 }, // Berat Total
        { wch: 20 }, // Total Ongkir
      ];
      ws['!cols'] = colWidths;

      // Menambahkan worksheet ke workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Laporan Pengiriman');

      // Menyimpan file
      const fileName = `Laporan_Pengiriman_${startDate}_${endDate}.xlsx`;
      XLSX.writeFile(wb, fileName);

      // Menampilkan notifikasi sukses
      toast({
        title: "Ekspor Berhasil",
        description: "File Excel berhasil diunduh",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      
      // Menampilkan notifikasi error
      toast({
        title: "Ekspor Gagal",
        description: "Terjadi kesalahan saat mengekspor data",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FF6B2C]/10">
              <BarChart3 className="h-6 w-6 text-[#FF6B2C]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0C4A6E]">
                Laporan & Ekspor Data
              </h1>
              <p className="text-[#0C4A6E]/70 mt-1">
                Analisis dan unduh data pengiriman secara detail
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#0C4A6E] mb-4">Filter Laporan</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0C4A6E]">Jenis Laporan</label>
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
              <label className="text-sm font-medium text-[#0C4A6E]">Tanggal Awal</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0C4A6E]">Tanggal Akhir</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white">
                <Search className="w-4 h-4 mr-2 text-white" /> Tampilkan
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 p-6 border-b border-gray-100">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#FF6B2C]/10">
                <FileText className="h-6 w-6 text-[#FF6B2C]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#0C4A6E]">100</span>
                <span className="text-sm font-medium text-[#0C4A6E]/80">Total Pengiriman</span>
                <span className="text-xs text-[#FF6B2C] mt-2 font-medium">Periode: 1 - 5 Mei 2025</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#FF6B2C]/10">
                <FileText className="h-6 w-6 text-[#FF6B2C]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#0C4A6E]">250 kg</span>
                <span className="text-sm font-medium text-[#0C4A6E]/80">Total Berat</span>
                <span className="text-xs text-[#FF6B2C] mt-2 font-medium">Rata-rata 2.5 kg per kiriman</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#FF6B2C]/10">
                <FileText className="h-6 w-6 text-[#FF6B2C]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#0C4A6E]">Rp 2,5 jt</span>
                <span className="text-sm font-medium text-[#0C4A6E]/80">Total Ongkir</span>
                <span className="text-xs text-[#FF6B2C] mt-2 font-medium">Rata-rata Rp 25.000 per kiriman</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="charts" className="w-full">
          <div className="px-6 pt-6">
            <TabsList className="inline-flex p-1 gap-1 bg-gray-100/80 rounded-lg">
              <TabsTrigger
                value="charts"
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
              >
                Grafik
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
              >
                Detail Data
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="charts" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-[#0C4A6E] mb-4">Tren Pengiriman Harian</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dailyData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                      >
                        <defs>
                          <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF6B2C" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#FF6B2C" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0C4A6E" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#0C4A6E" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#64748B" 
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#64748B" 
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          align="center"
                          height={36}
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{
                            paddingBottom: '20px',
                            paddingRight: '10px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="total"
                          stroke="#FF6B2C"
                          strokeWidth={2}
                          fill="url(#totalGradient)"
                          name="Total Pengiriman"
                        />
                        <Area
                          type="monotone"
                          dataKey="weight"
                          stroke="#0C4A6E"
                          strokeWidth={2}
                          fill="url(#weightGradient)"
                          name="Berat (kg)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-[#0C4A6E] mb-4">Distribusi Per Kurir</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={courierData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={140}
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="name"
                          strokeWidth={2}
                          stroke="#ffffff"
                          label={renderCustomizedLabel}
                          labelLine={false}
                        >
                          {courierData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.fill}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [`${value} paket`, name]}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px'
                          }}
                        />
                        <Legend
                          verticalAlign="middle"
                          align="right"
                          layout="vertical"
                          iconType="circle"
                          iconSize={10}
                          wrapperStyle={{
                            paddingLeft: '30px',
                            fontSize: '14px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#0C4A6E]">Detail Pengiriman</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-[#FF6B2C] border-[#FF6B2C] hover:bg-[#FF6B2C] hover:text-white"
                    onClick={handleExportExcel}
                  >
                    <Download className="w-4 h-4 mr-2" /> Ekspor Excel
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#0C4A6E]">Tanggal</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#0C4A6E]">Total Kiriman</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#0C4A6E]">Berat Total (kg)</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-[#0C4A6E]">Total Ongkir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="px-4 py-3 text-sm text-[#0C4A6E]/80">{row.name}</td>
                          <td className="px-4 py-3 text-sm text-[#0C4A6E]/80">{row.total}</td>
                          <td className="px-4 py-3 text-sm text-[#0C4A6E]/80">{row.weight}</td>
                          <td className="px-4 py-3 text-sm text-[#0C4A6E]/80">Rp {row.revenue.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-medium">
                        <td className="px-4 py-3 text-sm text-[#0C4A6E]">Total</td>
                        <td className="px-4 py-3 text-sm text-[#0C4A6E]">
                          {dailyData.reduce((sum, row) => sum + row.total, 0)}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#0C4A6E]">
                          {dailyData.reduce((sum, row) => sum + row.weight, 0)} kg
                        </td>
                        <td className="px-4 py-3 text-sm text-[#0C4A6E]">
                          Rp {dailyData.reduce((sum, row) => sum + row.revenue, 0).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
