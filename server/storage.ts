import { 
  User, InsertUser,
  Center, InsertCenter,
  Lecturer, InsertLecturer,
  Student, InsertStudent,
  Asset, InsertAsset,
  Course, InsertCourse,
  Enrollment, InsertEnrollment,
  District, InsertDistrict
} from "@shared/schema";

// Extend the storage interface with CRUD methods for all entities
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Center methods
  getCenter(id: number): Promise<Center | undefined>;
  getCenters(): Promise<Center[]>;
  createCenter(center: InsertCenter): Promise<Center>;
  updateCenter(id: number, center: Partial<Center>): Promise<Center | undefined>;
  deleteCenter(id: number): Promise<boolean>;
  
  // Lecturer methods
  getLecturer(id: number): Promise<Lecturer | undefined>;
  getLecturers(): Promise<Lecturer[]>;
  createLecturer(lecturer: InsertLecturer): Promise<Lecturer>;
  updateLecturer(id: number, lecturer: Partial<Lecturer>): Promise<Lecturer | undefined>;
  deleteLecturer(id: number): Promise<boolean>;
  
  // Student methods
  getStudent(id: number): Promise<Student | undefined>;
  getStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<Student>): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<boolean>;
  
  // Asset methods
  getAsset(id: number): Promise<Asset | undefined>;
  getAssets(): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: number, asset: Partial<Asset>): Promise<Asset | undefined>;
  deleteAsset(id: number): Promise<boolean>;
  
  // Course methods
  getCourse(id: number): Promise<Course | undefined>;
  getCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<Course>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;
  
  // Enrollment methods
  getEnrollment(id: number): Promise<Enrollment | undefined>;
  getEnrollments(): Promise<Enrollment[]>;
  getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]>;
  getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: number, enrollment: Partial<Enrollment>): Promise<Enrollment | undefined>;
  deleteEnrollment(id: number): Promise<boolean>;
  
  // District methods
  getDistrict(id: number): Promise<District | undefined>;
  getDistricts(): Promise<District[]>;
  createDistrict(district: InsertDistrict): Promise<District>;
  updateDistrict(id: number, district: Partial<District>): Promise<District | undefined>;
  deleteDistrict(id: number): Promise<boolean>;
  
  // Dashboard methods
  getDashboardSummary(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private centers: Map<number, Center>;
  private lecturers: Map<number, Lecturer>;
  private students: Map<number, Student>;
  private assets: Map<number, Asset>;
  private courses: Map<number, Course>;
  private enrollments: Map<number, Enrollment>;
  private districts: Map<number, District>;
  
  private userId: number = 1;
  private centerId: number = 1;
  private lecturerId: number = 1;
  private studentId: number = 1;
  private assetId: number = 1;
  private courseId: number = 1;
  private enrollmentId: number = 1;
  private districtId: number = 1;

  constructor() {
    this.users = new Map();
    this.centers = new Map();
    this.lecturers = new Map();
    this.students = new Map();
    this.assets = new Map();
    this.courses = new Map();
    this.enrollments = new Map();
    this.districts = new Map();
    
    // Initialize with sample admin user
    this.createUser({
      username: "admin",
      password: "password", // In a real app, this would be hashed
      name: "John Ndlovu",
      role: "System Administrator",
      email: "admin@nwcet.edu.za",
      isActive: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      lastLogin: insertUser.lastLogin || now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Center methods
  async getCenter(id: number): Promise<Center | undefined> {
    return this.centers.get(id);
  }

  async getCenters(): Promise<Center[]> {
    return Array.from(this.centers.values());
  }

  async createCenter(insertCenter: InsertCenter): Promise<Center> {
    const id = this.centerId++;
    const now = new Date();
    const center: Center = { 
      ...insertCenter, 
      id,
      dateAdded: now,
      lastUpdated: now 
    };
    this.centers.set(id, center);
    return center;
  }

  async updateCenter(id: number, updateData: Partial<Center>): Promise<Center | undefined> {
    const center = await this.getCenter(id);
    if (!center) return undefined;
    
    const updatedCenter = { 
      ...center, 
      ...updateData,
      lastUpdated: new Date() 
    };
    this.centers.set(id, updatedCenter);
    return updatedCenter;
  }

  async deleteCenter(id: number): Promise<boolean> {
    return this.centers.delete(id);
  }

  // Lecturer methods
  async getLecturer(id: number): Promise<Lecturer | undefined> {
    return this.lecturers.get(id);
  }

  async getLecturers(): Promise<Lecturer[]> {
    return Array.from(this.lecturers.values());
  }

  async createLecturer(insertLecturer: InsertLecturer): Promise<Lecturer> {
    const id = this.lecturerId++;
    const now = new Date();
    const lecturer: Lecturer = { 
      ...insertLecturer, 
      id,
      dateAdded: now,
      lastUpdated: now 
    };
    this.lecturers.set(id, lecturer);
    return lecturer;
  }

  async updateLecturer(id: number, updateData: Partial<Lecturer>): Promise<Lecturer | undefined> {
    const lecturer = await this.getLecturer(id);
    if (!lecturer) return undefined;
    
    const updatedLecturer = { 
      ...lecturer, 
      ...updateData,
      lastUpdated: new Date() 
    };
    this.lecturers.set(id, updatedLecturer);
    return updatedLecturer;
  }

  async deleteLecturer(id: number): Promise<boolean> {
    return this.lecturers.delete(id);
  }

  // Student methods
  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.studentId++;
    const now = new Date();
    const student: Student = { 
      ...insertStudent, 
      id,
      dateAdded: now,
      lastUpdated: now 
    };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: number, updateData: Partial<Student>): Promise<Student | undefined> {
    const student = await this.getStudent(id);
    if (!student) return undefined;
    
    const updatedStudent = { 
      ...student, 
      ...updateData,
      lastUpdated: new Date() 
    };
    this.students.set(id, updatedStudent);
    return updatedStudent;
  }

  async deleteStudent(id: number): Promise<boolean> {
    return this.students.delete(id);
  }

  // Asset methods
  async getAsset(id: number): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = this.assetId++;
    const now = new Date();
    const asset: Asset = { 
      ...insertAsset, 
      id,
      dateAdded: now,
      lastUpdated: now 
    };
    this.assets.set(id, asset);
    return asset;
  }

  async updateAsset(id: number, updateData: Partial<Asset>): Promise<Asset | undefined> {
    const asset = await this.getAsset(id);
    if (!asset) return undefined;
    
    const updatedAsset = { 
      ...asset, 
      ...updateData,
      lastUpdated: new Date() 
    };
    this.assets.set(id, updatedAsset);
    return updatedAsset;
  }

  async deleteAsset(id: number): Promise<boolean> {
    return this.assets.delete(id);
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseId++;
    const now = new Date();
    const course: Course = { 
      ...insertCourse, 
      id,
      dateAdded: now,
      lastUpdated: now 
    };
    this.courses.set(id, course);
    return course;
  }

  async updateCourse(id: number, updateData: Partial<Course>): Promise<Course | undefined> {
    const course = await this.getCourse(id);
    if (!course) return undefined;
    
    const updatedCourse = { 
      ...course, 
      ...updateData,
      lastUpdated: new Date() 
    };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<boolean> {
    return this.courses.delete(id);
  }

  // Enrollment methods
  async getEnrollment(id: number): Promise<Enrollment | undefined> {
    return this.enrollments.get(id);
  }

  async getEnrollments(): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values());
  }

  async getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      enrollment => enrollment.studentId === studentId
    );
  }

  async getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      enrollment => enrollment.courseId === courseId
    );
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.enrollmentId++;
    const now = new Date();
    const enrollment: Enrollment = { 
      ...insertEnrollment, 
      id,
      dateAdded: now,
      lastUpdated: now 
    };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  async updateEnrollment(id: number, updateData: Partial<Enrollment>): Promise<Enrollment | undefined> {
    const enrollment = await this.getEnrollment(id);
    if (!enrollment) return undefined;
    
    const updatedEnrollment = { 
      ...enrollment, 
      ...updateData,
      lastUpdated: new Date() 
    };
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  async deleteEnrollment(id: number): Promise<boolean> {
    return this.enrollments.delete(id);
  }

  // District methods
  async getDistrict(id: number): Promise<District | undefined> {
    return this.districts.get(id);
  }

  async getDistricts(): Promise<District[]> {
    return Array.from(this.districts.values());
  }

  async createDistrict(insertDistrict: InsertDistrict): Promise<District> {
    const id = this.districtId++;
    const now = new Date();
    const district: District = { 
      ...insertDistrict, 
      id,
      dateAdded: now,
      lastUpdated: now 
    };
    this.districts.set(id, district);
    return district;
  }

  async updateDistrict(id: number, updateData: Partial<District>): Promise<District | undefined> {
    const district = await this.getDistrict(id);
    if (!district) return undefined;
    
    const updatedDistrict = { 
      ...district, 
      ...updateData,
      lastUpdated: new Date() 
    };
    this.districts.set(id, updatedDistrict);
    return updatedDistrict;
  }

  async deleteDistrict(id: number): Promise<boolean> {
    return this.districts.delete(id);
  }

  // Dashboard methods
  async getDashboardSummary(): Promise<any> {
    return {
      centerCount: this.centers.size,
      lecturerCount: this.lecturers.size,
      studentCount: this.students.size,
      assetCount: this.assets.size,
      districtCount: this.districts.size,
      centersByType: {
        main: Array.from(this.centers.values()).filter(c => c.type === 'Main').length,
        satellite: Array.from(this.centers.values()).filter(c => c.type === 'Satellite').length,
        operational: Array.from(this.centers.values()).filter(c => c.type === 'Operational Site').length,
      },
      studentsByStatus: {
        active: Array.from(this.students.values()).filter(s => s.academicStatus === 'Active').length,
        graduated: Array.from(this.students.values()).filter(s => s.academicStatus === 'Graduated').length,
        withdrawn: Array.from(this.students.values()).filter(s => s.academicStatus === 'Withdrawn').length,
        onLeave: Array.from(this.students.values()).filter(s => s.academicStatus === 'On Leave').length,
      },
      assetsByCategory: {
        itEquipment: Array.from(this.assets.values()).filter(a => a.category === 'IT Equipment').length,
        furniture: Array.from(this.assets.values()).filter(a => a.category === 'Furniture').length,
        vehicle: Array.from(this.assets.values()).filter(a => a.category === 'Vehicle').length,
        teachingAid: Array.from(this.assets.values()).filter(a => a.category === 'Teaching Aid').length,
        officeEquipment: Array.from(this.assets.values()).filter(a => a.category === 'Office Equipment').length,
      }
    };
  }
}

