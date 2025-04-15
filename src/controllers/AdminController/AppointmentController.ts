import { AppointmentTbl } from "../../Entities/AppointmentTbl";
import { createResponse } from "../../Helpers/createResponse";

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