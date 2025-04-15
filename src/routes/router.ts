import { Router } from "express"
import { forgetPassword, getDoctors, getPatients, resetPassword, userLoginController, userRegisterController } from "../controllers/common/loginFunctionController"
import { authUser } from "../middleware/verifyToken"
import { addDepartmentController, delDepartment, getDepartments } from "../controllers/AdminController/DepartmentController"
import { GetaddapByDoctorController, getDoctorBydepartmentIdController } from "../controllers/DoctorController/DepartMentController"
import { addapController, GetaddapByPatientController } from "../controllers/PatientController/BookAppointment"
import { getAppointmentData } from "../controllers/AdminController/AppointmentController"
export const route = Router()

//public routes
route.post("/login", userLoginController)
route.post("/register", userRegisterController)
route.post('/forget-password', forgetPassword)
route.post('/reset-password', resetPassword)

//admin routes
route.get('/admin/patients', authUser, getPatients)
route.get('/admin/doctors', authUser, getDoctors)
route.get('/admin/appointments', authUser, getAppointmentData)


route.get('/admin/departments', authUser, getDepartments)
route.post('/admin-add-department', authUser, addDepartmentController)
route.delete('/admin-delete-department', authUser, delDepartment)


// doctor routes 
route.get('/get-doctor-by-departmentId', authUser, getDoctorBydepartmentIdController);
route.get('/get-appointment-by-doctor', authUser, GetaddapByDoctorController);

// patient routes 

// route.post('/doctor-appointment-book', authUser, bookAppointmentController);
route.post('/doctor-appointment-book', addapController);
route.get('/get-appointment-by-patient', authUser, GetaddapByPatientController);