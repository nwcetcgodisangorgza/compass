import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Icon } from '@/lib/icons';

interface Activity {
  id: number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  content: string;
  timestamp: string;
  author: string;
}

const getMockActivities = (): Activity[] => [
  {
    id: 1,
    icon: 'business',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-primary',
    content: 'New center added to the system: <strong>Taung Satellite Center</strong>',
    timestamp: 'Today, 10:24 AM',
    author: 'Admin'
  },
  {
    id: 2,
    icon: 'school',
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    content: '3 new lecturers assigned to <strong>Potchefstroom Center</strong>',
    timestamp: 'Yesterday, 2:30 PM',
    author: 'HR Manager'
  },
  {
    id: 3,
    icon: 'people',
    iconBgColor: 'bg-amber-100',
    iconColor: 'text-amber-600',
    content: 'Student enrollment for <strong>IT Network Security</strong> program increased by 15%',
    timestamp: 'Oct 21, 2023',
    author: 'Registrar'
  },
  {
    id: 4,
    icon: 'inventory_2',
    iconBgColor: 'bg-neutral-100',
    iconColor: 'text-neutral-700',
    content: '20 new laptops allocated to <strong>Rustenburg Center</strong>',
    timestamp: 'Oct 19, 2023',
    author: 'Asset Manager'
  },
  {
    id: 5,
    icon: 'business',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-primary',
    content: 'Building condition at <strong>Klerksdorp Site</strong> updated to "Good" after renovations',
    timestamp: 'Oct 17, 2023',
    author: 'Facilities Manager'
  }
];

interface RecentActivitiesProps {
  activities?: Activity[];
  isLoading?: boolean;
}

export function RecentActivities({ activities, isLoading = false }: RecentActivitiesProps) {
  // Use provided activities or mock data if not provided
  const displayActivities = activities || getMockActivities();

  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="p-4 border-b border-neutral-200">
        <CardTitle className="text-base font-medium">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="w-full h-[320px] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {displayActivities.map(activity => (
              <li key={activity.id} className="px-4 py-3 hover:bg-neutral-50">
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className={`h-9 w-9 rounded-full ${activity.iconBgColor} flex items-center justify-center`}>
                      <Icon name={activity.icon} className={`${activity.iconColor} h-5 w-5`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-800" dangerouslySetInnerHTML={{ __html: activity.content }}></p>
                    <p className="text-xs text-neutral-500 mt-1">{activity.timestamp} by {activity.author}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="p-3 border-t border-neutral-200 justify-end">
        <a href="#" className="text-primary text-sm hover:underline">View All Activities</a>
      </CardFooter>
    </Card>
  );
}
