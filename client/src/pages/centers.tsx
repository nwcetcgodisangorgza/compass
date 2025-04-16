import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Icon } from '@/lib/icons';

interface Center {
  id: number;
  name: string;
  type: string;
  address: string;
  district: string;
  principal: string;
  studentCapacity: number;
  currentStudents: number;
  buildingCondition: string;
  internetStatus: string;
}

const mockCenters: Center[] = [
  {
    id: 1,
    name: "Mahikeng Main Center",
    type: "Main",
    address: "123 Central Road, Mahikeng, North West",
    district: "Ngaka Modiri Molema",
    principal: "Dr. Thabo Mokoena",
    studentCapacity: 850,
    currentStudents: 782,
    buildingCondition: "Good",
    internetStatus: "High-speed"
  },
  {
    id: 2,
    name: "Potchefstroom Center",
    type: "Satellite",
    address: "45 Academic Avenue, Potchefstroom",
    district: "Dr Kenneth Kaunda",
    principal: "Ms. Lerato Khumalo",
    studentCapacity: 420,
    currentStudents: 385,
    buildingCondition: "Excellent",
    internetStatus: "High-speed"
  },
  {
    id: 3,
    name: "Rustenburg Learning Center",
    type: "Main",
    address: "78 Platinum Street, Rustenburg",
    district: "Bojanala",
    principal: "Mr. John Molefe",
    studentCapacity: 650,
    currentStudents: 522,
    buildingCondition: "Good",
    internetStatus: "High-speed"
  },
  {
    id: 4,
    name: "Klerksdorp Training Site",
    type: "Operational",
    address: "32 Gold Avenue, Klerksdorp",
    district: "Dr Kenneth Kaunda",
    principal: "Mrs. Sarah Venter",
    studentCapacity: 200,
    currentStudents: 112,
    buildingCondition: "Fair",
    internetStatus: "Basic"
  },
  {
    id: 5,
    name: "Vryburg Education Center",
    type: "Satellite",
    address: "15 Rural Road, Vryburg",
    district: "Dr Ruth Segomotsi Mompati",
    principal: "Mr. David Phiri",
    studentCapacity: 280,
    currentStudents: 245,
    buildingCondition: "Good",
    internetStatus: "Basic"
  },
  {
    id: 6,
    name: "Taung Satellite Center",
    type: "Satellite",
    address: "7 Heritage Street, Taung",
    district: "Dr Ruth Segomotsi Mompati",
    principal: "Ms. Nomvula Dlamini",
    studentCapacity: 180,
    currentStudents: 120,
    buildingCondition: "Good",
    internetStatus: "Basic"
  },
  {
    id: 7,
    name: "Zeerust Educational Facility",
    type: "Operational",
    address: "28 Border Road, Zeerust",
    district: "Ngaka Modiri Molema",
    principal: "Mr. Jacob Tau",
    studentCapacity: 150,
    currentStudents: 98,
    buildingCondition: "Fair",
    internetStatus: "Basic"
  }
];

export default function Centers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');

  // In a real application, we would fetch this data from API
  const { data: centers, isLoading, error } = useQuery({
    queryKey: ['/api/centers'],
    // For demonstration, immediately return mock data
    // In a real app, this would use the default query function
    queryFn: async () => mockCenters
  });

  // Filter the centers based on search term and filters
  const filteredCenters = centers?.filter(center => {
    // Apply search filter
    const matchesSearch = !searchTerm || 
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.principal.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    const matchesType = typeFilter === 'all' || center.type === typeFilter;
    
    // Apply district filter
    const matchesDistrict = districtFilter === 'all' || center.district === districtFilter;
    
    return matchesSearch && matchesType && matchesDistrict;
  });

  // Extract unique districts for the district filter
  const districts = centers ? [...new Set(centers.map(center => center.district))] : [];

  // Get badge color based on center type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Main': return 'bg-blue-100 text-primary';
      case 'Satellite': return 'bg-green-100 text-green-600';
      case 'Operational': return 'bg-amber-100 text-amber-600';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  // Get badge for building condition
  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'Excellent': return <Badge className="bg-green-100 text-green-700 border-green-200">Excellent</Badge>;
      case 'Good': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Good</Badge>;
      case 'Fair': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Fair</Badge>;
      case 'Poor': return <Badge className="bg-red-100 text-red-700 border-red-200">Poor</Badge>;
      default: return <Badge className="bg-neutral-100 text-neutral-600 border-neutral-200">{condition}</Badge>;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-1">Center Management</h1>
        <p className="text-neutral-600">Manage all educational centers across North West Province</p>
      </div>

      <Card className="shadow-sm border-0 mb-6">
        <CardHeader className="p-4">
          <CardTitle className="text-base font-medium">Centers Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <div className="flex space-x-2">
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search centers..." 
                className="max-w-xs"
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Center Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Main">Main</SelectItem>
                  <SelectItem value="Satellite">Satellite</SelectItem>
                  <SelectItem value="Operational">Operational</SelectItem>
                </SelectContent>
              </Select>
              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-primary">
              <Icon name="business" className="mr-2 h-4 w-4" />
              Add New Center
            </Button>
          </div>

          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              Error loading centers. Please try again.
            </div>
          ) : filteredCenters?.length === 0 ? (
            <div className="py-8 text-center text-neutral-500">
              No centers found matching your search criteria.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-50">
                    <TableHead className="font-medium">Center Name</TableHead>
                    <TableHead className="font-medium">Type</TableHead>
                    <TableHead className="font-medium">District</TableHead>
                    <TableHead className="font-medium">Principal</TableHead>
                    <TableHead className="font-medium">Capacity</TableHead>
                    <TableHead className="font-medium">Building</TableHead>
                    <TableHead className="font-medium">Internet</TableHead>
                    <TableHead className="font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCenters?.map((center) => (
                    <TableRow key={center.id}>
                      <TableCell className="font-medium">{center.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getTypeColor(center.type)}>
                          {center.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{center.district}</TableCell>
                      <TableCell>{center.principal}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-16 mr-2">
                            <Progress value={(center.currentStudents / center.studentCapacity) * 100} className="h-2 bg-neutral-200" />
                          </div>
                          <span className="text-sm">{center.currentStudents}/{center.studentCapacity}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getConditionBadge(center.buildingCondition)}</TableCell>
                      <TableCell>{center.internetStatus}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Icon name="search" className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Icon name="edit" className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Define a Progress component since we're using it but it's not imported
function Progress({ value, className, indicatorClassName }: { value: number, className?: string, indicatorClassName?: string }) {
  return (
    <div className={`w-full h-2 bg-neutral-200 rounded-full ${className}`}>
      <div 
        className={`h-full bg-primary rounded-full ${indicatorClassName}`} 
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
