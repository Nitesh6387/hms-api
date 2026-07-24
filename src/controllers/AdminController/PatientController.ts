import { Patient } from "../../Entities/PatientTbl";
import { createResponse } from "../../Helpers/createResponse";

export const removePatientById = async (req: any, res: any) => {
    try {
        const { id } = req.params;

        if (!id) {
            return createResponse(res, 400, "Patient ID is required", [], false, true);
        }

        const patient = await Patient.findOne({ where: { id } });

        if (!patient) {
            return createResponse(res, 404, "Patient not found", [], false, true);
        }

        await Patient.remove(patient);

        return createResponse(res, 200, "Patient removed successfully", patient, true, false);
    } catch (error: any) {
        console.error(error.message);
        return createResponse(res, 500, "Internal server error", [], false, true);
    }
};
export const InActivePatient = async (req: any, res: any) => {
    try {
        const { id } = req.params;

        if (!id) {
            return createResponse(res, 400, "Patient ID is required", [], false, true);
        }

        const patient = await Patient.findOne({ where: { id } });

        if (!patient) {
            return createResponse(res, 404, "Patient not found", [], false, true);
        }

        patient.isActive = false;
        patient.updatedAt = new Date(); // optional: update timestamp

        await patient.save();

        return createResponse(res, 200, "Patient deactivated (soft deleted) successfully", patient, true, false);
    } catch (error: any) {
        console.error(error.message);
        return createResponse(res, 500, "Internal server error", [], false, true);
    }
};


export const updatePatientByAdminController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({ where: { id, isDeleted: false } });
    if (!patient) return createResponse(res, 404, "Patient not found", [], false, true);
    const { name, gender, contact, age, bloodGroup, aadhaarNo, isActive } = req.body;
    if (name) patient.name = name;
    if (gender) patient.gender = gender;
    if (contact) patient.contact = contact;
    if (age) patient.age = age;
    if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (aadhaarNo) patient.aadhaarNo = aadhaarNo;
    if (isActive !== undefined) patient.isActive = isActive;
    await patient.save();
    return createResponse(res, 200, "Patient updated", patient, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};

export const activatePatientController = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({ where: { id } }); // allow soft-deleted to be found
    if (!patient) return createResponse(res, 404, "Patient not found", [], false, true);
    patient.isActive = true;
    patient.isDeleted = false;
    await patient.save();
    return createResponse(res, 200, "Patient activated", patient, true, false);
  } catch (error: any) {
    console.error(error.message);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
};