import { Department } from "../../Entities/DepartmentTbl";
import { createResponse } from "../../Helpers/createResponse";

export const addDepartmentController = async (req: any, res: any) => {
    const { name }: any = req.body;
    const strName = name.toLowerCase()
    const isExist = await Department.findOne({ where: { name: strName } })
    if (isExist) {
        return createResponse(res, 200, "Department Already exist !", isExist, false, true)
    }
    else {
        const result = await Department.save({ name: strName });
        return createResponse(res, 201, "Department created successfully", result, false, true)
    }
}