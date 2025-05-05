import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const StatCard = ({
  title,
  value,
  icon,
  description,
  trend,
  trendLabel,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-medium leading-none tracking-tight">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            
            {trend !== undefined && (
              <div className={cn("text-xs font-medium", trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-gray-500")}>
                <span className="inline-block mr-1">
                  {trend > 0 ? '↑' : trend < 0 ? '↓' : '•'}
                </span>
                <span>
                  {Math.abs(trend)}% {trendLabel || 'dari minggu lalu'}
                </span>
              </div>
            )}
          </div>
          
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
