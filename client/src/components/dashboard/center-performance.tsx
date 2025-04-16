import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Center {
  id: number;
  name: string;
  type: 'Main' | 'Satellite' | 'Operational';
  capacity: number;
  enrollment: number;
  utilization: number;
}

const getMockCenters = (): Center[] => [
  { id: 1, name: 'Mahikeng Center', type: 'Main', capacity: 850, enrollment: 782, utilization: 92 },
  { id: 2, name: 'Potchefstroom Center', type: 'Satellite', capacity: 420, enrollment: 385, utilization: 91 },
  { id: 3, name: 'Rustenburg Center', type: 'Main', capacity: 650, enrollment: 522, utilization: 80 },
  { id: 4, name: 'Klerksdorp Site', type: 'Operational', capacity: 200, enrollment: 112, utilization: 56 },
  { id: 5, name: 'Vryburg Center', type: 'Satellite', capacity: 280, enrollment: 245, utilization: 88 },
];

interface CenterPerformanceProps {
  centers?: Center[];
  isLoading?: boolean;
}

export function CenterPerformance({ centers, isLoading = false }: CenterPerformanceProps) {
  const [filter, setFilter] = useState('all');
  
  // Use provided centers or mock data if not provided
  const displayCenters = centers || getMockCenters();
  
  // Filter centers based on selection
  const filteredCenters = filter === 'all' 
    ? displayCenters 
    : displayCenters.filter(center => center.type.toLowerCase() === filter);

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'bg-green-500';
    if (utilization >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Main': return 'bg-blue-100 text-primary';
      case 'Satellite': return 'bg-green-100 text-green-600';
      case 'Operational': return 'bg-amber-100 text-amber-600';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="p-4 border-b border-neutral-200 flex flex-row justify-between items-center space-y-0">
        <CardTitle className="text-base font-medium">Center Performance</CardTitle>
        <Select defaultValue={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] h-8 text-sm">
            <SelectValue placeholder="Select center type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Centers</SelectItem>
            <SelectItem value="main">Main Centers</SelectItem>
            <SelectItem value="satellite">Satellite Centers</SelectItem>
            <SelectItem value="operational">Operational Sites</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="w-full h-[286px] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50">
                  <TableHead className="font-medium text-neutral-600">Center Name</TableHead>
                  <TableHead className="font-medium text-neutral-600">Type</TableHead>
                  <TableHead className="font-medium text-neutral-600">Capacity</TableHead>
                  <TableHead className="font-medium text-neutral-600">Enrollment</TableHead>
                  <TableHead className="font-medium text-neutral-600">Utilization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCenters.map(center => (
                  <TableRow key={center.id} className="text-sm hover:bg-neutral-50">
                    <TableCell>{center.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTypeColor(center.type)}>
                        {center.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{center.capacity}</TableCell>
                    <TableCell>{center.enrollment}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-16 mr-2">
                          <Progress value={center.utilization} className="h-2 bg-neutral-200" indicatorClassName={getUtilizationColor(center.utilization)} />
                        </div>
                        <span>{center.utilization}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 border-t border-neutral-200 justify-end">
        <a href="/centers" className="text-primary text-sm hover:underline">View All Centers</a>
      </CardFooter>
    </Card>
  );
}
