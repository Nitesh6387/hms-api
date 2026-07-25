import jsonwebtoken from 'jsonwebtoken'
import { createResponse } from '../Helpers/createResponse';
import { envConfig } from '../config/env.config';
import { ApiError } from './errorHandler';

export const authUser = async (req: any, res: any, next: any) => {
  try {
    const tokenKey = req?.headers?.authorization?.split(" ")[1];
    
    if (!tokenKey) {
      const error = new Error('Token not found') as ApiError;
      error.statusCode = 401;
      throw error;
    }

    const decoded = jsonwebtoken.verify(
      tokenKey, 
      envConfig.jwt.secret
    ) as any;
    
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return createResponse(res, 401, "Invalid token", [], false, true);
    }
    if (err.name === 'TokenExpiredError') {
      return createResponse(res, 401, "Token expired", [], false, true);
    }
    return createResponse(res, 401, "Unauthorized", [], false, true);
  }
};