import { supabase } from '../server/supabase';
import { InsertCenter, InsertAsset, InsertDistrict } from '../shared/schema';

async function seedCenters() {
  const centers: InsertCenter[] = [
    {
      name: "North West Campus - Mafikeng",
      type: "Main Campus",
      physicalAddress: "23 University Drive, Mafikeng, 2745",
      district: "Ngaka Modiri Molema",
      latitude: "-25.8539",
      longitude: "25.6447",
      phoneNumber: "018 555 1234",
      email: "mafikeng@nwcetc.edu.za",
      principalName: "Dr. Thabo Mokoena",
      facilitySizeM2: 25000,
      classroomCount: 35,
      maxStudentCapacity: 1200,
      currentStudentCount: 950,
      ownershipStatus: "Owned",
      buildingCondition: "Good",
      internetConnectivity: "High-speed",
      electricityStatus: "Full service",
      waterAccess: "Full service",
      surroundingIndustries: "Agriculture, Mining, Education",
      availableResources: "Computer labs, Library, Sports facilities",
      isActive: true
    },
    {
      name: "North West Campus - Mahikeng",
      type: "Branch Campus",
      physicalAddress: "15 College Road, Mahikeng, 2735",
      district: "Ngaka Modiri Molema",
      latitude: "-25.8312",
      longitude: "25.5444",
      phoneNumber: "018 555 5678",
      email: "mahikeng@nwcetc.edu.za",
      principalName: "Prof. Lerato Khumalo",
      facilitySizeM2: 18000,
      classroomCount: 25,
      maxStudentCapacity: 800,
      currentStudentCount: 650,
      ownershipStatus: "Leased",
      leaseStartDate: new Date("2020-01-01"),
      leaseEndDate: new Date("2025-12-31"),
      monthlyRentAmount: "85000",
      buildingCondition: "Good",
      internetConnectivity: "High-speed",
      electricityStatus: "Full service",
      waterAccess: "Full service",
      surroundingIndustries: "Retail, Government services",
      availableResources: "Computer labs, Workshop facilities",
      isActive: true
    },
    {
      name: "North West Training Center - Rustenburg",
      type: "Training Center",
      physicalAddress: "78 Platinum Road, Rustenburg, 0299",
      district: "Bojanala Platinum",
      latitude: "-25.6546",
      longitude: "27.2400",
      phoneNumber: "014 555 9012",
      email: "rustenburg@nwcetc.edu.za",
      principalName: "Mrs. Nomsa Mabaso",
      facilitySizeM2: 12000,
      classroomCount: 18,
      maxStudentCapacity: 500,
      currentStudentCount: 380,
      ownershipStatus: "Owned",
      buildingCondition: "Excellent",
      internetConnectivity: "High-speed",
      electricityStatus: "Full service",
      waterAccess: "Full service",
      surroundingIndustries: "Mining, Manufacturing, Hospitality",
      availableResources: "Mining simulation lab, Computer facilities",
      isActive: true
    }
  ];

  for (const center of centers) {
    const { data, error } = await supabase
      .from('centers')
      .select('*')
      .eq('name', center.name);
    
    if (error) {
      console.error('Error checking if center exists:', error);
      continue;
    }
    
    if (data && data.length > 0) {
      console.log(`Center '${center.name}' already exists. Skipping.`);
      continue;
    }
    
    const { error: insertError } = await supabase
      .from('centers')
      .insert(center);
    
    if (insertError) {
      console.error(`Error inserting center '${center.name}':`, insertError);
    } else {
      console.log(`Successfully inserted center '${center.name}'`);
    }
  }
}

