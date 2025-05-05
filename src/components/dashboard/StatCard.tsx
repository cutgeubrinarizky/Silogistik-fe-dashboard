
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
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
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            
            {trend !== undefined && (
              <div className={cn(
                "flex items-center mt-2 text-xs font-medium",
                trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-gray-500"
              )}>
                <span>
                  {trend > 0 ? '↑' : trend < 0 ? '↓' : '•'}
                </span>
                <span className="ml-1">
                  {Math.abs(trend)}% {trendLabel || 'dari minggu lalu'}
                </span>
              </div>
            )}
          </div>
          
          <div className="p-2 bg-logistics-50 rounded-md text-logistics-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
