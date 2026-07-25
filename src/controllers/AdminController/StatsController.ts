import { AppointmentTbl } from "../../Entities/AppointmentTbl";
import { Patient } from "../../Entities/PatientTbl";
import { Doctor } from "../../Entities/DoctorTbl";
import { createResponse } from "../../Helpers/createResponse";
import { asyncHandler } from "../../middleware/errorHandler";
import logger from "../../config/logger";

export const getDashboardStatsController = asyncHandler(async (req: any, res: any) => {
  try {
    const totalPatients = await Patient.count({ where: { isDeleted: false } });
    const totalDoctors = await Doctor.count({ where: { isActive: true, isDeleted: false } });
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = await AppointmentTbl.count({ where: { date: today, isDeleted: false } });
    const completed = await AppointmentTbl.find({ where: { status: "Completed", isDeleted: false } });
    const totalRevenue = completed.reduce((sum, a) => sum + parseFloat(a.payment || '0'), 0);
    
    const stats = {
      totalPatients,
      totalDoctors,
      todayAppointments,
      totalRevenue,
      pendingAppointments: await AppointmentTbl.count({ where: { status: "In-progress", isDeleted: false } }),
      completedAppointments: completed.length,
    };
    
    logger.info('Dashboard stats fetched');
    return createResponse(res, 200, "Stats fetched", stats, true, false);
  } catch (error: any) {
    logger.error('Get stats error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});