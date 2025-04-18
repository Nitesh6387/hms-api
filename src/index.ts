import express from 'express'
import cors from 'cors'
import 'reflect-metadata'
import dotenv from 'dotenv'
import expressFileUpload from 'express-fileupload'
import { route } from './routes/router'
import { AppDataSource } from './DbConfig'
import path from 'path'

dotenv.config()
const app = express()
AppDataSource.initialize().then(() => {
    console.log(`DataSource initialized !`);
}).catch((err: any) => {
    console.log(err);
})
app.use(express.json())
app.use(cors())
app.use(expressFileUpload())
// app.use('/static', express.static('./uploads'));
app.use('/static', express.static(path.join(__dirname, 'uploads')));
app.use('/v1/api', route)
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on the port:${process.env.PORT}`);
})