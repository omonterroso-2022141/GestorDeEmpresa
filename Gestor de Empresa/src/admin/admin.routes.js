import { Router } from 'express'
import {register, login, update } from './admin.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'


const api = Router()

api.post('/register', register)
api.post('/login', login)
api.put('/update/:id', [validateJwt], update)

export default api