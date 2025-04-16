import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";
import { 
  insertUserSchema, 
  insertCenterSchema, 
  insertLecturerSchema, 
  insertStudentSchema, 
  insertAssetSchema, 
  insertCourseSchema, 
  insertEnrollmentSchema 
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session management
  const MemoryStoreSession = MemoryStore(session);
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "asset-plus-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
      },
      store: new MemoryStoreSession({
        checkPeriod: 86400000 // prune expired entries every 24h
      })
    })
  );

  // Configure authentication
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username" });
        }
        
        // In a real app, we would check the password hash
        if (user.password !== password) {
          return done(null, false, { message: "Invalid password" });
        }
        
        // Update last login time
        await storage.updateUser(user.id, { lastLogin: new Date() });
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication middleware
  function isAuthenticated(req: Request, res: Response, next: Function) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  }

  // Authentication routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message || "Authentication failed" });
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        
        // Remove password from response
        const userResponse = { ...user };
        delete userResponse.password;
        
        return res.json(userResponse);
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Remove password from response
    const userResponse = { ...req.user };
    delete (userResponse as any).password;
    
    res.json(userResponse);
  });

  // Center routes
  app.get("/api/centers", isAuthenticated, async (req, res) => {
    try {
      const centers = await storage.getCenters();
      res.json(centers);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch centers" });
    }
  });

  app.get("/api/centers/:id", isAuthenticated, async (req, res) => {
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

  app.post("/api/centers", isAuthenticated, async (req, res) => {
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

  app.put("/api/centers/:id", isAuthenticated, async (req, res) => {
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

  app.delete("/api/centers/:id", isAuthenticated, async (req, res) => {
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
  app.get("/api/lecturers", isAuthenticated, async (req, res) => {
    try {
      const lecturers = await storage.getLecturers();
      res.json(lecturers);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch lecturers" });
    }
  });

  app.get("/api/lecturers/:id", isAuthenticated, async (req, res) => {
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

  app.post("/api/lecturers", isAuthenticated, async (req, res) => {
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

  app.put("/api/lecturers/:id", isAuthenticated, async (req, res) => {
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

  app.delete("/api/lecturers/:id", isAuthenticated, async (req, res) => {
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
  app.get("/api/students", isAuthenticated, async (req, res) => {
    try {
      const students = await storage.getStudents();
      res.json(students);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  app.get("/api/students/:id", isAuthenticated, async (req, res) => {
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

  app.post("/api/students", isAuthenticated, async (req, res) => {
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

  app.put("/api/students/:id", isAuthenticated, async (req, res) => {
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

  app.delete("/api/students/:id", isAuthenticated, async (req, res) => {
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
  app.get("/api/assets", isAuthenticated, async (req, res) => {
    try {
      const assets = await storage.getAssets();
      res.json(assets);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch assets" });
    }
  });

  app.get("/api/assets/:id", isAuthenticated, async (req, res) => {
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

  app.post("/api/assets", isAuthenticated, async (req, res) => {
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

  app.put("/api/assets/:id", isAuthenticated, async (req, res) => {
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

  app.delete("/api/assets/:id", isAuthenticated, async (req, res) => {
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
  app.get("/api/courses", isAuthenticated, async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", isAuthenticated, async (req, res) => {
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

  app.post("/api/courses", isAuthenticated, async (req, res) => {
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

  app.put("/api/courses/:id", isAuthenticated, async (req, res) => {
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

  app.delete("/api/courses/:id", isAuthenticated, async (req, res) => {
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
  app.get("/api/enrollments", isAuthenticated, async (req, res) => {
    try {
      const enrollments = await storage.getEnrollments();
      res.json(enrollments);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.get("/api/enrollments/:id", isAuthenticated, async (req, res) => {
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

  app.get("/api/students/:studentId/enrollments", isAuthenticated, async (req, res) => {
    try {
      const studentId = Number(req.params.studentId);
      const enrollments = await storage.getEnrollmentsByStudent(studentId);
      res.json(enrollments);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch student enrollments" });
    }
  });

  app.get("/api/courses/:courseId/enrollments", isAuthenticated, async (req, res) => {
    try {
      const courseId = Number(req.params.courseId);
      const enrollments = await storage.getEnrollmentsByCourse(courseId);
      res.json(enrollments);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch course enrollments" });
    }
  });

  app.post("/api/enrollments", isAuthenticated, async (req, res) => {
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

  app.put("/api/enrollments/:id", isAuthenticated, async (req, res) => {
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

  app.delete("/api/enrollments/:id", isAuthenticated, async (req, res) => {
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

  // Dashboard routes
  app.get("/api/dashboard/summary", isAuthenticated, async (req, res) => {
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
