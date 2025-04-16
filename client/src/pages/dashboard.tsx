import React from 'react';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { CenterMap } from '@/components/dashboard/center-map';
import { DistributionChart } from '@/components/dashboard/distribution-chart';
import { ResourceUtilization } from '@/components/dashboard/resource-utilization';
import { CenterPerformance } from '@/components/dashboard/center-performance';
import { RecentActivities } from '@/components/dashboard/recent-activities';
import { AssetStatus } from '@/components/dashboard/asset-status';
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  // Fetch dashboard summary data
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['/api/dashboard/summary'],
    // Fallback error handling with default values
    onError: (error) => {
      console.error('Failed to fetch summary data:', error);
    }
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Executive Dashboard</h1>
        <p className="text-neutral-600">Overview of North West CET College operations and resources</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Total Centers"
          count={24}
          changeText="2 new"
          changeType="positive"
          icon="business"
          iconBgColor="bg-blue-100"
          iconColor="text-primary"
          periodText="since last quarter"
        />
        <SummaryCard
          title="Total Lecturers"
          count={186}
          changeText="12 new"
          changeType="positive" 
          icon="school"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          periodText="since last quarter"
        />
        <SummaryCard
          title="Enrolled Students"
          count={4238}
          changeText="3.2%"
          changeType="negative"
          icon="people"
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
          periodText="from previous period"
        />
        <SummaryCard
          title="Total Assets"
          count={8542}
          changeText="87 new"
          changeType="positive"
          icon="inventory_2"
          iconBgColor="bg-neutral-100"
          iconColor="text-neutral-700"
          periodText="since last month"
        />
      </div>

      {/* Map and Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <CenterMap isLoading={false} />
        </div>
        <div>
          <DistributionChart 
            title="Student Distribution"
            isLoading={false}
          />
        </div>
      </div>

      {/* Resource Utilization and Center Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ResourceUtilization isLoading={false} />
        <CenterPerformance isLoading={false} />
      </div>

      {/* Recent Activities and Assets Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivities isLoading={false} />
        </div>
        <div>
          <AssetStatus isLoading={false} />
        </div>
      </div>
    </div>
  );
}
