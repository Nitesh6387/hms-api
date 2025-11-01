import moment from "moment";
import { Doctor } from "../../Entities/DoctorTbl";
import { AppointmentTbl } from "../../Entities/AppointmentTbl";
import { createResponse } from "../../Helpers/createResponse";
import { Patient } from "../../Entities/PatientTbl";
import { Department } from "../../Entities/DepartmentTbl";

export const addapController = async (req: any, res: any) => {
    try {
        const { patientId, departmentId, doctorId, disease, symptoms, payment, status, appointmentType, date, startTime, } = req.body;

        if (!patientId || !doctorId || !date || !startTime) {
            return createResponse(res, 400, "Missing required fields", [], false, true);
        }

        const doctor = await Doctor.findOne({ where: { id: doctorId } });
        if (!doctor) {
            return createResponse(res, 404, "Doctor not found", [], false, true);
        }

        const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
        if (!doctor.availableDays || !doctor.availableDays.includes(dayName)) {
            return createResponse(res, 400, `Doctor is not available on ${dayName}`, [], false, true);
        }

        const appointmentStart = moment(`${date} ${startTime}`, "YYYY-MM-DD HH:mm");
        const appointmentEnd = moment(appointmentStart).add(1, "hour");

        const existingAppointments = await AppointmentTbl.find({ where: { doctorId, date } });

        const overlappingAppointment = existingAppointments.find((appt) => {
            const apptStart = moment(`${appt.date} ${moment(appt.startTime, "HH:mm:ss").format("HH:mm")}`, "YYYY-MM-DD HH:mm");
            const apptEnd = moment(apptStart).add(1, "hour");

            const isSameTime = appointmentStart.isSame(apptStart);
            const isOverlapping = appointmentStart.isBefore(apptEnd) && appointmentEnd.isAfter(apptStart);

            return isSameTime || isOverlapping;
        });

        if (overlappingAppointment) {
            const apptStart = moment(`${overlappingAppointment.date} ${moment(overlappingAppointment.startTime, "HH:mm:ss").format("HH:mm")}`, "YYYY-MM-DD HH:mm");
            const apptEndFormatted = apptStart.add(59, "minutes").format("hh:mm A");
            return createResponse(res, 409, `Doctor already has an appointment. Try after ${apptEndFormatted}`, [], false, true);
        }

        const newAppointment = new AppointmentTbl();
        newAppointment.patientId = patientId;
        newAppointment.departmentId = departmentId;
        newAppointment.doctorId = doctorId;
        newAppointment.disease = disease;
        newAppointment.symptoms = symptoms;
        newAppointment.payment = payment;
        newAppointment.status = status;
        newAppointment.appointmentType = appointmentType;
        newAppointment.date = date;
        newAppointment.startTime = appointmentStart.toDate(); // Keep your original style

        await newAppointment.save();

        return createResponse(res, 201, "Appointment created successfully", newAppointment, true, false);
    } catch (error) {
        console.error("Error in addapController:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const GetaddapByPatientController = async (req: any, res: any) => {
    try {
        const { patientId } = req.query;
        if (!patientId) {
            return createResponse(res, 400, "Patient ID is required", [], false, true);
        }
        const queryBuilder = AppointmentTbl.createQueryBuilder('apptbl')
            .select([
                "patient.name", "patient.email",//Patient ka data nikal rhe hai
                "department.name", "department.name",//Department ka data nikal rhe hai
                "doctor.name", "doctor.fees", "doctor.profile", "doctor.specialist",
                "apptbl.id", "apptbl.disease", "apptbl.symptoms", "apptbl.status", "apptbl.appointmentType", "apptbl.date", "apptbl.startTime", "apptbl.payment", "apptbl.createdAt"
            ])
            .leftJoin(Patient, "patient", `apptbl.patientId=patient.id::varchar`)
            .leftJoin(Department, "department", `apptbl.departmentId=department.id::varchar`)
            .leftJoin(Doctor, "doctor", `apptbl.doctorId=doctor.id::varchar`)
            .where('apptbl.patientId=:patientId', { patientId: patientId })
        // .orWhere()
        // .limit(1)
        // .offset(2)
        // .orderBy('apptbl.createdAt',"ASC")
        // .addOrderBy
        const result = await queryBuilder.getRawMany()

        return createResponse(res, 200, "Appointment Data Fetch successfully", result, true, false);

    } catch (error: any) {
        console.error(error.message);
        return createResponse(res, 500, "Internal server error", [], false, true);
    }
};

export const DeleteAppointmentByIdController = async (req: any, res: any) => {
  try {
    const { appointmentId } = req.query;

    if (!appointmentId) {
      return createResponse(res, 400, "Appointment ID is required", [], false, true);
    }

    const result = await AppointmentTbl.createQueryBuilder()
      .delete()
      .from(AppointmentTbl)
      .where("id = :appointmentId", { appointmentId })
      .execute();

    return createResponse(
      res,
      200,
      `${result.affected} appointment(s) deleted successfully.`,
      [],
      true,
      false
    );
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};


