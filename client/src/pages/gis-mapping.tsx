import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/lib/icons';

export default function GISMapping() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-1">GIS Mapping</h1>
        <p className="text-neutral-600">Geographic visualization of centers and resources</p>
      </div>

      <Card className="shadow-sm border-0">
        <CardHeader className="p-4 flex flex-row justify-between items-center space-y-0">
          <CardTitle className="text-base font-medium">Geographic Information System</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-xs h-8">
              <Icon name="filter_list" className="mr-1 h-4 w-4" />
              Filter Map
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-8">
              <Icon name="get_app" className="mr-1 h-4 w-4" />
              Export Map
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative" style={{ height: "600px" }}>
            <div className="absolute inset-0 p-4">
              {/* This would be replaced with an actual map component */}
              <div className="w-full h-full bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                <div className="text-center">
                  <Icon name="map" className="text-primary h-16 w-16 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-700 mb-2">Interactive GIS Map</h3>
                  <p className="text-neutral-500 max-w-md mb-6">
                    This module will provide an interactive geographic mapping system 
                    to visualize centers, resources, and educational coverage across the region.
                  </p>
                  <Button className="bg-primary">
                    <Icon name="map" className="mr-2 h-4 w-4" />
                    Initialize GIS Module
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
