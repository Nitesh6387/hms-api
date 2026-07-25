import { AppDataSource } from "../DbConfig";
import { Admin } from "../Entities/AdminTbl";
import { hashPassword } from "../utils/password.util";
import logger from "../config/logger";

const seedAdmin = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    logger.info("Database connection established for seeding");

    const adminRepository = AppDataSource.getRepository(Admin);

    // Check if admin already exists
    const existingAdmin = await adminRepository.findOne({
      where: { email: "admin@hospital.com" }
    });

    if (existingAdmin) {
      logger.info("Admin already exists!");
      console.log("⚠️  Admin already exists with email: admin@hospital.com");
      console.log("   Email: admin@hospital.com");
      console.log("   Password: Admin@1234");
      await AppDataSource.destroy();
      return;
    }

    // Create new admin
    const admin = new Admin();
    admin.name = "System Admin";
    admin.email = "admin@hospital.com";
    admin.password = await hashPassword("Admin@1234");
    admin.contact = "9999999999";
    admin.address = "Hospital Admin Office";
    admin.isActive = true;

    await adminRepository.save(admin);

    logger.info("Admin created successfully!");
    console.log("\n✅ Admin created successfully!");
    console.log("   Email: admin@hospital.com");
    console.log("   Password: Admin@1234");
    console.log("   ⚠️  Please change the password after first login!\n");

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error: any) {
    logger.error("Error seeding admin:", error);
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();