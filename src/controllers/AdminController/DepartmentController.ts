import { Department } from "../../Entities/DepartmentTbl";
import { createResponse } from "../../Helpers/createResponse";

export const addDepartmentController = async (req: any, res: any) => {
    try {
        const { name }: any = req.body;
        const strName = name.trim().toLowerCase()
        const isExist = await Department.findOne({ where: { name: strName } })
        if (isExist) {
            return createResponse(res, 208, "Department Already exist !", isExist, false, true)
        }
        else {
            const result = await Department.save({ name: strName });
            return createResponse(res, 201, "Department created successfully", result, false, true)
        }
    } catch (error) {
        return createResponse(res, 500, "Internal Server Error !", [], false, true)
    }
}

export const getDepartments = async (req: any, res: any) => {
    try {
        const result = await Department.find()
        if (result?.length > 0) {
            createResponse(res, 200, "Department Fetch Successfully!", result, true, false);
        }
        else {
            createResponse(res, 400, "Department Not Found!", result, false, true);
        }

    } catch (error) {
        createResponse(res, 500, "Internal Server Error", [], false, true);
    }
}

export const delDepartment = async (req: any, res: any) => {
    try {
        const { id } = req.query;
        const result = await Department.delete({ id })
        console.log(result);
        createResponse(res, 200, "Department Deleted Successfully", result, true, false);
    } catch (error: any) {
        console.log(error.message);
        createResponse(res, 500, "Internal Server Error", [], false, true);
    }
}