import { createResponse } from "../../Helpers/createResponse";
import { returnUserType } from "../../Helpers/returnUserType";
import jsonwebtoken from 'jsonwebtoken'
import { uploadFileHelper } from "../../Helpers/uploadFileHelper";
import path from "path";
import { Patient } from "../../Entities/PatientTbl";
import { Doctor } from "../../Entities/DoctorTbl";
import { Admin } from "../../Entities/AdminTbl";
import { createRandomString, sendForgetPasswordMail } from "../../Helpers/SendMailForgetPassword";
import { hashPassword, comparePassword } from "../../utils/password.util";
import { loginSchema, registerSchema, forgetPasswordSchema, resetPasswordSchema } from "../../validators/auth.validator";
import { asyncHandler } from "../../middleware/errorHandler";
import logger from "../../config/logger";

export const userLoginController = asyncHandler(async (req: any, res: any) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    const { email, password, userType } = validatedData;
    
    const tableName: any = await returnUserType(userType);
    
    // Find user by email only (not password)
    const result = await tableName.findOne({ where: { email } });
    
    if (!result) {
      return createResponse(res, 401, "Invalid credentials", [], false, true);
    }

    // Compare hashed password
    const isPasswordValid = await comparePassword(password, result.password);
    
    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return createResponse(res, 401, "Invalid credentials", [], false, true);
    }

    // Generate JWT token
    const jwtToken = jsonwebtoken.sign(
      { id: result.id, email: result.email, userType }, 
      process.env.JWT_SECRET || 'your_super_secure_jwt_secret_key_here', 
      { expiresIn: '2h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = result;
    const finalResult = { ...userWithoutPassword, jwtToken, userType };
    
    logger.info(`User logged in successfully: ${email}`);
    return createResponse(res, 200, "Login success", finalResult, true, false);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return createResponse(res, 400, "Validation error", err.errors, false, true);
    }
    logger.error('Login error:', err);
    return createResponse(res, 500, "Internal Server Error!", [], false, true);
  }
});

export const userRegisterController = asyncHandler(async (req: any, res: any) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    const dataToSave = validatedData;
    
    let { profile } = req.files || {};
    let profileName = null;

    // Handle profile upload
    if (profile) {
      const pathToSaveFile = path.join(__dirname, '../../uploads/');
      profileName = uploadFileHelper(profile, pathToSaveFile, res);
    }

    const TblName: any = await returnUserType(dataToSave.userType);
    
    // Check if user already exists
    const isExist = await TblName.findOne({ where: { email: dataToSave.email } });
    if (isExist) {
      return createResponse(res, 409, "User Already Exist!", [], false, true);
    }

    // Hash password before saving
    const hashedPassword = await hashPassword(dataToSave.password);

    // Prepare user data
    const finalData: any = {
      ...dataToSave,
      password: hashedPassword,
      profile: profileName,
      isActive: true,
      isDeleted: false,
    };

    const result = await TblName.save(finalData);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = result;
    
    logger.info(`User registered successfully: ${dataToSave.email}`);
    return createResponse(res, 201, "User register successfully!", userWithoutPassword, true, false);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return createResponse(res, 400, "Validation error", err.errors, false, true);
    }
    logger.error('Registration error:', err);
    return createResponse(res, 500, "Internal Server Error", [], false, true);
  }
});

export const forgetPassword = asyncHandler(async (req: any, res: any) => {
  try {
    const validatedData = forgetPasswordSchema.parse(req.body);
    const { email, userType } = validatedData;
    
    const TblName: any = await returnUserType(userType);
    const isExist = await TblName.findOne({ where: { email } });
    
    if (isExist) {
      const token = createRandomString();
      const tokenExpiry = new Date();
      tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 5); // 5 minutes expiry
      
      await TblName.update({ email: email }, { 
        token, 
        updatedAt: tokenExpiry 
      });
      
      await sendForgetPasswordMail(email, token);
      logger.info(`Password reset email sent to: ${email}`);
      return createResponse(res, 200, "Password reset link sent to your email", [], true, false);
    } else {
      // Don't reveal if email exists or not (security best practice)
      return createResponse(res, 200, "If email exists, password reset link has been sent", [], true, false);
    }
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return createResponse(res, 400, "Validation error", err.errors, false, true);
    }
    logger.error('Forget password error:', err);
    return createResponse(res, 500, "Internal Server Error", [], false, true);
  }
});

export const resetPassword = asyncHandler(async (req: any, res: any) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    const { token, password, userType } = validatedData;
    
    const TblName: any = await returnUserType(userType);
    const isTokenNotExpired = await TblName.findOne({ where: { token } });
    
    if (!isTokenNotExpired) {
      return createResponse(res, 404, "Invalid or expired token", [], false, true);
    }

    // Check if token is expired (5 minutes)
    const tokenIssueTime = new Date(isTokenNotExpired.updatedAt).getTime();
    const currentTime = Date.now();
    const expTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if ((currentTime - tokenIssueTime) >= expTime) {
      // Clear expired token
      await TblName.update({ token }, { token: '' });
      return createResponse(res, 400, "Token has expired", [], false, true);
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);
    
    // Update password and clear token
    await TblName.update({ token }, { password: hashedPassword, token: '' });
    
    logger.info(`Password reset successful for user type: ${userType}`);
    return createResponse(res, 200, "Password has been updated successfully!", [], true, false);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return createResponse(res, 400, "Validation error", err.errors, false, true);
    }
    logger.error('Reset password error:', err);
    return createResponse(res, 500, "Internal Server Error", [], false, true);
  }
});

export const getPatients = asyncHandler(async (req: any, res: any) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Patient.createQueryBuilder("Patients")
      .where("Patients.isDeleted = false")
      .skip(skip)
      .take(limit)
      .getMany();
    createResponse(res, 200, "Data Fetch Successfully!", result, true, false);
  } catch (error: any) {
    logger.error('Get patients error:', error);
    createResponse(res, 500, "Internal Server Error", [], false, true);
  }
});

export const getDoctors = asyncHandler(async (req: any, res: any) => {
  try {
    const result = await Doctor.find({ where: { isDeleted: false } });
    createResponse(res, 200, "Data Fetch Successfully!", result, true, false);
  } catch (error: any) {
    logger.error('Get doctors error:', error);
    createResponse(res, 500, "Internal Server Error", [], false, true);
  }
});