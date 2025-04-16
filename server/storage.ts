import { 
  User, InsertUser,
  Center, InsertCenter,
  Lecturer, InsertLecturer,
  Student, InsertStudent,
  Asset, InsertAsset,
  Course, InsertCourse,
  Enrollment, InsertEnrollment
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
  
  private userId: number = 1;
  private centerId: number = 1;
  private lecturerId: number = 1;
  private studentId: number = 1;
  private assetId: number = 1;
  private courseId: number = 1;
  private enrollmentId: number = 1;

  constructor() {
    this.users = new Map();
    this.centers = new Map();
    this.lecturers = new Map();
    this.students = new Map();
    this.assets = new Map();
    this.courses = new Map();
    this.enrollments = new Map();
    
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

  // Dashboard methods
  async getDashboardSummary(): Promise<any> {
    return {
      centerCount: this.centers.size,
      lecturerCount: this.lecturers.size,
      studentCount: this.students.size,
      assetCount: this.assets.size,
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

export const storage = new MemStorage();
