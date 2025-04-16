import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authService, authenticate, authorize } from "./auth";
import { 
  insertUserSchema, 
  insertCenterSchema, 
  insertLecturerSchema, 
  insertStudentSchema, 
  insertAssetSchema, 
  insertCourseSchema, 
  insertEnrollmentSchema,
  insertDistrictSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes with JWT
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const result = await authService.login(username, password);
      
      if (!result) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Remove sensitive data
      const userResponse = { ...result.user };
      delete userResponse.password;
      
      // Return user data and token
      res.json({
        user: userResponse,
        token: result.token
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: "An error occurred during login" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }
      
      const authResult = await authService.register(result.data);
      
      if (!authResult) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Remove sensitive data
      const userResponse = { ...authResult.user };
      delete userResponse.password;
      
      // Return user data and token
      res.status(201).json({
        user: userResponse,
        token: authResult.token
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ message: "An error occurred during registration" });
    }
  });

  app.get("/api/auth/me", authenticate, (req: any, res) => {
    // User data is already in req.user from the authenticate middleware
    const userResponse = { ...req.user };
    // No need to delete password as it's not included in the JWT payload
    
    res.json(userResponse);
  });

  // Center routes
  app.get("/api/centers", authenticate, async (req, res) => {
    try {
      const centers = await storage.getCenters();
      res.json(centers);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch centers" });
    }
  });

  app.get("/api/centers/:id", authenticate, async (req, res) => {
    try {
      const center = await storage.getCenter(Number(req.params.id));
      if (!center) {
        return res.status(404).json({ message: "Center not found" });
      }
      res.json(center);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch center" });
    }
  });

  app.post("/api/centers", authenticate, async (req, res) => {
    try {
      const result = insertCenterSchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }
      
      const center = await storage.createCenter(result.data);
      res.status(201).json(center);
    } catch (err) {
      res.status(500).json({ message: "Failed to create center" });
    }
  });

  app.put("/api/centers/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const existingCenter = await storage.getCenter(id);
      if (!existingCenter) {
        return res.status(404).json({ message: "Center not found" });
      }
      
      // Validate only the fields that are being updated
      const validFields = Object.keys(insertCenterSchema.shape).filter(key => 
        key in req.body && key !== 'id' && key !== 'dateAdded' && key !== 'lastUpdated'
      );
      
      const updateData = validFields.reduce((acc, key) => {
        (acc as any)[key] = req.body[key];
        return acc;
      }, {});
      
      const updatedCenter = await storage.updateCenter(id, updateData);
      res.json(updatedCenter);
    } catch (err) {
      res.status(500).json({ message: "Failed to update center" });
    }
  });

  app.delete("/api/centers/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteCenter(id);
      if (!success) {
        return res.status(404).json({ message: "Center not found" });
      }
      res.json({ message: "Center deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete center" });
    }
  });

  // Lecturer routes
  app.get("/api/lecturers", authenticate, async (req, res) => {
    try {
      const lecturers = await storage.getLecturers();
      res.json(lecturers);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch lecturers" });
    }
  });

  app.get("/api/lecturers/:id", authenticate, async (req, res) => {
    try {
      const lecturer = await storage.getLecturer(Number(req.params.id));
      if (!lecturer) {
        return res.status(404).json({ message: "Lecturer not found" });
      }
      res.json(lecturer);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch lecturer" });
    }
  });

  app.post("/api/lecturers", authenticate, async (req, res) => {
    try {
      const result = insertLecturerSchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }
      
      const lecturer = await storage.createLecturer(result.data);
      res.status(201).json(lecturer);
    } catch (err) {
      res.status(500).json({ message: "Failed to create lecturer" });
    }
  });

  app.put("/api/lecturers/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const existingLecturer = await storage.getLecturer(id);
      if (!existingLecturer) {
        return res.status(404).json({ message: "Lecturer not found" });
      }
      
      // Validate only the fields that are being updated
      const validFields = Object.keys(insertLecturerSchema.shape).filter(key => 
        key in req.body && key !== 'id' && key !== 'dateAdded' && key !== 'lastUpdated'
      );
      
      const updateData = validFields.reduce((acc, key) => {
        (acc as any)[key] = req.body[key];
        return acc;
      }, {});
      
      const updatedLecturer = await storage.updateLecturer(id, updateData);
      res.json(updatedLecturer);
    } catch (err) {
      res.status(500).json({ message: "Failed to update lecturer" });
    }
  });

  app.delete("/api/lecturers/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteLecturer(id);
      if (!success) {
        return res.status(404).json({ message: "Lecturer not found" });
      }
      res.json({ message: "Lecturer deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete lecturer" });
    }
  });

  // Student routes
  app.get("/api/students", authenticate, async (req, res) => {
    try {
      const students = await storage.getStudents();
      res.json(students);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.get("/api/students/:id", authenticate, async (req, res) => {
    try {
      const student = await storage.getStudent(Number(req.params.id));
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch student" });
    }
  });

  app.post("/api/students", authenticate, async (req, res) => {
    try {
      const result = insertStudentSchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }
      
      const student = await storage.createStudent(result.data);
      res.status(201).json(student);
    } catch (err) {
      res.status(500).json({ message: "Failed to create student" });
    }
  });

  app.put("/api/students/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const existingStudent = await storage.getStudent(id);
      if (!existingStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      // Validate only the fields that are being updated
      const validFields = Object.keys(insertStudentSchema.shape).filter(key => 
        key in req.body && key !== 'id' && key !== 'dateAdded' && key !== 'lastUpdated'
      );
      
      const updateData = validFields.reduce((acc, key) => {
        (acc as any)[key] = req.body[key];
        return acc;
      }, {});
      
      const updatedStudent = await storage.updateStudent(id, updateData);
      res.json(updatedStudent);
    } catch (err) {
      res.status(500).json({ message: "Failed to update student" });
    }
  });

  app.delete("/api/students/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteStudent(id);
      if (!success) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json({ message: "Student deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete student" });
    }
  });

  // Asset routes
  app.get("/api/assets", authenticate, async (req, res) => {
    try {
      const assets = await storage.getAssets();
      res.json(assets);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch assets" });
    }
  });

  app.get("/api/assets/:id", authenticate, async (req, res) => {
    try {
      const asset = await storage.getAsset(Number(req.params.id));
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.json(asset);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch asset" });
    }
  });

  app.post("/api/assets", authenticate, async (req, res) => {
    try {
      const result = insertAssetSchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }
      
      const asset = await storage.createAsset(result.data);
      res.status(201).json(asset);
    } catch (err) {
      res.status(500).json({ message: "Failed to create asset" });
    }
  });

  app.put("/api/assets/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const existingAsset = await storage.getAsset(id);
      if (!existingAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      // Validate only the fields that are being updated
      const validFields = Object.keys(insertAssetSchema.shape).filter(key => 
        key in req.body && key !== 'id' && key !== 'dateAdded' && key !== 'lastUpdated'
      );
      
      const updateData = validFields.reduce((acc, key) => {
        (acc as any)[key] = req.body[key];
        return acc;
      }, {});
      
      const updatedAsset = await storage.updateAsset(id, updateData);
      res.json(updatedAsset);
    } catch (err) {
      res.status(500).json({ message: "Failed to update asset" });
    }
  });

  app.delete("/api/assets/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteAsset(id);
      if (!success) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.json({ message: "Asset deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete asset" });
    }
  });

  // Course routes
  app.get("/api/courses", authenticate, async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", authenticate, async (req, res) => {
    try {
      const course = await storage.getCourse(Number(req.params.id));
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post("/api/courses", authenticate, async (req, res) => {
    try {
      const result = insertCourseSchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }
      
      const course = await storage.createCourse(result.data);
      res.status(201).json(course);
    } catch (err) {
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  app.put("/api/courses/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const existingCourse = await storage.getCourse(id);
      if (!existingCourse) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Validate only the fields that are being updated
      const validFields = Object.keys(insertCourseSchema.shape).filter(key => 
        key in req.body && key !== 'id' && key !== 'dateAdded' && key !== 'lastUpdated'
      );
      
      const updateData = validFields.reduce((acc, key) => {
        (acc as any)[key] = req.body[key];
        return acc;
      }, {});
      
      const updatedCourse = await storage.updateCourse(id, updateData);
      res.json(updatedCourse);
    } catch (err) {
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  app.delete("/api/courses/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteCourse(id);
      if (!success) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json({ message: "Course deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  // Enrollment routes
  app.get("/api/enrollments", authenticate, async (req, res) => {
    try {
      const enrollments = await storage.getEnrollments();
      res.json(enrollments);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.get("/api/enrollments/:id", authenticate, async (req, res) => {
    try {
      const enrollment = await storage.getEnrollment(Number(req.params.id));
      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }
      res.json(enrollment);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch enrollment" });
    }
  });

  app.get("/api/students/:studentId/enrollments", authenticate, async (req, res) => {
    try {
      const studentId = Number(req.params.studentId);
      const enrollments = await storage.getEnrollmentsByStudent(studentId);
      res.json(enrollments);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch student enrollments" });
    }
  });

  app.get("/api/courses/:courseId/enrollments", authenticate, async (req, res) => {
    try {
      const courseId = Number(req.params.courseId);
      const enrollments = await storage.getEnrollmentsByCourse(courseId);
      res.json(enrollments);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch course enrollments" });
    }
  });

  app.post("/api/enrollments", authenticate, async (req, res) => {
    try {
      const result = insertEnrollmentSchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }
      
      const enrollment = await storage.createEnrollment(result.data);
      res.status(201).json(enrollment);
    } catch (err) {
      res.status(500).json({ message: "Failed to create enrollment" });
    }
  });

  app.put("/api/enrollments/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const existingEnrollment = await storage.getEnrollment(id);
      if (!existingEnrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }
      
      // Validate only the fields that are being updated
      const validFields = Object.keys(insertEnrollmentSchema.shape).filter(key => 
        key in req.body && key !== 'id' && key !== 'dateAdded' && key !== 'lastUpdated'
      );
      
      const updateData = validFields.reduce((acc, key) => {
        (acc as any)[key] = req.body[key];
        return acc;
      }, {});
      
      const updatedEnrollment = await storage.updateEnrollment(id, updateData);
      res.json(updatedEnrollment);
    } catch (err) {
      res.status(500).json({ message: "Failed to update enrollment" });
    }
  });

  app.delete("/api/enrollments/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteEnrollment(id);
      if (!success) {
        return res.status(404).json({ message: "Enrollment not found" });
      }
      res.json({ message: "Enrollment deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete enrollment" });
    }
  });

  // District routes
  app.get("/api/districts", authenticate, async (req, res) => {
    try {
      const districts = await storage.getDistricts();
      res.json(districts);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch districts" });
    }
  });

  app.get("/api/districts/:id", authenticate, async (req, res) => {
    try {
      const district = await storage.getDistrict(Number(req.params.id));
      if (!district) {
        return res.status(404).json({ message: "District not found" });
      }
      res.json(district);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch district" });
    }
  });

  app.post("/api/districts", authenticate, async (req, res) => {
    try {
      const result = insertDistrictSchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ message: error.message });
      }
      
      const district = await storage.createDistrict(result.data);
      res.status(201).json(district);
    } catch (err) {
      res.status(500).json({ message: "Failed to create district" });
    }
  });

  app.put("/api/districts/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const existingDistrict = await storage.getDistrict(id);
      if (!existingDistrict) {
        return res.status(404).json({ message: "District not found" });
      }
      
      // Validate only the fields that are being updated
      const validFields = Object.keys(insertDistrictSchema.shape).filter(key => 
        key in req.body && key !== 'id' && key !== 'dateAdded' && key !== 'lastUpdated'
      );
      
      const updateData = validFields.reduce((acc, key) => {
        (acc as any)[key] = req.body[key];
        return acc;
      }, {});
      
      const updatedDistrict = await storage.updateDistrict(id, updateData);
      res.json(updatedDistrict);
    } catch (err) {
      res.status(500).json({ message: "Failed to update district" });
    }
  });

  app.delete("/api/districts/:id", authenticate, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteDistrict(id);
      if (!success) {
        return res.status(404).json({ message: "District not found" });
      }
      res.json({ message: "District deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete district" });
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/summary", authenticate, async (req, res) => {
    try {
      const summary = await storage.getDashboardSummary();
      res.json(summary);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
  });

  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
