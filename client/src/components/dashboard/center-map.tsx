import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/lib/icons';

interface Center {
  id: number;
  name: string;
  type: 'Main' | 'Satellite' | 'Operational';
  latitude: number;
  longitude: number;
}

interface CenterMapProps {
  centers?: Center[];
  isLoading?: boolean;
}

export function CenterMap({ centers = [], isLoading = false }: CenterMapProps) {
  const [filter, setFilter] = useState('all');

  // Calculate counts by type
  const mainCount = centers.filter(c => c.type === 'Main').length;
  const satelliteCount = centers.filter(c => c.type === 'Satellite').length;
  const operationalCount = centers.filter(c => c.type === 'Operational').length;

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="p-4 border-b border-neutral-200 flex flex-row justify-between items-center space-y-0">
        <CardTitle className="text-base font-medium">Center Locations</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="text-xs h-8">
            <Icon name="filter_list" className="mr-1 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8">
            <Icon name="get_app" className="mr-1 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative" style={{ height: "400px" }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="absolute inset-0 p-4">
              {/* This would be replaced with an actual map component */}
              <div className="w-full h-full bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                <div className="text-center">
                  <Icon name="map" className="text-primary h-12 w-12 mb-2" />
                  <p className="text-neutral-600">Interactive Map Visualization</p>
                  <p className="text-sm text-neutral-500">Centers shown with distribution by type</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 bg-neutral-50 text-sm rounded-b-lg">
        <div className="flex items-center justify-between w-full">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
              <span>Main Center ({mainCount || 6})</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-600 mr-2"></div>
              <span>Satellite ({satelliteCount || 12})</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
              <span>Operational Site ({operationalCount || 6})</span>
            </div>
          </div>
          <div>
            <span className="text-neutral-500">Last updated: Today, 11:32 AM</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
