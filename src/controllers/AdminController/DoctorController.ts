import { Doctor } from "../../Entities/DoctorTbl";
import { Department } from "../../Entities/DepartmentTbl";
import { createResponse } from "../../Helpers/createResponse";
import { hashPassword } from "../../utils/password.util";
import { createDoctorSchema, updateDoctorSchema } from "../../validators/doctor.validator";
import { asyncHandler } from "../../middleware/errorHandler";
import logger from "../../config/logger";

export const addDoctorController = asyncHandler(async (req: any, res: any) => {
  try {
    // Validate input
    const validatedData = createDoctorSchema.parse(req.body);
    const { name, departmentId, specialist, qualifications, experience, fees, address, gender, email, contact, password, availableDays } = validatedData;
    
    // Check if doctor exists
    const existing = await Doctor.findOne({ where: { email } });
    if (existing) {
      return createResponse(res, 409, "Doctor with this email already exists", [], false, true);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const newDoctor = new Doctor();
    newDoctor.name = name;
    newDoctor.departmentId = departmentId;
    newDoctor.specialist = specialist;
    newDoctor.qualifications = qualifications;
    newDoctor.experience = experience;
    newDoctor.fees = fees;
    newDoctor.address = address;
    newDoctor.gender = gender;
    newDoctor.email = email;
    newDoctor.contact = contact;
    newDoctor.password = hashedPassword;
    newDoctor.availableDays = availableDays || [];
    newDoctor.isActive = true;
    newDoctor.isDeleted = false;
    
    await newDoctor.save();
    
    // Remove password from response
    const { password: _, ...doctorWithoutPassword } = newDoctor;
    
    logger.info(`Doctor added successfully: ${email}`);
    return createResponse(res, 201, "Doctor added successfully", doctorWithoutPassword, true, false);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return createResponse(res, 400, "Validation error", error.errors, false, true);
    }
    logger.error('Add doctor error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const updateDoctorController = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Validate input
    const validatedData = updateDoctorSchema.parse(req.body);
    const { name, departmentId, specialist, qualifications, experience, fees, address, gender, contact, availableDays, isActive } = validatedData;
    
    const doctor = await Doctor.findOne({ where: { id, isDeleted: false } });
    if (!doctor) {
      return createResponse(res, 404, "Doctor not found", [], false, true);
    }

    // Update fields
    if (name) doctor.name = name;
    if (departmentId) doctor.departmentId = departmentId;
    if (specialist) doctor.specialist = specialist;
    if (qualifications) doctor.qualifications = qualifications;
    if (experience) doctor.experience = experience;
    if (fees) doctor.fees = fees;
    if (address) doctor.address = address;
    if (gender) doctor.gender = gender;
    if (contact) doctor.contact = contact;
    if (availableDays) doctor.availableDays = availableDays;
    if (isActive !== undefined) doctor.isActive = isActive;
    
    await doctor.save();
    
    // Remove password from response
    const { password: _, ...doctorWithoutPassword } = doctor;
    
    logger.info(`Doctor updated: ${id}`);
    return createResponse(res, 200, "Doctor updated", doctorWithoutPassword, true, false);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return createResponse(res, 400, "Validation error", error.errors, false, true);
    }
    logger.error('Update doctor error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const deleteDoctorController = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findOne({ where: { id, isDeleted: false } });
    if (!doctor) {
      return createResponse(res, 404, "Doctor not found", [], false, true);
    }
    
    doctor.isDeleted = true;
    await doctor.save();
    
    logger.info(`Doctor deleted (soft): ${id}`);
    return createResponse(res, 200, "Doctor deleted (soft)", doctor, true, false);
  } catch (error: any) {
    logger.error('Delete doctor error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const getSingleDoctorController = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.createQueryBuilder("doctor")
      .leftJoinAndSelect(Department, "department", "doctor.departmentId = department.id::varchar")
      .where("doctor.id = :id AND doctor.isDeleted = false", { id })
      .select(["doctor", "department.name as departmentName"])
      .getRawOne();
    
    if (!doctor) {
      return createResponse(res, 404, "Doctor not found", [], false, true);
    }
    
    return createResponse(res, 200, "Doctor fetched", doctor, true, false);
  } catch (error: any) {
    logger.error('Get doctor error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});