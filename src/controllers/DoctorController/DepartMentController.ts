import { AppointmentTbl } from "../../Entities/AppointmentTbl";
import { Department } from "../../Entities/DepartmentTbl";
import { Doctor } from "../../Entities/DoctorTbl"
import { Patient } from "../../Entities/PatientTbl";
import { createResponse } from "../../Helpers/createResponse"
import { asyncHandler } from "../../middleware/errorHandler";
import logger from "../../config/logger";

export const getDoctorBydepartmentIdController = asyncHandler(async (req: any, res: any) => {
  try {
    const { departmentId } = req.query;
    
    if (!departmentId) {
      return createResponse(res, 400, "Department ID is required", [], false, true);
    }
    
    const result = await Doctor.find({ where: { departmentId: departmentId as string, isDeleted: false } })
    
    if (result?.length > 0) {
      return createResponse(res, 200, "Doctor fetched successfully !", result, true, false)
    } else {
      return createResponse(res, 404, "Doctor not found", result, false, true)
    }
  } catch (error: any) {
    logger.error('Get doctors by department error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true)
  }
});

export const GetaddapByDoctorController = asyncHandler(async (req: any, res: any) => {
  try {
    const { doctorId } = req.params;
    
    if (!doctorId) {
      return createResponse(res, 400, "Doctor ID is required", [], false, true);
    }
    
    const queryBuilder = AppointmentTbl.createQueryBuilder('apptbl')
      .select([
        "patient.name", "patient.email",
        "department.name",
        "doctor.name", "doctor.fees", "doctor.profile", "doctor.specialist",
        "apptbl.id", "apptbl.disease", "apptbl.symptoms", "apptbl.status", "apptbl.appointmentType", "apptbl.date", "apptbl.startTime", "apptbl.payment", "apptbl.createdAt"
      ])
      .leftJoin(Patient, "patient", `apptbl.patientId=patient.id::varchar AND patient.isDeleted=false`)
      .leftJoin(Department, "department", `apptbl.departmentId=department.id::varchar`)
      .leftJoin(Doctor, "doctor", `apptbl.doctorId=doctor.id::varchar AND doctor.isDeleted=false`)
      .where('apptbl.doctorId=:doctorId AND apptbl.isDeleted = false', { doctorId })
      .orderBy('apptbl.createdAt', 'DESC');
    
    const result = await queryBuilder.getRawMany()
    
    logger.info(`Appointments fetched for doctor: ${doctorId}`);
    return createResponse(res, 200, "Appointment Data Fetch successfully", result, true, false);
  } catch (error: any) {
    logger.error('Get appointments by doctor error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true)
  }
});