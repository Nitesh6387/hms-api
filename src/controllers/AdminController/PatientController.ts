import { Patient } from "../../Entities/PatientTbl";
import { createResponse } from "../../Helpers/createResponse";
import { updatePatientSchema } from "../../validators/patient.validator";
import { asyncHandler } from "../../middleware/errorHandler";
import logger from "../../config/logger";

export const removePatientById = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (!id) {
      return createResponse(res, 400, "Patient ID is required", [], false, true);
    }

    const patient = await Patient.findOne({ where: { id } });

    if (!patient) {
      return createResponse(res, 404, "Patient not found", [], false, true);
    }

    await Patient.remove(patient);

    return createResponse(res, 200, "Patient removed successfully", patient, true, false);
  } catch (error: any) {
    logger.error('Remove patient error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const InActivePatient = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (!id) {
      return createResponse(res, 400, "Patient ID is required", [], false, true);
    }

    const patient = await Patient.findOne({ where: { id } });

    if (!patient) {
      return createResponse(res, 404, "Patient not found", [], false, true);
    }

    patient.isActive = false;
    patient.updatedAt = new Date();

    await patient.save();

    return createResponse(res, 200, "Patient deactivated (soft deleted) successfully", patient, true, false);
  } catch (error: any) {
    logger.error('Deactivate patient error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const updatePatientByAdminController = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Validate input
    const validatedData = updatePatientSchema.parse(req.body);
    const { name, gender, contact, age, bloodGroup, aadhaarNo, isActive } = validatedData;
    
    const patient = await Patient.findOne({ where: { id, isDeleted: false } });
    if (!patient) {
      return createResponse(res, 404, "Patient not found", [], false, true);
    }

    // Update fields
    if (name) patient.name = name;
    if (gender) patient.gender = gender;
    if (contact) patient.contact = contact;
    if (age !== undefined) patient.age = age;
    if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (aadhaarNo) patient.aadhaarNo = aadhaarNo;
    if (isActive !== undefined) patient.isActive = isActive;
    
    await patient.save();
    
    logger.info(`Patient updated by admin: ${id}`);
    return createResponse(res, 200, "Patient updated", patient, true, false);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return createResponse(res, 400, "Validation error", error.errors, false, true);
    }
    logger.error('Update patient error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const activatePatientController = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({ where: { id } });
    
    if (!patient) {
      return createResponse(res, 404, "Patient not found", [], false, true);
    }
    
    patient.isActive = true;
    patient.isDeleted = false;
    await patient.save();
    
    logger.info(`Patient activated: ${id}`);
    return createResponse(res, 200, "Patient activated", patient, true, false);
  } catch (error: any) {
    logger.error('Activate patient error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});