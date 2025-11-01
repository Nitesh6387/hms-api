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
    const queryBuilder = AppointmentTbl.createQueryBuilder('apptbl')
        .select([
            "patient.name", "patient.email","patient.id",//Patient ka data nikal rhe hai
            "department.name", "department.name",//Department ka data nikal rhe hai
            "doctor.name", "doctor.fees", "doctor.profile", "doctor.specialist",
            "apptbl.id", "apptbl.disease", "apptbl.symptoms", "apptbl.status", "apptbl.appointmentType", "apptbl.date", "apptbl.startTime", "apptbl.payment", "apptbl.createdAt"
        ])
        .leftJoin(Patient, "patient", `apptbl.patientId=patient.id::varchar`)
        .leftJoin(Department, "department", `apptbl.departmentId=department.id::varchar`)
        .leftJoin(Doctor, "doctor", `apptbl.doctorId=doctor.id::varchar`)
    const result = await queryBuilder.getRawMany()


    res.send(result)
};