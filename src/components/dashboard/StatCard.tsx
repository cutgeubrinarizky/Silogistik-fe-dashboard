
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
    <Card className={cn("overflow-hidden border-0 shadow-card hover:shadow-lg transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            
            {trend !== undefined && (
              <div className={cn(
                "flex items-center mt-3 text-xs font-medium rounded-full px-2 py-0.5 w-fit",
                trend > 0 ? "bg-green-50 text-green-600" : 
                trend < 0 ? "bg-red-50 text-red-600" : 
                "bg-gray-50 text-gray-600"
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
          
          <div className="p-2.5 bg-gradient-to-br from-modern-primary to-modern-accent rounded-xl text-white">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
