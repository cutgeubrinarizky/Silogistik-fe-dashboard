import React from 'react';
import { TrendingUp, TrendingDown, FileText, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";

const FinancialReport = () => {
  return (
    <div className="space-y-8">
      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#0C4A6E]">Rp 15.5M</span>
              <span className="text-sm font-medium text-[#0C4A6E]/80">Total Pemasukan</span>
              <span className="text-xs text-green-500 mt-2 font-medium">+12% dari bulan lalu</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5">
              <TrendingDown className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#0C4A6E]">Rp 8.2M</span>
              <span className="text-sm font-medium text-[#0C4A6E]/80">Total Pengeluaran</span>
              <span className="text-xs text-red-500 mt-2 font-medium">+5% dari bulan lalu</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#0C4A6E]">24</span>
              <span className="text-sm font-medium text-[#0C4A6E]/80">Invoice Belum Terbayar</span>
              <span className="text-xs text-blue-500 mt-2 font-medium">Total Rp 4.8M</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <Download className="h-6 w-6 text-purple-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#0C4A6E]">Ekspor</span>
              <span className="text-sm font-medium text-[#0C4A6E]/80">Laporan Keuangan</span>
              <span className="text-xs text-purple-500 mt-2 font-medium">PDF / Excel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grafik dan Tabel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grafik Arus Kas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-[#0C4A6E] mb-4">Grafik Arus Kas</h2>
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            Grafik akan ditampilkan di sini
          </div>
        </div>

        {/* Invoice Belum Terbayar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#0C4A6E]">Invoice Belum Terbayar</h2>
            <Button variant="outline" size="sm">Lihat Semua</Button>
          </div>
          <div className="space-y-4">
            {/* Contoh data invoice */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-[#0C4A6E]">INV-{item}023</p>
                  <p className="text-sm text-gray-500">Jatuh tempo: 15 Mar 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#0C4A6E]">Rp 2.500.000</p>
                  <p className="text-sm text-red-500">Terlambat 5 hari</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport; 