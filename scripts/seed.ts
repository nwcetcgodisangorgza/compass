import { db, pool } from "../server/db";
import { users } from "../shared/schema";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database with initial data...");
  
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password", salt);
    
    // Add admin user
    await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
      name: "John Ndlovu",
      role: "System Administrator",
      email: "admin@nwcet.edu.za",
      isActive: true
    }).onConflictDoNothing({ target: users.username });
    
    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
  
  console.log("Database seeding completed!");
}

main()
  .catch((err) => {
    console.error("Error seeding database:", err);
    process.exit(1);
  })
  .finally(() => {
    // Exit the process
    process.exit(0);
  });