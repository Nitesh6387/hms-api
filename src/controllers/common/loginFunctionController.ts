import { createResponse } from "../../Helpers/createResponse";
import { returnUserType } from "../../Helpers/returnUserType";
import jsonwebtoken from 'jsonwebtoken'
import { uploadFileHelper } from "../../Helpers/uploadFileHelper";
import path from "path";
import { Patient } from "../../Entities/PatientTbl";
import { Doctor } from "../../Entities/DoctorTbl";
export const userLoginController = async (req: any, res: any) => {
    try {
        const { email, password, userType } = req.body;
        const tableName: any = await returnUserType(userType)
        const result = await tableName.findOne({ where: { email, password } });
        const jwtToken = await jsonwebtoken.sign({ id: result?.id, email: result?.email }, `${process.env.JWTSECRET}`, { expiresIn: '2h' })
        const finalResult = { ...result, jwtToken, userType }
        if (result) {
            return createResponse(res, 200, "Login success", finalResult, true, false)
        } else {
            return createResponse(res, 404, "Login Failed!", [], false, true)
        }
    } catch (err: any) {
        return createResponse(res, 500, "Internal Server Error!", err, false, true)
    }
}


export const userRegisterController = async (req: any, res: any) => {
    try {
        const dataToSave = req.body;
        let { profile } = req.files;
        const pathToSaveFile = path.join(__dirname, '../../uploads/');
        const profileName = uploadFileHelper(profile, pathToSaveFile, res);
        const finalData: any = { ...dataToSave, profile: profileName };
        const TblName: any = await returnUserType(dataToSave?.userType);
        const isExist = await TblName.findOne({ where: { email: dataToSave?.email } });
        if (isExist) {
            return createResponse(res, 208, "User Already Exist !", isExist, false, true)
        } else {
            const result = await TblName.save(finalData);
            return createResponse(res, 201, "User register successfully !", result, true, false)
        }
    } catch (err) {
        // console.log(err);
        createResponse(res, 500, "Internal Server Error", [], false, true);
    }
}

export const getPatients = async (req: any, res: any) => {
    try {
        const result = await Patient.find()
        createResponse(res, 200, "Data Fetch Successfully!", result, true, false);
    } catch (error) {
        createResponse(res, 500, "Internal Server Error", [], false, true);
    }
}
export const getDoctors = async (req: any, res: any) => {
    try {
        const result = await Doctor.find()
        createResponse(res, 200, "Data Fetch Successfully!", result, true, false);
    } catch (error) {
        createResponse(res, 500, "Internal Server Error", [], false, true);
    }
}