import { Doctor } from "../../Entities/DoctorTbl";
import { Department } from "../../Entities/DepartmentTbl";
import { createResponse } from "../../Helpers/createResponse";

export const addDoctorController = async (req: any, res: any) => {
  try {
    const { name, departmentId, specialist, qualifications, experience, fees, address, gender, email, contact, password, availableDays } = req.body;
    if (!name || !departmentId || !email) {
      return createResponse(res, 400, "Name, departmentId and email are required", [], false, true);
    }
    const existing = await Doctor.findOne({ where: { email } });
    if (existing) return createResponse(res, 409, "Doctor with this email already exists", [], false, true);
    const newDoctor = new Doctor();
    newDoctor.name = name;
    newDoctor.departmentId = departmentId;
    newDoctor.specialist = specialist;
    newDoctor.qualifications = qualifications;
    newDoctor.experience = experience;
    newDoctor.fees = fees;
    newDoctor.address = address;
    newDoctor.gender = gender;
    newDoctor.email = email;
    newDoctor.contact = contact;
    newDoctor.password = password || "Test@1234";
    newDoctor.availableDays = availableDays || [];
    newDoctor.isActive = true;
    newDoctor.isDeleted = false;
    await newDoctor.save();
    return createResponse(res, 201, "Doctor added successfully", newDoctor, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};

export const updateDoctorController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findOne({ where: { id, isDeleted: false } });
    if (!doctor) return createResponse(res, 404, "Doctor not found", [], false, true);
    const { name, departmentId, specialist, qualifications, experience, fees, address, gender, contact, availableDays, isActive } = req.body;
    if (name) doctor.name = name;
    if (departmentId) doctor.departmentId = departmentId;
    if (specialist) doctor.specialist = specialist;
    if (qualifications) doctor.qualifications = qualifications;
    if (experience) doctor.experience = experience;
    if (fees) doctor.fees = fees;
    if (address) doctor.address = address;
    if (gender) doctor.gender = gender;
    if (contact) doctor.contact = contact;
    if (availableDays) doctor.availableDays = availableDays;
    if (isActive !== undefined) doctor.isActive = isActive;
    await doctor.save();
    return createResponse(res, 200, "Doctor updated", doctor, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};

export const deleteDoctorController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findOne({ where: { id, isDeleted: false } });
    if (!doctor) return createResponse(res, 404, "Doctor not found", [], false, true);
    doctor.isDeleted = true;
    await doctor.save();
    return createResponse(res, 200, "Doctor deleted (soft)", doctor, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};

export const getSingleDoctorController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.createQueryBuilder("doctor")
      .leftJoinAndSelect(Department, "department", "doctor.departmentId = department.id::varchar")
      .where("doctor.id = :id AND doctor.isDeleted = false", { id })
      .select(["doctor", "department.name as departmentName"])
      .getRawOne();
    if (!doctor) return createResponse(res, 404, "Doctor not found", [], false, true);
    return createResponse(res, 200, "Doctor fetched", doctor, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};