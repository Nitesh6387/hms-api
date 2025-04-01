import { Router } from "express"
import { getDoctors, getPatients, userLoginController, userRegisterController } from "../controllers/common/loginFunctionController"
import { authUser } from "../middleware/verifyToken"
export const route = Router()

route.post("/login",userLoginController)
route.post("/register",userRegisterController)


//admin route

route.get('/patients',authUser,getPatients)
route.get('/doctors',authUser,getDoctors)