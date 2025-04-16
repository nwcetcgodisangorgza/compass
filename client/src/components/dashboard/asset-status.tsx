import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Icon } from '@/lib/icons';

interface AssetCategory {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

const getMockAssetCategories = (): AssetCategory[] => [
  {
    name: 'IT Equipment',
    count: 2514,
    percentage: 45,
    color: 'bg-blue-500'
  },
  {
    name: 'Furniture',
    count: 3892,
    percentage: 30,
    color: 'bg-primary'
  },
  {
    name: 'Teaching Aids',
    count: 1628,
    percentage: 15,
    color: 'bg-amber-500'
  },
  {
    name: 'Vehicles',
    count: 48,
    percentage: 10,
    color: 'bg-green-600'
  }
];

interface AssetStatusProps {
  assetCategories?: AssetCategory[];
  isLoading?: boolean;
}

export function AssetStatus({ assetCategories, isLoading = false }: AssetStatusProps) {
  // Use provided asset categories or mock data if not provided
  const displayCategories = assetCategories || getMockAssetCategories();

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="p-4 border-b border-neutral-200">
        <CardTitle className="text-base font-medium">Asset Status</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="w-full h-[320px] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="w-full mb-4 bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-neutral-700">Assets by Condition</h3>
              </div>
              <div className="w-full h-40 flex items-center justify-center">
                <div className="text-center">
                  <Icon name="donut_large" className="text-neutral-400 h-12 w-12 mb-2" />
                  <p className="text-sm text-neutral-500">Asset condition distribution</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {displayCategories.map((category, index) => (
                <div key={index} className="p-3 bg-neutral-50 rounded border border-neutral-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-neutral-600">{category.count.toLocaleString()} items</span>
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="w-full mr-2">
                      <Progress value={category.percentage} className="h-2 bg-neutral-200" indicatorClassName={category.color} />
                    </div>
                    <span className="text-xs text-neutral-600">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="p-3 border-t border-neutral-200 justify-end">
        <a href="/assets" className="text-primary text-sm hover:underline">View Assets</a>
      </CardFooter>
    </Card>
  );
}
