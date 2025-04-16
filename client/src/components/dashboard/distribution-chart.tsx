import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/lib/icons';

interface DistributionData {
  label: string;
  value: number;
  color: string;
}

interface DistributionChartProps {
  title: string;
  data?: DistributionData[];
  isLoading?: boolean;
  description?: string;
}

export function DistributionChart({ 
  title, 
  data = [], 
  isLoading = false,
  description = "by program and center type"
}: DistributionChartProps) {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="p-4 border-b border-neutral-200">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="w-full h-80 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          // This would be replaced with an actual chart component
          <div className="w-full h-80 bg-neutral-50 rounded-lg flex items-center justify-center border border-neutral-200">
            <div className="text-center">
              <Icon name="pie_chart" className="text-neutral-400 h-12 w-12 mb-2" />
              <p className="text-neutral-600">{title} Chart</p>
              <p className="text-sm text-neutral-500">{description}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
