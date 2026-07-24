import { Patient } from "../../Entities/PatientTbl";
import { createResponse } from "../../Helpers/createResponse";

export const getPatientProfileController = async (req: any, res: any) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findOne({ where: { id: patientId, isDeleted: false } });
    if (!patient) return createResponse(res, 404, "Patient not found", [], false, true);
    return createResponse(res, 200, "Profile fetched", patient, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};

export const updatePatientProfileController = async (req: any, res: any) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findOne({ where: { id: patientId, isDeleted: false } });
    if (!patient) return createResponse(res, 404, "Patient not found", [], false, true);
    const { name, gender, contact, age, bloodGroup, aadhaarNo } = req.body;
    if (name) patient.name = name;
    if (gender) patient.gender = gender;
    if (contact) patient.contact = contact;
    if (age) patient.age = age;
    if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (aadhaarNo) patient.aadhaarNo = aadhaarNo;
    await patient.save();
    return createResponse(res, 200, "Profile updated", patient, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};

export const changePatientPasswordController = async (req: any, res: any) => {
  try {
    const patientId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const patient = await Patient.findOne({ where: { id: patientId } });
    if (!patient) return createResponse(res, 404, "Patient not found", [], false, true);
    // skip bcrypt; plaintext comparison
    if (patient.password !== oldPassword) {
      return createResponse(res, 401, "Old password is incorrect", [], false, true);
    }
    patient.password = newPassword;
    await patient.save();
    return createResponse(res, 200, "Password changed", [], true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};