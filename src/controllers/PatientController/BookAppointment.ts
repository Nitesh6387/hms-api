import moment from "moment";
import { Doctor } from "../../Entities/DoctorTbl";
import { AppointmentTbl } from "../../Entities/AppointmentTbl";
import { createResponse } from "../../Helpers/createResponse";
import { Patient } from "../../Entities/PatientTbl";
import { Department } from "../../Entities/DepartmentTbl";
import { asyncHandler } from "../../middleware/errorHandler";
import logger from "../../config/logger";

export const addapController = asyncHandler(async (req: any, res: any) => {
  try {
    const { patientId, departmentId, doctorId, disease, symptoms, payment, status, appointmentType, date, startTime } = req.body;

    if (!patientId || !doctorId || !date || !startTime) {
      return createResponse(res, 400, "Missing required fields", [], false, true);
    }

    // Verify doctor exists
    const doctor = await Doctor.findOne({ where: { id: doctorId, isDeleted: false } });
    if (!doctor) {
      return createResponse(res, 404, "Doctor not found", [], false, true);
    }

    // Check doctor availability
    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    if (!doctor.availableDays || !doctor.availableDays.includes(dayName)) {
      return createResponse(res, 400, `Doctor is not available on ${dayName}`, [], false, true);
    }

    // Store startTime as HH:mm string
    const startTimeStr = moment(`${date} ${startTime}`).format("HH:mm");
    const appointmentStart = moment(`${date} ${startTimeStr}`, "YYYY-MM-DD HH:mm");
    const appointmentEnd = moment(appointmentStart).add(1, "hour");

    // Check for overlapping appointments
    const existingAppointments = await AppointmentTbl.find({
      where: { doctorId, date, isDeleted: false }
    });

    const overlappingAppointment = existingAppointments.find((appt) => {
      const apptStart = moment(`${appt.date} ${appt.startTime}`, "YYYY-MM-DD HH:mm");
      const apptEnd = moment(apptStart).add(1, "hour");

      return appointmentStart.isBefore(apptEnd) && appointmentEnd.isAfter(apptStart);
    });

    if (overlappingAppointment) {
      const conflictStart = moment(`${overlappingAppointment.date} ${overlappingAppointment.startTime}`, "YYYY-MM-DD HH:mm");
      const conflictEnd = conflictStart.add(1, "hour").format("hh:mm A");
      return createResponse(res, 409, `Doctor already has an appointment. Try after ${conflictEnd}`, [], false, true);
    }

    // Create new appointment
    const newAppointment = new AppointmentTbl();
    newAppointment.patientId = patientId;
    newAppointment.departmentId = departmentId;
    newAppointment.doctorId = doctorId;
    newAppointment.disease = disease;
    newAppointment.symptoms = symptoms;
    newAppointment.payment = payment;
    newAppointment.status = status || "In-progress";
    newAppointment.appointmentType = appointmentType;
    newAppointment.date = date;
    newAppointment.startTime = startTimeStr;

    await newAppointment.save();
    
    logger.info(`Appointment created: ${newAppointment.id}`);
    return createResponse(res, 201, "Appointment created successfully", newAppointment, true, false);
  } catch (error: any) {
    logger.error('Create appointment error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const GetaddapByPatientController = asyncHandler(async (req: any, res: any) => {
  try {
    const { patientId } = req.query;
    
    if (!patientId) {
      return createResponse(res, 400, "Patient ID is required", [], false, true);
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
      .where('apptbl.patientId=:patientId AND apptbl.isDeleted = false', { patientId })
      .orderBy('apptbl.createdAt', 'DESC')
    
    const result = await queryBuilder.getRawMany();

    return createResponse(res, 200, "Appointment Data Fetch successfully", result, true, false);
  } catch (error: any) {
    logger.error('Get patient appointments error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});

export const DeleteAppointmentByIdController = asyncHandler(async (req: any, res: any) => {
  try {
    const { appointmentId } = req.query;

    if (!appointmentId) {
      return createResponse(res, 400, "Appointment ID is required", [], false, true);
    }

    // Soft delete
    const result = await AppointmentTbl.createQueryBuilder()
      .update(AppointmentTbl)
      .set({ isDeleted: true } as any)
      .where("id = :id", { id: appointmentId })
      .andWhere("isDeleted = :isDeleted", { isDeleted: false })
      .execute();

    if (!result.affected || result.affected === 0) {
      return createResponse(res, 404, "Appointment not found", [], false, true);
    }

    logger.info(`Appointment deleted: ${appointmentId}`);
    return createResponse(
      res,
      200,
      "Appointment deleted successfully",
      [],
      true,
      false
    );
  } catch (error: any) {
    logger.error('Delete appointment error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});