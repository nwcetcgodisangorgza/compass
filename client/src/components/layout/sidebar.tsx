import React from 'react';
import { Link, useLocation } from 'wouter';
import { Icon } from '@/lib/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  user: {
    name: string;
    role: string;
  } | null;
}

interface NavItem {
  name: string;
  icon: string;
  path: string;
}

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', icon: 'dashboard', path: '/' },
  { name: 'Centers', icon: 'business', path: '/centers' },
  { name: 'Districts', icon: 'location_on', path: '/districts' },
  { name: 'Lecturers', icon: 'school', path: '/lecturers' },
  { name: 'Students', icon: 'people', path: '/students' },
  { name: 'Assets', icon: 'inventory_2', path: '/assets' },
  { name: 'Courses', icon: 'menu_book', path: '/courses' },
];

const analyticsNavItems: NavItem[] = [
  { name: 'GIS Mapping', icon: 'map', path: '/gis-mapping' },
  { name: 'Reports', icon: 'assessment', path: '/reports' },
];

export function Sidebar({ isCollapsed, onToggle, user }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside className={cn(
      "bg-white shadow-md flex flex-col fixed h-full transition-all duration-300 z-10",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center space-x-2">
          {/* Logo placeholder */}
          <div className="h-8 w-8 bg-primary rounded flex items-center justify-center text-white font-bold">NC</div>
          {!isCollapsed && <h1 className="text-lg font-medium text-neutral-800">NWCETC Compass</h1>}
        </div>
        <button 
          onClick={onToggle}
          className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
        >
          <Icon name={isCollapsed ? "menu" : "menu_open"} />
        </button>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        <nav className="py-4">
          {!isCollapsed && (
            <h2 className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Main Navigation
            </h2>
          )}
          
          {mainNavItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a className={cn(
                "flex items-center px-4 py-3 hover:bg-neutral-100",
                location === item.path 
                  ? "text-primary bg-blue-50 border-l-4 border-primary" 
                  : "text-neutral-700 border-l-4 border-transparent",
                isCollapsed && "justify-center"
              )}>
                <Icon name={item.icon} className={isCollapsed ? "mx-auto" : "mr-4"} />
                {!isCollapsed && <span>{item.name}</span>}
              </a>
            </Link>
          ))}

          {!isCollapsed && (
            <h2 className="px-4 py-2 mt-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Analytics
            </h2>
          )}
          
          {analyticsNavItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a className={cn(
                "flex items-center px-4 py-3 hover:bg-neutral-100",
                location === item.path 
                  ? "text-primary bg-blue-50 border-l-4 border-primary" 
                  : "text-neutral-700 border-l-4 border-transparent",
                isCollapsed && "justify-center"
              )}>
                <Icon name={item.icon} className={isCollapsed ? "mx-auto" : "mr-4"} />
                {!isCollapsed && <span>{item.name}</span>}
              </a>
            </Link>
          ))}
        </nav>
      </div>
      
      {!isCollapsed && user && (
        <div className="border-t border-neutral-200 p-4">
          <div className="flex items-center mb-4">
            <Avatar>
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-800">{user.name}</p>
              <p className="text-xs text-neutral-500">{user.role}</p>
            </div>
          </div>
          <a href="#" className="flex items-center text-sm text-neutral-700 hover:text-primary">
            <Icon name="logout" className="mr-2 h-4 w-4" />
            Sign Out
          </a>
        </div>
      )}
    </aside>
  );
}
