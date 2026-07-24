import { AppointmentTbl } from "../../Entities/AppointmentTbl";
import { Department } from "../../Entities/DepartmentTbl";
import { Doctor } from "../../Entities/DoctorTbl";
import { Patient } from "../../Entities/PatientTbl";
import { createResponse } from "../../Helpers/createResponse";

//fetch all data withoult joining
export const getAppointmentData = async (req: any, res: any) => {
    try {
        const result = await AppointmentTbl.find()
        // console.log(result.length);
        if (result.length > 0) {
            return createResponse(res, 200, "Appointment Data Fetch Successfully!", result, true, false)
        }
        else {
            return createResponse(res, 200, "No Data Found", result, true, false)
        }

    } catch (error: any) {
        console.log(error.message);
        return createResponse(res, 500, "Internal server error", [], false, true)
    }
}


export const adminGetAppointmentData = async (req: any, res: any) => {
  try {
    const queryBuilder = AppointmentTbl.createQueryBuilder('apptbl')
      .select([
        "patient.name", "patient.email", "patient.id",
        "department.name",
        "doctor.name", "doctor.fees", "doctor.profile", "doctor.specialist",
        "apptbl.id", "apptbl.disease", "apptbl.symptoms", "apptbl.status", "apptbl.appointmentType", "apptbl.date", "apptbl.startTime", "apptbl.payment", "apptbl.createdAt"
      ])
      .leftJoin(Patient, "patient", `apptbl.patientId=patient.id::varchar AND patient.isDeleted=false`)
      .leftJoin(Department, "department", `apptbl.departmentId=department.id::varchar`)
      .leftJoin(Doctor, "doctor", `apptbl.doctorId=doctor.id::varchar AND doctor.isDeleted=false`)
      .where('apptbl.isDeleted = :deleted', { deleted: false });

    // Optional: add filters from query params (status, date, doctorId, patientId)
    if (req.query.status) {
      queryBuilder.andWhere('apptbl.status = :status', { status: req.query.status });
    }
    if (req.query.date) {
      queryBuilder.andWhere('apptbl.date = :date', { date: req.query.date });
    }
    if (req.query.doctorId) {
      queryBuilder.andWhere('apptbl.doctorId = :doctorId', { doctorId: req.query.doctorId });
    }
    if (req.query.patientId) {
      queryBuilder.andWhere('apptbl.patientId = :patientId', { patientId: req.query.patientId });
    }

    const result = await queryBuilder.getRawMany();
    return createResponse(res, 200, "Appointment Data Fetch Successfully!", result, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};


export const getAppointmentByIdController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await AppointmentTbl.createQueryBuilder('apptbl')
      .select([
        "patient.name", "patient.email", "patient.contact", "patient.age",
        "department.name",
        "doctor.name", "doctor.fees", "doctor.specialist",
        "apptbl.id", "apptbl.disease", "apptbl.symptoms", "apptbl.status", "apptbl.appointmentType", "apptbl.date", "apptbl.startTime", "apptbl.payment", "apptbl.createdAt"
      ])
      .leftJoin(Patient, "patient", `apptbl.patientId=patient.id::varchar AND patient.isDeleted=false`)
      .leftJoin(Department, "department", `apptbl.departmentId=department.id::varchar`)
      .leftJoin(Doctor, "doctor", `apptbl.doctorId=doctor.id::varchar AND doctor.isDeleted=false`)
      .where('apptbl.id = :id AND apptbl.isDeleted = false', { id })
      .getRawOne();

    if (!result) return createResponse(res, 404, "Appointment not found", [], false, true);
    return createResponse(res, 200, "Appointment fetched", result, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};

export const updateAppointmentStatusController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return createResponse(res, 400, "Status is required", [], false, true);
    const appointment = await AppointmentTbl.findOne({ where: { id, isDeleted: false } });
    if (!appointment) return createResponse(res, 404, "Appointment not found", [], false, true);
    appointment.status = status;
    await appointment.save();
    return createResponse(res, 200, "Appointment status updated", appointment, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};
export const updateAppointmentController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { patientId, doctorId, departmentId, disease, symptoms, payment, status, appointmentType, date, startTime } = req.body;
    const appointment = await AppointmentTbl.findOne({ where: { id, isDeleted: false } });
    if (!appointment) return createResponse(res, 404, "Appointment not found");
    // Update fields
    if (patientId) appointment.patientId = patientId;
    if (doctorId) appointment.doctorId = doctorId;
    if (departmentId) appointment.departmentId = departmentId;
    if (disease) appointment.disease = disease;
    if (symptoms) appointment.symptoms = symptoms;
    if (payment) appointment.payment = payment;
    if (status) appointment.status = status;
    if (appointmentType) appointment.appointmentType = appointmentType;
    if (date) appointment.date = date;
    if (startTime) appointment.startTime = startTime;
    await appointment.save();
    return createResponse(res, 200, "Appointment updated", appointment);
  } catch (error) {
    return createResponse(res, 500, "Internal server error");
  }
};