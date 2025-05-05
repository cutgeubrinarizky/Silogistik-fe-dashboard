
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const statuses = [
  { name: 'Pickup', count: 15, color: 'bg-amber-500' },
  { name: 'Drop-off', count: 8, color: 'bg-blue-500' },
  { name: 'Dalam Perjalanan', count: 24, color: 'bg-purple-500' },
  { name: 'Terkirim', count: 42, color: 'bg-green-500' },
  { name: 'Gagal', count: 5, color: 'bg-red-500' },
];

const StatusSummary = () => {
  const total = statuses.reduce((sum, status) => sum + status.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Status Pengiriman</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statuses.map((status) => (
            <div key={status.name}>
              <div className="flex items-center justify-between mb-1 text-sm">
                <div className="font-medium">{status.name}</div>
                <div className="text-muted-foreground">
                  {status.count} ({Math.round((status.count / total) * 100)}%)
                </div>
              </div>
              <Progress
                value={(status.count / total) * 100}
                className={`h-2 ${status.color}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusSummary;
