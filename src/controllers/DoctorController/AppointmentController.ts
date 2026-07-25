import { AppointmentTbl } from "../../Entities/AppointmentTbl";
import { Patient } from "../../Entities/PatientTbl";
import { Department } from "../../Entities/DepartmentTbl";
import { Doctor } from "../../Entities/DoctorTbl";
import { createResponse } from "../../Helpers/createResponse";
import { asyncHandler } from "../../middleware/errorHandler";
import logger from "../../config/logger";

export const getDoctorAppointmentsController = asyncHandler(async (req: any, res: any) => {
  try {
    const doctorId = req.user.id;
    const { status, date, patientName } = req.query;
    
    const queryBuilder = AppointmentTbl.createQueryBuilder('apptbl')
      .select([
        "patient.name", "patient.email", "patient.contact",
        "department.name",
        "apptbl.id", "apptbl.disease", "apptbl.symptoms", "apptbl.status", "apptbl.appointmentType", "apptbl.date", "apptbl.startTime", "apptbl.payment", "apptbl.createdAt"
      ])
      .leftJoin(Patient, "patient", `apptbl.patientId=patient.id::varchar AND patient.isDeleted=false`)
      .leftJoin(Department, "department", `apptbl.departmentId=department.id::varchar`)
      .where('apptbl.doctorId = :doctorId AND apptbl.isDeleted = false', { doctorId });

    if (status) queryBuilder.andWhere('apptbl.status = :status', { status });
    if (date) queryBuilder.andWhere('apptbl.date = :date', { date });
    if (patientName) {
      queryBuilder.andWhere('patient.name ILIKE :name', { name: `%${patientName}%` });
    }

    const result = await queryBuilder.getRawMany();
    
    logger.info(`Doctor appointments fetched for doctor: ${doctorId}`);
    return createResponse(res, 200, "Appointments fetched", result, true, false);
  } catch (error: any) {
    logger.error('Get doctor appointments error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const getDoctorAppointmentByIdController = asyncHandler(async (req: any, res: any) => {
  try {
    const doctorId = req.user.id;
    const { id } = req.params;
    
    const result = await AppointmentTbl.createQueryBuilder('apptbl')
      .select([
        "patient.name", "patient.email", "patient.contact", "patient.age",
        "department.name",
        "apptbl.id", "apptbl.disease", "apptbl.symptoms", "apptbl.status", "apptbl.appointmentType", "apptbl.date", "apptbl.startTime", "apptbl.payment", "apptbl.createdAt"
      ])
      .leftJoin(Patient, "patient", `apptbl.patientId=patient.id::varchar AND patient.isDeleted=false`)
      .leftJoin(Department, "department", `apptbl.departmentId=department.id::varchar`)
      .where('apptbl.id = :id AND apptbl.doctorId = :doctorId AND apptbl.isDeleted = false', { id, doctorId })
      .getRawOne();
    
    if (!result) {
      return createResponse(res, 404, "Appointment not found", [], false, true);
    }
    
    return createResponse(res, 200, "Appointment fetched", result, true, false);
  } catch (error: any) {
    logger.error('Get doctor appointment by id error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const updateAppointmentStatusByDoctorController = asyncHandler(async (req: any, res: any) => {
  try {
    const doctorId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return createResponse(res, 400, "Status is required", [], false, true);
    }
    
    const appointment = await AppointmentTbl.findOne({
      where: { id, doctorId, isDeleted: false }
    });
    
    if (!appointment) {
      return createResponse(res, 404, "Appointment not found", [], false, true);
    }
    
    appointment.status = status;
    await appointment.save();
    
    logger.info(`Appointment status updated by doctor: ${id} to ${status}`);
    return createResponse(res, 200, "Status updated", appointment, true, false);
  } catch (error: any) {
    logger.error('Update appointment status by doctor error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});