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

interface District {
  id: number;
  name: string;
  code: string;
  region: string;
  province: string;
  isActive: boolean;
  population: number;
  area: number; // in square kilometers
  centerCount: number;
  studentCount: number;
  createdAt: string;
}

const mockDistricts: District[] = [
  {
    id: 1,
    name: "Ngaka Modiri Molema",
    code: "NMM",
    region: "Central",
    province: "North West",
    isActive: true,
    population: 842700,
    area: 28206,
    centerCount: 12,
    studentCount: 3450,
    createdAt: "2020-03-15"
  },
  {
    id: 2,
    name: "Dr Kenneth Kaunda",
    code: "DKK",
    region: "Southern",
    province: "North West",
    isActive: true,
    population: 716400,
    area: 14642,
    centerCount: 8,
    studentCount: 2180,
    createdAt: "2020-03-15"
  },
  {
    id: 3,
    name: "Bojanala",
    code: "BJN",
    region: "Eastern",
    province: "North West",
    isActive: true,
    population: 1657100,
    area: 18333,
    centerCount: 15,
    studentCount: 4200,
    createdAt: "2020-03-15"
  },
  {
    id: 4,
    name: "Dr Ruth Segomotsi Mompati",
    code: "RSM",
    region: "Western",
    province: "North West",
    isActive: true,
    population: 459900,
    area: 27571,
    centerCount: 6,
    studentCount: 980,
    createdAt: "2020-03-15"
  }
];

export default function Districts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');

  // In a real application, we would fetch this data from API
  const { data: districts, isLoading, error } = useQuery({
    queryKey: ['/api/districts'],
    // For demonstration, immediately return mock data
    // In a real app, this would use the default query function
    queryFn: async () => mockDistricts
  });

  // Filter the districts based on search term and filters
  const filteredDistricts = districts?.filter(district => {
    // Apply search filter
    const matchesSearch = !searchTerm || 
      district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply region filter
    const matchesRegion = regionFilter === 'all' || district.region === regionFilter;
    
    return matchesSearch && matchesRegion;
  });

  // Extract unique regions for the region filter
  const regions = districts ? [...new Set(districts.map(district => district.region))] : [];

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-1">District Management</h1>
        <p className="text-neutral-600">Manage educational districts across North West Province</p>
      </div>

      <Card className="shadow-sm border-0 mb-6">
        <CardHeader className="p-4">
          <CardTitle className="text-base font-medium">Districts Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <div className="flex space-x-2">
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search districts..." 
                className="max-w-xs"
              />
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-primary">
              <Icon name="location_on" className="mr-2 h-4 w-4" />
              Add New District
            </Button>
          </div>

          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              Error loading districts. Please try again.
            </div>
          ) : filteredDistricts?.length === 0 ? (
            <div className="py-8 text-center text-neutral-500">
              No districts found matching your search criteria.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-50">
                    <TableHead className="font-medium">District Name</TableHead>
                    <TableHead className="font-medium">Code</TableHead>
                    <TableHead className="font-medium">Region</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium">Population</TableHead>
                    <TableHead className="font-medium">Area (km²)</TableHead>
                    <TableHead className="font-medium">Centers</TableHead>
                    <TableHead className="font-medium">Students</TableHead>
                    <TableHead className="font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDistricts?.map((district) => (
                    <TableRow key={district.id}>
                      <TableCell className="font-medium">{district.name}</TableCell>
                      <TableCell>{district.code}</TableCell>
                      <TableCell>{district.region}</TableCell>
                      <TableCell>
                        {district.isActive ? (
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatNumber(district.population)}</TableCell>
                      <TableCell>{formatNumber(district.area)}</TableCell>
                      <TableCell>{district.centerCount}</TableCell>
                      <TableCell>{formatNumber(district.studentCount)}</TableCell>
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