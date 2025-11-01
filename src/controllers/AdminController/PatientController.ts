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
