import { Doctor } from "../../Entities/DoctorTbl";
import { Department } from "../../Entities/DepartmentTbl";
import { createResponse } from "../../Helpers/createResponse";
import { asyncHandler } from "../../middleware/errorHandler";
import logger from "../../config/logger";

export const getDoctorProfileController = asyncHandler(async (req: any, res: any) => {
  try {
    const doctorId = req.user.id;
    const doctor = await Doctor.createQueryBuilder("doctor")
      .leftJoin(Department, "department", "doctor.departmentId = department.id::varchar")
      .where("doctor.id = :id AND doctor.isDeleted = false", { id: doctorId })
      .select(["doctor", "department.name as departmentName"])
      .getRawOne();
    
    if (!doctor) {
      return createResponse(res, 404, "Doctor not found", [], false, true);
    }
    
    return createResponse(res, 200, "Profile fetched", doctor, true, false);
  } catch (error: any) {
    logger.error('Get doctor profile error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const updateDoctorProfileController = asyncHandler(async (req: any, res: any) => {
  try {
    const doctorId = req.user.id;
    const doctor = await Doctor.findOne({ where: { id: doctorId, isDeleted: false } });
    
    if (!doctor) {
      return createResponse(res, 404, "Doctor not found", [], false, true);
    }

    const { name, contact, address, fees, availableDays } = req.body;
    
    // Validate input
    if (name && name.trim().length < 2) {
      return createResponse(res, 400, "Name must be at least 2 characters", [], false, true);
    }
    
    if (contact && !/^[0-9]{10}$/.test(contact)) {
      return createResponse(res, 400, "Contact must be 10 digits", [], false, true);
    }

    // Update fields
    if (name) doctor.name = name;
    if (contact) doctor.contact = contact;
    if (address) doctor.address = address;
    if (fees) doctor.fees = fees;
    if (availableDays) doctor.availableDays = availableDays;
    
    await doctor.save();
    
    // Remove password from response
    const { password, ...doctorWithoutPassword } = doctor;
    
    logger.info(`Doctor profile updated: ${doctorId}`);
    return createResponse(res, 200, "Profile updated", doctorWithoutPassword, true, false);
  } catch (error: any) {
    logger.error('Update doctor profile error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const updateAvailabilityController = asyncHandler(async (req: any, res: any) => {
  try {
    const doctorId = req.user.id;
    const { availableDays } = req.body;
    
    if (!availableDays || !Array.isArray(availableDays)) {
      return createResponse(res, 400, "availableDays must be an array", [], false, true);
    }
    
    // Validate available days
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const invalidDays = availableDays.filter((day: string) => !validDays.includes(day));
    
    if (invalidDays.length > 0) {
      return createResponse(res, 400, `Invalid days: ${invalidDays.join(', ')}`, [], false, true);
    }
    
    await Doctor.update({ id: doctorId }, { availableDays });
    
    logger.info(`Availability updated for doctor: ${doctorId}`);
    return createResponse(res, 200, "Availability updated", { availableDays }, true, false);
  } catch (error: any) {
    logger.error('Update availability error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});