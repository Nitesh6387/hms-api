import { Department } from "../../Entities/DepartmentTbl";
import { createResponse } from "../../Helpers/createResponse";
import { asyncHandler } from "../../middleware/errorHandler";
import logger from "../../config/logger";

export const addDepartmentController = asyncHandler(async (req: any, res: any) => {
  try {
    const { name }: any = req.body;
    
    if (!name || name.trim().length === 0) {
      return createResponse(res, 400, "Department name is required", [], false, true);
    }
    
    const strName = name.trim().toLowerCase();
    const isExist = await Department.findOne({ where: { name: strName } })
    
    if (isExist) {
      return createResponse(res, 409, "Department Already exist !", [], false, true)
    }
    
    const result = await Department.save({ name: strName });
    logger.info(`Department created: ${strName}`);
    return createResponse(res, 201, "Department created successfully", result, true, false)
  } catch (error: any) {
    logger.error('Create department error:', error);
    return createResponse(res, 500, "Internal Server Error !", [], false, true)
  }
});

export const getDepartments = asyncHandler(async (req: any, res: any) => {
  try {
    const result = await Department.find()
    if (result?.length > 0) {
      return createResponse(res, 200, "Department Fetch Successfully!", result, true, false);
    }
    else {
      return createResponse(res, 404, "Department Not Found!", [], false, true);
    }
  } catch (error: any) {
    logger.error('Get departments error:', error);
    return createResponse(res, 500, "Internal Server Error", [], false, true);
  }
});

export const delDepartment = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return createResponse(res, 400, "Department ID is required", [], false, true);
    }
    
    const result = await Department.delete({ id });
    
    if (result.affected === 0) {
      return createResponse(res, 404, "Department not found", [], false, true);
    }
    
    logger.info(`Department deleted: ${id}`);
    return createResponse(res, 200, "Department Deleted Successfully", result, true, false);
  } catch (error: any) {
    logger.error('Delete department error:', error);
    return createResponse(res, 500, "Internal Server Error", [], false, true);
  }
});

export const updateDepartmentController = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      return createResponse(res, 400, "Department name is required", [], false, true);
    }
    
    const department = await Department.findOne({ where: { id } });
    if (!department) {
      return createResponse(res, 404, "Department not found", [], false, true);
    }
    
    department.name = name.trim().toLowerCase();
    await department.save();
    
    logger.info(`Department updated: ${id}`);
    return createResponse(res, 200, "Department updated", department, true, false);
  } catch (error: any) {
    logger.error('Update department error:', error);
    return createResponse(res, 500, "Internal server error", [], false, true);
  }
});