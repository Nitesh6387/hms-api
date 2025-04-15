import { AppointmentTbl } from "../../Entities/AppointmentTbl";
import { Department } from "../../Entities/DepartmentTbl";
import { Doctor } from "../../Entities/DoctorTbl"
import { Patient } from "../../Entities/PatientTbl";
import { createResponse } from "../../Helpers/createResponse"

export const getDoctorBydepartmentIdController = async (req: any, res: any) => {
    try {
        const { departmentId } = req.query;
        const result = await Doctor.find({ where: { departmentId: departmentId } })
        if (result?.length > 0) {
            return createResponse(res, 200, "Doctor fetched successfully !", result, true, false)
        } else {
            return createResponse(res, 404, "Doctor not found", result, false, true)
        }
    } catch (err: any) {
        return createResponse(res, 500, "Internal server error", [], false, true)
    }
}

export const GetaddapByDoctorController = async (req: any, res: any) => {
    const { doctorId } = req.query;
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
        .where('apptbl.doctorId=:doctorId', { doctorId })
    const result = await queryBuilder.getRawMany()


    res.send(result)
};