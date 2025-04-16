import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/lib/icons';

export default function Reports() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Reports & Analytics</h1>
        <p className="text-neutral-600">Data-driven insights and custom reporting tools</p>
      </div>

      <Card className="shadow-sm border-0">
        <CardHeader className="p-4">
          <CardTitle className="text-base font-medium">Report Generator</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-12 text-center">
          <div>
            <Icon name="assessment" className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-700 mb-2">Reports & Analytics Module</h3>
            <p className="text-neutral-500 max-w-md mb-6">
              This module will provide customizable reports, data visualizations, 
              and analytics to support data-driven decision making.
            </p>
            <Button className="bg-primary">
              <Icon name="assessment" className="mr-2 h-4 w-4" />
              Initialize Reports Module
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
