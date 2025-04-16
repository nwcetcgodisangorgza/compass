import React from 'react';
import { useLocation } from 'wouter';
import { Icon } from '@/lib/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  user: {
    name: string;
    role: string;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const [location] = useLocation();
  
  // Get page title based on current location
  const getPageTitle = () => {
    switch (location) {
      case '/':
        return 'Dashboard';
      case '/centers':
        return 'Centers';
      case '/lecturers':
        return 'Lecturers';
      case '/students':
        return 'Students';
      case '/assets':
        return 'Assets';
      case '/courses':
        return 'Courses';
      case '/gis-mapping':
        return 'GIS Mapping';
      case '/reports':
        return 'Reports';
      default:
        return 'ASSET-PLUS';
    }
  };

  return (
    <header className="bg-white shadow-sm z-10 flex items-center justify-between h-16 px-6">
      <div className="flex items-center">
        <div className="text-sm text-neutral-500 flex items-center">
          <Icon name="home" className="mr-1 h-4 w-4" />
          <span>{getPageTitle()}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-800">
          <Icon name="search" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-neutral-800">
          <Icon name="help_outline" />
        </Button>
        
        <Button variant="ghost" size="icon" className="relative text-neutral-600 hover:text-neutral-800">
          <Icon name="notifications" />
          <Badge className="absolute top-1 right-1 bg-destructive text-white text-xs h-4 w-4 flex items-center justify-center p-0">
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
}
