import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icon } from '@/lib/icons';

interface ResourceUtilizationProps {
  data?: any[];
  isLoading?: boolean;
}

export function ResourceUtilization({ data = [], isLoading = false }: ResourceUtilizationProps) {
  const [timeframe, setTimeframe] = useState('30days');

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="p-4 border-b border-neutral-200 flex flex-row justify-between items-center space-y-0">
        <CardTitle className="text-base font-medium">Resource Utilization</CardTitle>
        <Select defaultValue={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px] h-8 text-sm">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="ytd">Year to Date</SelectItem>
          </SelectContent>
        </Select>
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
              <Icon name="bar_chart" className="text-neutral-400 h-12 w-12 mb-2" />
              <p className="text-neutral-600">Resource Utilization Chart</p>
              <p className="text-sm text-neutral-500">comparing allocation vs. actual usage</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
