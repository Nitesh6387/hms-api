import jsonwebtoken from 'jsonwebtoken'
import { createResponse } from '../Helpers/createResponse';

export const authUser = async (req: any, res: any, next: any) => {
    const tokenKey = req?.headers?.authorization?.split(" ")[1];
    if (!tokenKey) {
        return createResponse(res, 404, "Token Not Found!", [], false, true);
    }
    else {
        await jsonwebtoken.verify(tokenKey, `${process.env.JWTSECRET}`, (err: any, decode: any) => {
            if (err) {
                return createResponse(res, 401, "Invalid token !", [], false, true);
            }
            else {
                req.user = decode;
                next()
            }
        })
    }

}