async function seedAssets() {
  const assets: InsertAsset[] = [
    {
      assetTag: "IT-COMP-1001",
      name: "Dell Desktop Computer",
      category: "IT Equipment",
      subCategory: "Desktop Computer",
      brand: "Dell",
      model: "OptiPlex 7090",
      serialNumber: "DELL7090XYZ123",
      acquisitionDate: new Date("2023-02-15"),
      purchasePrice: "12500.00",
      currentValue: "10500.00",
      supplier: "Dell South Africa",
      warrantyStartDate: new Date("2023-02-15"),
      warrantyEndDate: new Date("2026-02-14"),
      physicalLocation: "Computer Lab A, Main Building",
      condition: "Excellent",
      status: "In Use",
      lifespan: 5,
      depreciationMethod: "Straight Line",
      notes: "Used for programming classes and student computer training"
    },
    {
      assetTag: "FURN-DESK-2001",
      name: "Student Desk",
      category: "Furniture",
      subCategory: "Desk",
      brand: "OfficeWorks",
      model: "Student Station Pro",
      serialNumber: "OW-SS-2023-456",
      acquisitionDate: new Date("2023-01-10"),
      purchasePrice: "2200.00",
      currentValue: "1980.00",
      supplier: "OfficeWorks SA",
      warrantyStartDate: new Date("2023-01-10"),
      warrantyEndDate: new Date("2025-01-09"),
      physicalLocation: "Classroom 101, East Wing",
      condition: "Good",
      status: "In Use",
      lifespan: 8,
      depreciationMethod: "Straight Line",
      notes: "Standard student desks for classrooms"
    },
    {
      assetTag: "TEACH-PROJ-3001",
      name: "Epson Projector",
      category: "Teaching Aid",
      subCategory: "Projector",
      brand: "Epson",
      model: "PowerLite 2250U",
      serialNumber: "EPSN2250U789",
      acquisitionDate: new Date("2022-08-22"),
      purchasePrice: "9800.00",
      currentValue: "8400.00",
      supplier: "Digital Solutions",
      warrantyStartDate: new Date("2022-08-22"),
      warrantyEndDate: new Date("2024-08-21"),
      physicalLocation: "Lecture Hall B, West Building",
      condition: "Good",
      status: "In Use",
      lifespan: 5,
      depreciationMethod: "Straight Line",
      notes: "High-definition projector for large lecture halls"
    }
  ];

  for (const asset of assets) {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('assetTag', asset.assetTag);
    
    if (error) {
      console.error('Error checking if asset exists:', error);
      continue;
    }
    
    if (data && data.length > 0) {
      console.log(`Asset '${asset.name}' (${asset.assetTag}) already exists. Skipping.`);
      continue;
    }
    
    const { error: insertError } = await supabase
      .from('assets')
      .insert(asset);
    
    if (insertError) {
      console.error(`Error inserting asset '${asset.name}':`, insertError);
    } else {
      console.log(`Successfully inserted asset '${asset.name}'`);
    }
  }
}

async function seedDistricts() {
  const districts: InsertDistrict[] = [
    {
      name: "Ngaka Modiri Molema",
      code: "DC38",
      region: "Central",
      province: "North West",
      population: 842699,
      area: "28206.00",
      mainCity: "Mafikeng",
      description: "A district municipality located in the central part of North West Province",
      economicActivities: "Agriculture, Mining, Government Services, Education",
      infrastructureRating: "Good",
      isActive: true
    },
    {
      name: "Bojanala Platinum",
      code: "DC37",
      region: "Eastern",
      province: "North West",
      population: 1657148,
      area: "18333.00",
      mainCity: "Rustenburg",
      description: "A district municipality in the northeastern part of North West Province",
      economicActivities: "Mining (Platinum), Manufacturing, Tourism, Agriculture",
      infrastructureRating: "Good",
      isActive: true
    },
    {
      name: "Dr Kenneth Kaunda",
      code: "DC40",
      region: "Southern",
      province: "North West",
      population: 742821,
      area: "14642.00",
      mainCity: "Klerksdorp",
      description: "A district municipality in the southern part of North West Province",
      economicActivities: "Mining (Gold), Agriculture, Manufacturing",
      infrastructureRating: "Fair",
      isActive: true
    }
  ];

  for (const district of districts) {
    const { data, error } = await supabase
      .from('districts')
      .select('*')
      .eq('code', district.code);
    
    if (error) {
      console.error('Error checking if district exists:', error);
      continue;
    }
    
    if (data && data.length > 0) {
      console.log(`District '${district.name}' already exists. Skipping.`);
      continue;
    }
    
    const { error: insertError } = await supabase
      .from('districts')
      .insert(district);
    
    if (insertError) {
      console.error(`Error inserting district '${district.name}':`, insertError);
    } else {
      console.log(`Successfully inserted district '${district.name}'`);
    }
  }
}

async function main() {
  try {
    console.log('Starting data seeding...');
    
    // Seed the districts first as they are referenced by centers
    await seedDistricts();
    console.log('Districts seeding complete.');
    
    // Seed centers next
    await seedCenters();
    console.log('Centers seeding complete.');
    
    // Seed assets last
    await seedAssets();
    console.log('Assets seeding complete.');
    
    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error during data seeding:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seed script
main();