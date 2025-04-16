import React from 'react';
import {
  LayoutDashboard,
  Building,
  GraduationCap,
  Users,
  Package,
  BookOpen,
  Map,
  BarChart3,
  Search,
  Bell,
  HelpCircle,
  Menu,
  LogOut,
  ChevronUp,
  ChevronDown,
  Download,
  Filter,
  Home,
  PieChart,
} from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
}

export const Icon = ({ name, className = "", ...props }: IconProps) => {
  const iconMap: Record<string, React.ReactNode> = {
    dashboard: <LayoutDashboard {...props} className={className} />,
    business: <Building {...props} className={className} />,
    centers: <Building {...props} className={className} />,
    school: <GraduationCap {...props} className={className} />,
    lecturers: <GraduationCap {...props} className={className} />,
    people: <Users {...props} className={className} />,
    students: <Users {...props} className={className} />,
    inventory_2: <Package {...props} className={className} />,
    assets: <Package {...props} className={className} />,
    menu_book: <BookOpen {...props} className={className} />,
    courses: <BookOpen {...props} className={className} />,
    map: <Map {...props} className={className} />,
    gisMapping: <Map {...props} className={className} />,
    assessment: <BarChart3 {...props} className={className} />,
    reports: <BarChart3 {...props} className={className} />,
    search: <Search {...props} className={className} />,
    notifications: <Bell {...props} className={className} />,
    help_outline: <HelpCircle {...props} className={className} />,
    menu: <Menu {...props} className={className} />,
    menu_open: <Menu {...props} className={className} />,
    logout: <LogOut {...props} className={className} />,
    arrow_upward: <ChevronUp {...props} className={className} />,
    arrow_downward: <ChevronDown {...props} className={className} />,
    get_app: <Download {...props} className={className} />,
    filter_list: <Filter {...props} className={className} />,
    home: <Home {...props} className={className} />,
    pie_chart: <PieChart {...props} className={className} />,
    bar_chart: <BarChart3 {...props} className={className} />,
    donut_large: <PieChart {...props} className={className} />,
  };

  return <>{iconMap[name] || <span>{name}</span>}</>;
};
