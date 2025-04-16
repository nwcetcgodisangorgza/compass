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
import { supabase } from "./supabase";
import { IStorage } from "./storage";

export class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching user:', error);
        return undefined;
      }
      
      return data as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        console.error('Error fetching user by username:', error);
        return undefined;
      }
      
      return data as User;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }
    
    return data as User;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating user with id ${id}:`, error);
      return undefined;
    }
    
    return data as User;
  }
  
  // Center methods
  async getCenter(id: number): Promise<Center | undefined> {
    try {
      const { data, error } = await supabase
        .from('centers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching center:', error);
        return undefined;
      }
      
      return data as Center;
    } catch (error) {
      console.error('Error fetching center:', error);
      return undefined;
    }
  }

  async getCenters(): Promise<Center[]> {
    const { data, error } = await supabase
      .from('centers')
      .select('*');
    
    if (error) {
      console.error('Error fetching centers:', error);
      return [];
    }
    
    return data as Center[];
  }

  async createCenter(center: InsertCenter): Promise<Center> {
    const { data, error } = await supabase
      .from('centers')
      .insert(center)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating center:', error);
      throw error;
    }
    
    return data as Center;
  }

  async updateCenter(id: number, center: Partial<Center>): Promise<Center | undefined> {
    const { data, error } = await supabase
      .from('centers')
      .update(center)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating center with id ${id}:`, error);
      return undefined;
    }
    
    return data as Center;
  }

  async deleteCenter(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('centers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting center with id ${id}:`, error);
      return false;
    }
    
    return true;
  }
  
  // District methods
  async getDistrict(id: number): Promise<District | undefined> {
    try {
      const { data, error } = await supabase
        .from('districts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching district:', error);
        return undefined;
      }
      
      return data as District;
    } catch (error) {
      console.error('Error fetching district:', error);
      return undefined;
    }
  }

  async getDistricts(): Promise<District[]> {
    const { data, error } = await supabase
      .from('districts')
      .select('*');
    
    if (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
    
    return data as District[];
  }

  async createDistrict(district: InsertDistrict): Promise<District> {
    const { data, error } = await supabase
      .from('districts')
      .insert(district)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating district:', error);
      throw error;
    }
    
    return data as District;
  }

  async updateDistrict(id: number, district: Partial<District>): Promise<District | undefined> {
    const { data, error } = await supabase
      .from('districts')
      .update(district)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating district with id ${id}:`, error);
      return undefined;
    }
    
    return data as District;
  }

  async deleteDistrict(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('districts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting district with id ${id}:`, error);
      return false;
    }
    
    return true;
  }
  
  // Lecturer methods
  async getLecturer(id: number): Promise<Lecturer | undefined> {
    try {
      const { data, error } = await supabase
        .from('lecturers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching lecturer:', error);
        return undefined;
      }
      
      return data as Lecturer;
    } catch (error) {
      console.error('Error fetching lecturer:', error);
      return undefined;
    }
  }

  async getLecturers(): Promise<Lecturer[]> {
    const { data, error } = await supabase
      .from('lecturers')
      .select('*');
    
    if (error) {
      console.error('Error fetching lecturers:', error);
      return [];
    }
    
    return data as Lecturer[];
  }

  async createLecturer(lecturer: InsertLecturer): Promise<Lecturer> {
    const { data, error } = await supabase
      .from('lecturers')
      .insert(lecturer)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating lecturer:', error);
      throw error;
    }
    
    return data as Lecturer;
  }

  async updateLecturer(id: number, lecturer: Partial<Lecturer>): Promise<Lecturer | undefined> {
    const { data, error } = await supabase
      .from('lecturers')
      .update(lecturer)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating lecturer with id ${id}:`, error);
      return undefined;
    }
    
    return data as Lecturer;
  }

  async deleteLecturer(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('lecturers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting lecturer with id ${id}:`, error);
      return false;
    }
    
    return true;
  }
  
  // Student methods
  async getStudent(id: number): Promise<Student | undefined> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching student:', error);
        return undefined;
      }
      
      return data as Student;
    } catch (error) {
      console.error('Error fetching student:', error);
      return undefined;
    }
  }

  async getStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from('students')
      .select('*');
    
    if (error) {
      console.error('Error fetching students:', error);
      return [];
    }
    
    return data as Student[];
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const { data, error } = await supabase
      .from('students')
      .insert(student)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating student:', error);
      throw error;
    }
    
    return data as Student;
  }

  async updateStudent(id: number, student: Partial<Student>): Promise<Student | undefined> {
    const { data, error } = await supabase
      .from('students')
      .update(student)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating student with id ${id}:`, error);
      return undefined;
    }
    
    return data as Student;
  }

  async deleteStudent(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting student with id ${id}:`, error);
      return false;
    }
    
    return true;
  }
  
  // Asset methods
  async getAsset(id: number): Promise<Asset | undefined> {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching asset:', error);
        return undefined;
      }
      
      return data as Asset;
    } catch (error) {
      console.error('Error fetching asset:', error);
      return undefined;
    }
  }

  async getAssets(): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('assets')
      .select('*');
    
    if (error) {
      console.error('Error fetching assets:', error);
      return [];
    }
    
    return data as Asset[];
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const { data, error } = await supabase
      .from('assets')
      .insert(asset)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
    
    return data as Asset;
  }

  async updateAsset(id: number, asset: Partial<Asset>): Promise<Asset | undefined> {
    const { data, error } = await supabase
      .from('assets')
      .update(asset)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating asset with id ${id}:`, error);
      return undefined;
    }
    
    return data as Asset;
  }

  async deleteAsset(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting asset with id ${id}:`, error);
      return false;
    }
    
    return true;
  }
  
  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching course:', error);
        return undefined;
      }
      
      return data as Course;
    } catch (error) {
      console.error('Error fetching course:', error);
      return undefined;
    }
  }

  async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*');
    
    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
    
    return data as Course[];
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating course:', error);
      throw error;
    }
    
    return data as Course;
  }

  async updateCourse(id: number, course: Partial<Course>): Promise<Course | undefined> {
    const { data, error } = await supabase
      .from('courses')
      .update(course)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating course with id ${id}:`, error);
      return undefined;
    }
    
    return data as Course;
  }

  async deleteCourse(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting course with id ${id}:`, error);
      return false;
    }
    
    return true;
  }
  
  // Enrollment methods
  async getEnrollment(id: number): Promise<Enrollment | undefined> {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching enrollment:', error);
        return undefined;
      }
      
      return data as Enrollment;
    } catch (error) {
      console.error('Error fetching enrollment:', error);
      return undefined;
    }
  }

  async getEnrollments(): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*');
    
    if (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }
    
    return data as Enrollment[];
  }
  
  async getEnrollmentsByStudent(studentId: number): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('studentId', studentId);
    
    if (error) {
      console.error('Error fetching enrollments by student:', error);
      return [];
    }
    
    return data as Enrollment[];
  }

  async getEnrollmentsByCourse(courseId: number): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('courseId', courseId);
    
    if (error) {
      console.error('Error fetching enrollments by course:', error);
      return [];
    }
    
    return data as Enrollment[];
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const { data, error } = await supabase
      .from('enrollments')
      .insert(enrollment)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
    
    return data as Enrollment;
  }

  async updateEnrollment(id: number, enrollment: Partial<Enrollment>): Promise<Enrollment | undefined> {
    const { data, error } = await supabase
      .from('enrollments')
      .update(enrollment)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating enrollment with id ${id}:`, error);
      return undefined;
    }
    
    return data as Enrollment;
  }

  async deleteEnrollment(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting enrollment with id ${id}:`, error);
      return false;
    }
    
    return true;
  }
  
  // Dashboard methods
  async getDashboardSummary(): Promise<any> {
    try {
      // Get counts from each table
      const [centersResult, lecturersResult, studentsResult, assetsResult, 
             districtsResult, coursesResult, enrollmentsResult] = await Promise.all([
        supabase.from('centers').select('id, type').then(r => r.data || []),
        supabase.from('lecturers').select('id').then(r => r.data || []),
        supabase.from('students').select('id, academicStatus').then(r => r.data || []),
        supabase.from('assets').select('id, category').then(r => r.data || []),
        supabase.from('districts').select('id').then(r => r.data || []),
        supabase.from('courses').select('id').then(r => r.data || []),
        supabase.from('enrollments').select('id').then(r => r.data || [])
      ]);
      
      // Count center types
      const centersByType = {
        main: centersResult.filter(c => c.type === 'Main').length,
        satellite: centersResult.filter(c => c.type === 'Satellite').length,
        operational: centersResult.filter(c => c.type === 'Operational Site').length,
      };
      
      // Count student statuses
      const studentsByStatus = {
        active: studentsResult.filter(s => s.academicStatus === 'Active').length,
        graduated: studentsResult.filter(s => s.academicStatus === 'Graduated').length,
        withdrawn: studentsResult.filter(s => s.academicStatus === 'Withdrawn').length,
        onLeave: studentsResult.filter(s => s.academicStatus === 'On Leave').length,
      };
      
      // Count asset categories
      const assetsByCategory = {
        itEquipment: assetsResult.filter(a => a.category === 'IT Equipment').length,
        furniture: assetsResult.filter(a => a.category === 'Furniture').length,
        vehicle: assetsResult.filter(a => a.category === 'Vehicle').length,
        teachingAid: assetsResult.filter(a => a.category === 'Teaching Aid').length,
        officeEquipment: assetsResult.filter(a => a.category === 'Office Equipment').length,
      };
      
      return {
        centerCount: centersResult.length,
        lecturerCount: lecturersResult.length,
        studentCount: studentsResult.length,
        assetCount: assetsResult.length,
        districtCount: districtsResult.length,
        courseCount: coursesResult.length,
        enrollmentCount: enrollmentsResult.length,
        centersByType,
        studentsByStatus,
        assetsByCategory
      };
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      return {
        centerCount: 0,
        lecturerCount: 0,
        studentCount: 0,
        assetCount: 0,
        districtCount: 0,
        courseCount: 0,
        enrollmentCount: 0,
        centersByType: { main: 0, satellite: 0, operational: 0 },
        studentsByStatus: { active: 0, graduated: 0, withdrawn: 0, onLeave: 0 },
        assetsByCategory: { 
          itEquipment: 0, furniture: 0, vehicle: 0, 
          teachingAid: 0, officeEquipment: 0 
        }
      };
    }
  }
}