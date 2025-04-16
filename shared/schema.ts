import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, date, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  email: text("email"),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
});

// Center schema
export const centers = pgTable("centers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // Main, Satellite, Operational Site
  physicalAddress: text("physical_address").notNull(),
  district: text("district").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 6 }).notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  principalName: text("principal_name").notNull(),
  facilitySizeM2: integer("facility_size_m2"),
  classroomCount: integer("classroom_count"),
  maxStudentCapacity: integer("max_student_capacity"),
  currentStudentCount: integer("current_student_count"),
  ownershipStatus: text("ownership_status"), // Owned, Leased, Partnership
  leaseStartDate: date("lease_start_date"),
  leaseEndDate: date("lease_end_date"),
  monthlyRentAmount: decimal("monthly_rent_amount", { precision: 10, scale: 2 }),
  buildingCondition: text("building_condition"), // Excellent, Good, Fair, Poor, Critical
  internetConnectivity: text("internet_connectivity"), // None, Basic, High-speed
  electricityStatus: text("electricity_status"), // Full service, Partial, None
  waterAccess: text("water_access"), // Full service, Partial, None
  surroundingIndustries: text("surrounding_industries"),
  availableResources: text("available_resources"),
  facilityNotes: text("facility_notes"),
  dateAdded: timestamp("date_added").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Lecturer schema
export const lecturers = pgTable("lecturers", {
  id: serial("id").primaryKey(),
  staffId: text("staff_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth"),
  gender: text("gender"),
  contactNumber: text("contact_number").notNull(),
  email: text("email").notNull(),
  homeAddress: text("home_address"),
  emergencyContact: text("emergency_contact"),
  employmentStatus: text("employment_status").notNull(), // Full-time, Part-time
  contractStatus: text("contract_status").notNull(), // Active, Inactive, Pending
  contractStartDate: date("contract_start_date").notNull(),
  contractEndDate: date("contract_end_date"),
  primaryCenterId: integer("primary_center_id").references(() => centers.id),
  secondaryCenterIds: jsonb("secondary_center_ids"), // Array of center IDs
  teachingHoursPerWeek: integer("teaching_hours_per_week"),
  subjectsTaught: jsonb("subjects_taught"), // Array of subjects
  highestQualification: text("highest_qualification"),
  fieldOfStudy: text("field_of_study"),
  qualificationInstitution: text("qualification_institution"),
  additionalQualifications: text("additional_qualifications"),
  yearsTeachingExperience: integer("years_teaching_experience"),
  yearsAtCurrentInstitution: integer("years_at_current_institution"),
  skillsAssessment: jsonb("skills_assessment"), // JSON array of skills
  profDevNeeds: text("prof_dev_needs"),
  performanceRating: text("performance_rating"),
  salaryGrade: text("salary_grade"),
  notes: text("notes"),
  dateAdded: timestamp("date_added").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Student schema
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  nationalId: text("national_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: text("gender"),
  contactNumber: text("contact_number"),
  email: text("email"),
  homeAddress: text("home_address"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactNumber: text("emergency_contact_number"),
  homeCenterId: integer("home_center_id").references(() => centers.id),
  registrationDate: date("registration_date").notNull(),
  academicStatus: text("academic_status").notNull(), // Active, Graduated, Withdrawn, On Leave
  previousEducationLevel: text("previous_education_level"),
  specialNeeds: text("special_needs"),
  fundingStatus: text("funding_status"),
  notes: text("notes"),
  dateAdded: timestamp("date_added").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Asset schema
export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  assetTag: text("asset_tag").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(), // IT Equipment, Furniture, Vehicle, Teaching Aid, etc.
  subCategory: text("sub_category"),
  brand: text("brand"),
  model: text("model"),
  serialNumber: text("serial_number"),
  acquisitionDate: date("acquisition_date"),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  supplier: text("supplier"),
  warrantyStartDate: date("warranty_start_date"),
  warrantyEndDate: date("warranty_end_date"),
  assignedCenterId: integer("assigned_center_id").references(() => centers.id),
  physicalLocation: text("physical_location"),
  assignedDepartment: text("assigned_department"),
  assignedUserId: integer("assigned_user_id").references(() => lecturers.id),
  condition: text("condition"), // New, Excellent, Good, Fair, Poor, Non-functional
  status: text("status"), // Available, In Use, Under Maintenance, Decommissioned
  lifespan: integer("lifespan"), // Expected life in years
  depreciationMethod: text("depreciation_method"),
  maintenanceSchedule: text("maintenance_schedule"),
  lastMaintenanceDate: date("last_maintenance_date"),
  nextMaintenanceDate: date("next_maintenance_date"),
  maintenanceHistory: jsonb("maintenance_history"), // JSON array of maintenance records
  insuranceInfo: text("insurance_info"),
  notes: text("notes"),
  dateAdded: timestamp("date_added").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Course schema
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  level: text("level"), // Beginner, Intermediate, Advanced
  credits: integer("credits"),
  durationWeeks: integer("duration_weeks"),
  prerequisites: jsonb("prerequisites"), // JSON array of course IDs
  centersOffering: jsonb("centers_offering"), // JSON array of center IDs
  maxClassSize: integer("max_class_size"),
  currentEnrollment: integer("current_enrollment"),
  industryAlignment: text("industry_alignment"),
  courseMaterials: text("course_materials"),
  requiredResources: text("required_resources"),
  courseCoordinatorId: integer("course_coordinator_id").references(() => lecturers.id),
  isActive: boolean("is_active").default(true),
  dateAdded: timestamp("date_added").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Enrollment schema (many-to-many between students and courses)
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  centerId: integer("center_id").references(() => centers.id).notNull(),
  startDate: date("start_date").notNull(),
  expectedCompletionDate: date("expected_completion_date"),
  actualCompletionDate: date("actual_completion_date"),
  grade: text("grade"),
  status: text("status").notNull(), // Active, Completed, Withdrawn, On Hold
  notes: text("notes"),
  dateAdded: timestamp("date_added").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Create insert schemas using Zod
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCenterSchema = createInsertSchema(centers).omit({ id: true, dateAdded: true, lastUpdated: true });
export const insertLecturerSchema = createInsertSchema(lecturers).omit({ id: true, dateAdded: true, lastUpdated: true });
export const insertStudentSchema = createInsertSchema(students).omit({ id: true, dateAdded: true, lastUpdated: true });
export const insertAssetSchema = createInsertSchema(assets).omit({ id: true, dateAdded: true, lastUpdated: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true, dateAdded: true, lastUpdated: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, dateAdded: true, lastUpdated: true });

// Define types from the schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCenter = z.infer<typeof insertCenterSchema>;
export type InsertLecturer = z.infer<typeof insertLecturerSchema>;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type User = typeof users.$inferSelect;
export type Center = typeof centers.$inferSelect;
export type Lecturer = typeof lecturers.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Asset = typeof assets.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
