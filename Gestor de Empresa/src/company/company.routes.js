import { Router } from 'express'
import { addCompany,listCompany, updateCompany, deleteCompany, searchCompany, searchCompanyDate, searchCompanyCategory, generateExcel } from './company.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/addCompany', addCompany)
api.get('/listCompany', [validateJwt], listCompany)
api.put('/updateCompany/:id', [validateJwt], updateCompany)
api.delete('/deleteCompany/:id', [validateJwt], deleteCompany)
api.get('/searchCompany', [validateJwt], searchCompany)
api.get('/searchCompanyDate', [validateJwt], searchCompanyDate)
api.get('/searchCompanyCategory', [validateJwt], searchCompanyCategory)
api.get('/generateExcel', [validateJwt], generateExcel);


export default api
