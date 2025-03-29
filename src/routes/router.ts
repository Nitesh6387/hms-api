import { Router } from "express"
import { userLoginController } from "../controllers/common/loginFunctionController"
export const route = Router()

// user routes

route.get('/', userLoginController)