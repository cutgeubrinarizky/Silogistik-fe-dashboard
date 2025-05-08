import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip);

// Data untuk Pie Chart Area
const areaData = {
  labels: ['Jabodetabek', 'Jawa', 'Sumatera', 'Lainnya'],
  datasets: [
    {
      label: 'Area Pengiriman',
      data: [150, 80, 45, 25],
      backgroundColor: [
        '#0C4A6E', // Jabodetabek - Biru Cargo
        '#0369A1', // Jawa - Biru Lebih Muda
        '#FF6B2C', // Sumatera - Oranye
        '#FB923C', // Lainnya - Oranye Lebih Muda
      ],
      borderWidth: 2,
      borderColor: '#fff',
      hoverOffset: 8,
    },
  ],
};

// Data untuk Pie Chart Berat Paket
const weightData = {
  labels: ['< 1kg', '1-5kg', '5-10kg', '> 10kg'],
  datasets: [
    {
      label: 'Berat Paket',
      data: [120, 85, 45, 20],
      backgroundColor: [
        '#0C4A6E', // < 1kg - Biru Cargo
        '#0369A1', // 1-5kg - Biru Lebih Muda
        '#FF6B2C', // 5-10kg - Oranye
        '#FB923C', // > 10kg - Oranye Lebih Muda
      ],
      borderWidth: 2,
      borderColor: '#fff',
      hoverOffset: 8,
    },
  ],
};

const options = {
  cutout: '50%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function(context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((context.parsed / total) * 100);
          return `${context.label}: ${context.parsed} (${percentage}%)`;
        },
      },
    },
  },
};

const areaLegendItems = [
  { label: 'Jabodetabek', color: '#0C4A6E' },
  { label: 'Jawa', color: '#0369A1' },
  { label: 'Sumatera', color: '#FF6B2C' },
  { label: 'Lainnya', color: '#FB923C' },
];

const weightLegendItems = [
  { label: '< 1kg', color: '#0C4A6E' },
  { label: '1-5kg', color: '#0369A1' },
  { label: '5-10kg', color: '#FF6B2C' },
  { label: '> 10kg', color: '#FB923C' },
];

const StatusPieChart = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center font-inter" style={{padding: '30px'}}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Area Distribution Chart */}
        <div className="flex flex-col items-center">
          <h3 className="text-md font-semibold text-[#0C4A6E] mb-3" style={{paddingBottom: '10px'}}>Distribusi Pengiriman Berdasarkan Area</h3>
          <div className="flex flex-row items-center justify-center gap-6">
            <div className="w-56 h-56 flex items-center">
              <Doughnut data={areaData} options={options} />
            </div>
            <div className="flex flex-col gap-2">
              {areaLegendItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm font-medium text-[#0C4A6E]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weight Distribution Chart */}
        <div className="flex flex-col items-center">
          <h3 className="text-md font-semibold text-[#0C4A6E] mb-3" style={{paddingBottom: '10px'}}>Distribusi Berat Paket</h3>
          <div className="flex flex-row items-center justify-center gap-6">
            <div className="w-56 h-56 flex items-center">
              <Doughnut data={weightData} options={options} />
            </div>
            <div className="flex flex-col gap-2">
              {weightLegendItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm font-medium text-[#0C4A6E]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPieChart; 