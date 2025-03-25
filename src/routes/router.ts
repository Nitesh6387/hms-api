import { Router } from "express"
export const route=Router()

// user routes

route.get('/',(req:any,res:any)=>{
    res.send("ok")
})