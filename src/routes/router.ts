import { Router } from "express";
import { forgetPassword, getDoctors, getPatients, resetPassword, userLoginController, userRegisterController } from "../controllers/common/loginFunctionController";
import { authUser } from "../middleware/verifyToken";
import { addDepartmentController, delDepartment, getDepartments, updateDepartmentController } from "../controllers/AdminController/DepartmentController";
import { GetaddapByDoctorController, getDoctorBydepartmentIdController } from "../controllers/DoctorController/DepartMentController";
import { addapController, DeleteAppointmentByIdController, GetaddapByPatientController } from "../controllers/PatientController/BookAppointment";
import { adminGetAppointmentData, getAppointmentData, getAppointmentByIdController, updateAppointmentStatusController,updateAppointmentController } from "../controllers/AdminController/AppointmentController";
import limiter from "../middleware/limitRate";
import { removePatientById, updatePatientByAdminController, activatePatientController } from "../controllers/AdminController/PatientController";
import { addDoctorController, deleteDoctorController, getSingleDoctorController, updateDoctorController } from "../controllers/AdminController/DoctorController";
import { getDashboardStatsController } from "../controllers/AdminController/StatsController";
import { getDoctorProfileController, updateDoctorProfileController, updateAvailabilityController } from "../controllers/DoctorController/ProfileController";
import { getDoctorAppointmentsController, getDoctorAppointmentByIdController, updateAppointmentStatusByDoctorController } from "../controllers/DoctorController/AppointmentController";
import { getPatientProfileController, updatePatientProfileController, changePatientPasswordController } from "../controllers/PatientController/ProfileController";
import { getPatientAppointmentByIdController, cancelAppointmentController, rescheduleAppointmentController } from "../controllers/PatientController/AppointmentController";

export const route = Router();

// PUBLIC ROUTES
route.post("/login", limiter, userLoginController);
route.post("/register", userRegisterController);
route.post('/forget-password', forgetPassword);
route.post('/reset-password', resetPassword);
route.get('/departments', getDepartments); // public

// ADMIN ROUTES (all require auth)
route.get('/admin/patients', authUser, getPatients);
route.delete('/admin/removePatient/:id', authUser, removePatientById);
route.put('/admin/patient/:id', authUser, updatePatientByAdminController);
route.patch('/admin/patient/:id/activate', authUser, activatePatientController);

route.get('/admin/doctors', authUser, getDoctors);
route.post('/admin/doctor', authUser, addDoctorController);
route.put('/admin/doctor/:id', authUser, updateDoctorController);
route.delete('/admin/doctor/:id', authUser, deleteDoctorController);
route.get('/admin/doctor/:id', authUser, getSingleDoctorController);

route.get('/admin/appointments', authUser, getAppointmentData);  // without joining
route.get('/admin/getappointmentdata', authUser, adminGetAppointmentData); // with joining & filters
route.get('/admin/appointment/:id', authUser, getAppointmentByIdController);
route.put('/admin/appointment/:id', authUser, updateAppointmentController);
route.patch('/admin/appointment/:id/status', authUser, updateAppointmentStatusController);

route.get('/admin/departments', authUser, getDepartments);
route.post('/admin-add-department', authUser, addDepartmentController);
route.put('/admin/department/:id', authUser, updateDepartmentController);
route.delete('/admin-delete-department', authUser, delDepartment);

route.get('/admin/stats', authUser, getDashboardStatsController);

// DOCTOR ROUTES
route.get('/get-doctor-by-departmentId', authUser, getDoctorBydepartmentIdController);
route.get('/get-appointment-by-doctorId/:doctorId', authUser, GetaddapByDoctorController);

// Doctor profile & appointments (require auth)
route.get('/doctor/profile', authUser, getDoctorProfileController);
route.put('/doctor/profile', authUser, updateDoctorProfileController);
route.put('/doctor/availability', authUser, updateAvailabilityController);
route.get('/doctor/appointments', authUser, getDoctorAppointmentsController);
route.get('/doctor/appointment/:id', authUser, getDoctorAppointmentByIdController);
route.patch('/doctor/appointment/:id/status', authUser, updateAppointmentStatusByDoctorController);

// PATIENT ROUTES
route.post('/doctor-appointment-book', authUser, addapController); // fixed: added auth
route.get('/get-appointment-by-patientId', authUser, GetaddapByPatientController);
route.delete('/delete-appointment', authUser, DeleteAppointmentByIdController);

route.get('/patient/profile', authUser, getPatientProfileController);
route.put('/patient/profile', authUser, updatePatientProfileController);
route.put('/patient/change-password', authUser, changePatientPasswordController);
route.get('/patient/appointment/:id', authUser, getPatientAppointmentByIdController);
route.patch('/patient/appointment/:id/cancel', authUser, cancelAppointmentController);
route.put('/patient/appointment/:id/reschedule', authUser, rescheduleAppointmentController);