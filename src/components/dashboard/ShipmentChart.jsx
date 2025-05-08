import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

// Sample data
const weekData = [
  { name: 'Sen', total: 45 },
  { name: 'Sel', total: 32 },
  { name: 'Rab', total: 58 },
  { name: 'Kam', total: 40 },
  { name: 'Jum', total: 65 },
  { name: 'Sab', total: 37 },
  { name: 'Ming', total: 25 },
];

const monthData = [
  { name: 'Jan', total: 150 },
  { name: 'Feb', total: 180 },
  { name: 'Mar', total: 220 },
  { name: 'Apr', total: 200 },
  { name: 'May', total: 270 },
  { name: 'Jun', total: 250 },
  { name: 'Jul', total: 300 },
  { name: 'Aug', total: 290 },
  { name: 'Sep', total: 310 },
  { name: 'Oct', total: 340 },
  { name: 'Nov', total: 320 },
  { name: 'Dec', total: 380 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 shadow text-xs text-[#0C4A6E]">
        <div className="font-semibold mb-1">{label}</div>
        <div>Total: <span className="font-bold text-[#FF6B2C]">{payload[0].value}</span></div>
      </div>
    );
  }
  return null;
};

const CustomBarLabel = (props) => {
  const { x, y, width, value, fill } = props;
  return (
    <g>
      <foreignObject x={x + width / 2 - 18} y={y - 32} width={36} height={24} style={{ pointerEvents: 'none' }}>
        <div className="flex items-center justify-center">
          <span className="bg-[#FF6B2C] text-white text-xs font-bold rounded px-2 py-0.5 shadow-sm">
            {value}
          </span>
        </div>
      </foreignObject>
    </g>
  );
};

const ShipmentChart = () => {
  const [period, setPeriod] = React.useState('week');
  const data = period === 'week' ? weekData : monthData;
  const maxValue = Math.max(...data.map(d => d.total));

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold text-[#0C4A6E]">Tren Pengiriman</CardTitle>
        <Select value={period} onValueChange={(value) => setPeriod(value)}>
          <SelectTrigger className="w-28 h-8 text-xs">
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">7 Hari</SelectItem>
            <SelectItem value="month">Per Bulan</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#0C4A6E' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#0C4A6E' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#0C4A6E', opacity: 0.1 }} />
              <Bar dataKey="total" radius={[8, 8, 0, 0]} >
                {data.map((entry, idx) => (
                  entry.total === maxValue ? (
                    <Cell key={`cell-${idx}`} fill="#FF6B2C" />
                  ) : (
                    <Cell key={`cell-${idx}`} fill="#0C4A6E" />
                  )
                ))}
                {data.map((entry, idx) => (
                  entry.total === maxValue ? (
                    <CustomBarLabel key={`label-${idx}`} x={40 + idx * 48} y={220 - (entry.total / maxValue) * 180} width={32} value={entry.total} />
                  ) : null
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentChart;