import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import * as schema from "@shared/schema";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(schema.users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(schema.users)
      .set(updateData)
      .where(eq(schema.users.id, id))
      .returning();
    return user;
  }
  
  // Center methods
  async getCenter(id: number): Promise<Center | undefined> {
    const [center] = await db.select().from(schema.centers).where(eq(schema.centers.id, id));
    return center || undefined;
  }

  async getCenters(): Promise<Center[]> {
    return db.select().from(schema.centers);
  }

  async createCenter(insertCenter: InsertCenter): Promise<Center> {
    const [center] = await db
      .insert(schema.centers)
      .values(insertCenter)
      .returning();
    return center;
  }

  async updateCenter(id: number, updateData: Partial<Center>): Promise<Center | undefined> {
    const [center] = await db
      .update(schema.centers)
      .set(updateData)
      .where(eq(schema.centers.id, id))
      .returning();
    return center;
  }

  async deleteCenter(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.centers)
      .where(eq(schema.centers.id, id));
    return true; // Assuming deletion was successful if no error was thrown
  }
  
  // Lecturer methods
  async getLecturer(id: number): Promise<Lecturer | undefined> {
    const [lecturer] = await db.select().from(schema.lecturers).where(eq(schema.lecturers.id, id));
    return lecturer || undefined;
  }

  async getLecturers(): Promise<Lecturer[]> {
    return db.select().from(schema.lecturers);
  }

  async createLecturer(insertLecturer: InsertLecturer): Promise<Lecturer> {
    const [lecturer] = await db
      .insert(schema.lecturers)
      .values(insertLecturer)
      .returning();
    return lecturer;
  }

  async updateLecturer(id: number, updateData: Partial<Lecturer>): Promise<Lecturer | undefined> {
    const [lecturer] = await db
      .update(schema.lecturers)
      .set(updateData)
      .where(eq(schema.lecturers.id, id))
      .returning();
    return lecturer;
  }

  async deleteLecturer(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.lecturers)
      .where(eq(schema.lecturers.id, id));
    return true;
  }
  
  // Student methods
  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(schema.students).where(eq(schema.students.id, id));
    return student || undefined;
  }

  async getStudents(): Promise<Student[]> {
    return db.select().from(schema.students);
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await db
      .insert(schema.students)
      .values(insertStudent)
      .returning();
    return student;
  }

  async updateStudent(id: number, updateData: Partial<Student>): Promise<Student | undefined> {
    const [student] = await db
      .update(schema.students)
      .set(updateData)
      .where(eq(schema.students.id, id))
      .returning();
    return student;
  }

  async deleteStudent(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.students)
      .where(eq(schema.students.id, id));
    return true;
  }
  
  // Asset methods
  async getAsset(id: number): Promise<Asset | undefined> {
    const [asset] = await db.select().from(schema.assets).where(eq(schema.assets.id, id));
    return asset || undefined;
  }

  async getAssets(): Promise<Asset[]> {
    return db.select().from(schema.assets);
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const [asset] = await db
      .insert(schema.assets)
      .values(insertAsset)
      .returning();
    return asset;
  }

  async updateAsset(id: number, updateData: Partial<Asset>): Promise<Asset | undefined> {
    const [asset] = await db
      .update(schema.assets)
      .set(updateData)
      .where(eq(schema.assets.id, id))
      .returning();
    return asset;
  }

  async deleteAsset(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.assets)
      .where(eq(schema.assets.id, id));
    return true;
  }
  
  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(schema.courses).where(eq(schema.courses.id, id));
    return course || undefined;
  }

  async getCourses(): Promise<Course[]> {
    return db.select().from(schema.courses);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db
      .insert(schema.courses)
      .values(insertCourse)
      .returning();
    return course;
  }

  async updateCourse(id: number, updateData: Partial<Course>): Promise<Course | undefined> {
    const [course] = await db
      .update(schema.courses)
      .set(updateData)
      .where(eq(schema.courses.id, id))
      .returning();
    return course;
  }

  async deleteCourse(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.courses)
      .where(eq(schema.courses.id, id));
    return true;
  }
  
  // Enrollment methods
  async getEnrollment(id: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(schema.enrollments).where(eq(schema.enrollments.id, id));
    return enrollment || undefined;
  }

  async getEnrollments(): Promise<Enrollment[]> {
    return db.select().from(schema.enrollments);
  }

  async getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]> {
    return db
      .select()
      .from(schema.enrollments)
      .where(eq(schema.enrollments.studentId, studentId));
  }

  async getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]> {
    return db
      .select()
      .from(schema.enrollments)
      .where(eq(schema.enrollments.courseId, courseId));
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db
      .insert(schema.enrollments)
      .values(insertEnrollment)
      .returning();
    return enrollment;
  }

  async updateEnrollment(id: number, updateData: Partial<Enrollment>): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .update(schema.enrollments)
      .set(updateData)
      .where(eq(schema.enrollments.id, id))
      .returning();
    return enrollment;
  }

  async deleteEnrollment(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.enrollments)
      .where(eq(schema.enrollments.id, id));
    return true;
  }
  
  // District methods
  async getDistrict(id: number): Promise<District | undefined> {
    const [district] = await db.select().from(schema.districts).where(eq(schema.districts.id, id));
    return district || undefined;
  }

  async getDistricts(): Promise<District[]> {
    return db.select().from(schema.districts);
  }

  async createDistrict(insertDistrict: InsertDistrict): Promise<District> {
    const [district] = await db
      .insert(schema.districts)
      .values(insertDistrict)
      .returning();
    return district;
  }

  async updateDistrict(id: number, updateData: Partial<District>): Promise<District | undefined> {
    const [district] = await db
      .update(schema.districts)
      .set(updateData)
      .where(eq(schema.districts.id, id))
      .returning();
    return district;
  }

  async deleteDistrict(id: number): Promise<boolean> {
    const result = await db
      .delete(schema.districts)
      .where(eq(schema.districts.id, id));
    return true;
  }

  // Dashboard methods
  async getDashboardSummary(): Promise<any> {
    const centerCount = await db.select({ count: sql`count(*)` }).from(schema.centers);
    const lecturerCount = await db.select({ count: sql`count(*)` }).from(schema.lecturers);
    const studentCount = await db.select({ count: sql`count(*)` }).from(schema.students);
    const assetCount = await db.select({ count: sql`count(*)` }).from(schema.assets);
    const districtCount = await db.select({ count: sql`count(*)` }).from(schema.districts);
    
    const mainCenters = await db
      .select({ count: sql`count(*)` })
      .from(schema.centers)
      .where(eq(schema.centers.type, 'Main'));
    
    const satelliteCenters = await db
      .select({ count: sql`count(*)` })
      .from(schema.centers)
      .where(eq(schema.centers.type, 'Satellite'));
    
    const operationalCenters = await db
      .select({ count: sql`count(*)` })
      .from(schema.centers)
      .where(eq(schema.centers.type, 'Operational Site'));

    return {
      centerCount: Number(centerCount[0]?.count || 0),
      lecturerCount: Number(lecturerCount[0]?.count || 0),
      studentCount: Number(studentCount[0]?.count || 0),
      assetCount: Number(assetCount[0]?.count || 0),
      districtCount: Number(districtCount[0]?.count || 0),
      centersByType: {
        main: Number(mainCenters[0]?.count || 0),
        satellite: Number(satelliteCenters[0]?.count || 0),
        operational: Number(operationalCenters[0]?.count || 0),
      }
    };
  }
}

// Initialize with DatabaseStorage instead of MemStorage
import { SupabaseStorage } from './supabaseStorage';

export const storage = new SupabaseStorage();
