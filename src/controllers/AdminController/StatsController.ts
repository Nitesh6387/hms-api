import { AppointmentTbl } from "../../Entities/AppointmentTbl";
import { Patient } from "../../Entities/PatientTbl";
import { Doctor } from "../../Entities/DoctorTbl";
import { createResponse } from "../../Helpers/createResponse";

export const getDashboardStatsController = async (req: any, res: any) => {
  try {
    const totalPatients = await Patient.count({ where: { isDeleted: false } });
    const totalDoctors = await Doctor.count({ where: { isActive: true, isDeleted: false } });
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = await AppointmentTbl.count({ where: { date: today, isDeleted: false } });
    const completed = await AppointmentTbl.find({ where: { status: "Completed", isDeleted: false } });
    const totalRevenue = completed.reduce((sum, a) => sum + parseFloat(a.payment || '0'), 0);
    return createResponse(res, 200, "Stats fetched", { totalPatients, totalDoctors, todayAppointments, totalRevenue }, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};