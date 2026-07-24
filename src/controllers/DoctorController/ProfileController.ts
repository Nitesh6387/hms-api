import { Doctor } from "../../Entities/DoctorTbl";
import { Department } from "../../Entities/DepartmentTbl";
import { createResponse } from "../../Helpers/createResponse";

export const getDoctorProfileController = async (req: any, res: any) => {
  try {
    const doctorId = req.user.id;
    const doctor = await Doctor.createQueryBuilder("doctor")
      .leftJoin(Department, "department", "doctor.departmentId = department.id::varchar")
      .where("doctor.id = :id AND doctor.isDeleted = false", { id: doctorId })
      .select(["doctor", "department.name as departmentName"])
      .getRawOne();
    if (!doctor) return createResponse(res, 404, "Doctor not found", [], false, true);
    return createResponse(res, 200, "Profile fetched", doctor, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};

export const updateDoctorProfileController = async (req: any, res: any) => {
  try {
    const doctorId = req.user.id;
    const doctor = await Doctor.findOne({ where: { id: doctorId, isDeleted: false } });
    if (!doctor) return createResponse(res, 404, "Doctor not found", [], false, true);
    const { name, contact, address, fees, availableDays } = req.body;
    if (name) doctor.name = name;
    if (contact) doctor.contact = contact;
    if (address) doctor.address = address;
    if (fees) doctor.fees = fees;
    if (availableDays) doctor.availableDays = availableDays;
    await doctor.save();
    return createResponse(res, 200, "Profile updated", doctor, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};

export const updateAvailabilityController = async (req: any, res: any) => {
  try {
    const doctorId = req.user.id;
    const { availableDays } = req.body;
    if (!availableDays || !Array.isArray(availableDays)) {
      return createResponse(res, 400, "availableDays must be an array", [], false, true);
    }
    await Doctor.update({ id: doctorId }, { availableDays });
    return createResponse(res, 200, "Availability updated", { availableDays }, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};