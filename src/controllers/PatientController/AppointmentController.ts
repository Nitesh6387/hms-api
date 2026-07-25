import moment from "moment";
import { AppointmentTbl } from "../../Entities/AppointmentTbl";
import { Patient } from "../../Entities/PatientTbl";
import { Department } from "../../Entities/DepartmentTbl";
import { Doctor } from "../../Entities/DoctorTbl";
import { createResponse } from "../../Helpers/createResponse";
import { asyncHandler } from "../../middleware/errorHandler";
import logger from "../../config/logger";

export const getPatientAppointmentByIdController = asyncHandler(async (req: any, res: any) => {
  try {
    const patientId = req.user.id;
    const { id } = req.params;
    
    const result = await AppointmentTbl.createQueryBuilder('apptbl')
      .select([
        "patient.name", "patient.email",
        "department.name",
        "doctor.name", "doctor.fees", "doctor.specialist",
        "apptbl.id", "apptbl.disease", "apptbl.symptoms", "apptbl.status", "apptbl.appointmentType", "apptbl.date", "apptbl.startTime", "apptbl.payment", "apptbl.createdAt"
      ])
      .leftJoin(Patient, "patient", `apptbl.patientId=patient.id::varchar AND patient.isDeleted=false`)
      .leftJoin(Department, "department", `apptbl.departmentId=department.id::varchar`)
      .leftJoin(Doctor, "doctor", `apptbl.doctorId=doctor.id::varchar AND doctor.isDeleted=false`)
      .where('apptbl.id = :id AND apptbl.patientId = :patientId AND apptbl.isDeleted = false', { id, patientId })
      .getRawOne();
    
    if (!result) {
      return createResponse(res, 404, "Appointment not found", [], false, true);
    }
    
    return createResponse(res, 200, "Appointment fetched", result, true, false);
  } catch (error: any) {
    logger.error('Get patient appointment by id error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const cancelAppointmentController = asyncHandler(async (req: any, res: any) => {
  try {
    const patientId = req.user.id;
    const { id } = req.params;
    
    const appointment = await AppointmentTbl.findOne({
      where: { id, patientId, isDeleted: false }
    });
    
    if (!appointment) {
      return createResponse(res, 404, "Appointment not found", [], false, true);
    }
    
    // Allow cancellation only if status is not 'Completed' or 'Cancelled'
    if (appointment.status === "Completed") {
      return createResponse(res, 400, "Cannot cancel a completed appointment", [], false, true);
    }
    
    if (appointment.status === "Cancelled") {
      return createResponse(res, 400, "Appointment is already cancelled", [], false, true);
    }
    
    appointment.status = "Cancelled";
    await appointment.save();
    
    logger.info(`Appointment cancelled: ${id}`);
    return createResponse(res, 200, "Appointment cancelled", appointment, true, false);
  } catch (error: any) {
    logger.error('Cancel appointment error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const rescheduleAppointmentController = asyncHandler(async (req: any, res: any) => {
  try {
    const patientId = req.user.id;
    const { id } = req.params;
    const { date, startTime } = req.body;
    
    if (!date || !startTime) {
      return createResponse(res, 400, "New date and startTime required", [], false, true);
    }

    const appointment = await AppointmentTbl.findOne({
      where: { id, patientId, isDeleted: false }
    });
    
    if (!appointment) {
      return createResponse(res, 404, "Appointment not found", [], false, true);
    }
    
    if (appointment.status === "Completed" || appointment.status === "Cancelled") {
      return createResponse(res, 400, `Cannot reschedule a ${appointment.status} appointment`, [], false, true);
    }

    // Check doctor availability on new date
    const doctor = await Doctor.findOne({ where: { id: appointment.doctorId, isDeleted: false } });
    if (!doctor) {
      return createResponse(res, 404, "Doctor not found", [], false, true);
    }
    
    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    if (!doctor.availableDays || !doctor.availableDays.includes(dayName)) {
      return createResponse(res, 400, `Doctor is not available on ${dayName}`, [], false, true);
    }

    // Check overlap with other appointments
    const startTimeStr = moment(`${date} ${startTime}`).format("HH:mm");
    const newStart = moment(`${date} ${startTimeStr}`, "YYYY-MM-DD HH:mm");
    const newEnd = moment(newStart).add(1, "hour");

    const existing = await AppointmentTbl.find({
      where: { doctorId: appointment.doctorId, date, isDeleted: false }
    });
    
    const conflict = existing.find(a => {
      if (a.id === appointment.id) return false; // Skip current appointment
      
      const aStart = moment(`${a.date} ${a.startTime}`, "YYYY-MM-DD HH:mm");
      const aEnd = moment(aStart).add(1, "hour");
      
      return newStart.isBefore(aEnd) && newEnd.isAfter(aStart);
    });
    
    if (conflict) {
      const conflictStart = moment(`${conflict.date} ${conflict.startTime}`, "YYYY-MM-DD HH:mm");
      const conflictEnd = conflictStart.add(1, "hour").format("hh:mm A");
      return createResponse(res, 409, `Doctor already has an appointment. Try after ${conflictEnd}`, [], false, true);
    }

    appointment.date = date;
    appointment.startTime = startTimeStr;
    await appointment.save();
    
    logger.info(`Appointment rescheduled: ${id}`);
    return createResponse(res, 200, "Appointment rescheduled", appointment, true, false);
  } catch (error: any) {
    logger.error('Reschedule appointment error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});