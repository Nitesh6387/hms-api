import express from 'express'
import 'reflect-metadata'
import dotenv from 'dotenv'
import { route } from './routes/router'
dotenv.config()
const app=express()
app.use('/v1',route)
const PORT=process.env.PORT || 9000;
app.listen(PORT,()=>{
    console.log(`Server is running on the port:${process.env.PORT}`);
})