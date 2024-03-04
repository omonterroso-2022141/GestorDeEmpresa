import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'

import adminRouter from '../src/admin/admin.routes.js'
import companyRouter from '../src/company/company.routes.js'


let app = express()
config()
let port = process.env.PORT || 3600


app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use('/admin', adminRouter)
app.use('/company', companyRouter)



export const initServerd = ()=>{
    app.listen(port)
    console.log(`Serverd HTTP running in port : ${port}`);
}