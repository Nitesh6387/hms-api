import { Router } from "express"
import { forgetPassword, getDoctors, getPatients, resetPassword, userLoginController, userRegisterController } from "../controllers/common/loginFunctionController"
import { authUser } from "../middleware/verifyToken"
import { addDepartmentController } from "../controllers/AdminController/DepartmentController"
export const route = Router()

route.post("/login", userLoginController)
route.post("/register", userRegisterController)
route.post('/forget-password', forgetPassword)
route.post('/reset-password', resetPassword)

//admin route
route.post('/admin-add-department', addDepartmentController)


route.get('/admin/patients', authUser, getPatients)
route.get('/admin/doctors', authUser, getDoctors)