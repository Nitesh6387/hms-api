import { Admin } from "../Entities/AdminTbl";
import { Doctor } from "../Entities/DoctorTbl";
import { Patient } from "../Entities/PatientTbl";

export const returnUserType = (userType: any) => {
   if (userType === 'admin') {
      return Admin;
   } else if (userType === 'doctor') {
      return Doctor
   } else {
      return Patient
   }
}