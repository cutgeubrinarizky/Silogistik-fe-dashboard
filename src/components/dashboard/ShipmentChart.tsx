
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const ShipmentChart = () => {
  const [period, setPeriod] = React.useState('week');
  const data = period === 'week' ? weekData : monthData;

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Tren Pengiriman</CardTitle>
        <Select
          defaultValue={period}
          onValueChange={(value) => setPeriod(value)}
        >
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">7 Hari</SelectItem>
            <SelectItem value="month">Per Bulan</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentChart;
