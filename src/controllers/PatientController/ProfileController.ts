import { Patient } from "../../Entities/PatientTbl";
import { createResponse } from "../../Helpers/createResponse";
import { asyncHandler } from "../../middleware/errorHandler";
import logger from "../../config/logger";

export const getPatientProfileController = asyncHandler(async (req: any, res: any) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findOne({ where: { id: patientId, isDeleted: false } });
    
    if (!patient) {
      return createResponse(res, 404, "Patient not found", [], false, true);
    }
    
    return createResponse(res, 200, "Profile fetched", patient, true, false);
  } catch (error: any) {
    logger.error('Get patient profile error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const updatePatientProfileController = asyncHandler(async (req: any, res: any) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findOne({ where: { id: patientId, isDeleted: false } });
    
    if (!patient) {
      return createResponse(res, 404, "Patient not found", [], false, true);
    }

    const { name, gender, contact, age, bloodGroup, aadhaarNo } = req.body;
    
    // Validate input
    if (name && name.trim().length < 2) {
      return createResponse(res, 400, "Name must be at least 2 characters", [], false, true);
    }
    
    if (contact && !/^[0-9]{10}$/.test(contact)) {
      return createResponse(res, 400, "Contact must be 10 digits", [], false, true);
    }
    
    if (age !== undefined && (age < 0 || age > 150)) {
      return createResponse(res, 400, "Age must be between 0 and 150", [], false, true);
    }

    // Update fields
    if (name) patient.name = name;
    if (gender) patient.gender = gender;
    if (contact) patient.contact = contact;
    if (age !== undefined) patient.age = age;
    if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (aadhaarNo) patient.aadhaarNo = aadhaarNo;
    
    await patient.save();
    
    logger.info(`Patient profile updated: ${patientId}`);
    return createResponse(res, 200, "Profile updated", patient, true, false);
  } catch (error: any) {
    logger.error('Update patient profile error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const changePatientPasswordController = asyncHandler(async (req: any, res: any) => {
  try {
    const patientId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return createResponse(res, 400, "Old password and new password are required", [], false, true);
    }
    
    if (newPassword.length < 6) {
      return createResponse(res, 400, "New password must be at least 6 characters", [], false, true);
    }
    
    const patient = await Patient.findOne({ where: { id: patientId } });
    
    if (!patient) {
      return createResponse(res, 404, "Patient not found", [], false, true);
    }
    
    // Verify old password
    const isOldPasswordValid = await require("../../utils/password.util").comparePassword(oldPassword, patient.password);
    
    if (!isOldPasswordValid) {
      return createResponse(res, 401, "Old password is incorrect", [], false, true);
    }
    
    // Hash new password
    const hashedPassword = await require("../../utils/password.util").hashPassword(newPassword);
    patient.password = hashedPassword;
    
    await patient.save();
    
    logger.info(`Password changed for patient: ${patientId}`);
    return createResponse(res, 200, "Password changed successfully", [], true, false);
  } catch (error: any) {
    logger.error('Change password error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});