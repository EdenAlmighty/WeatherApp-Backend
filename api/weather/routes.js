import express from 'express'
import { log } from '../../middleware/logger.middleware.js'
import { getByCity, query } from './controller.js'

export const weatherRoutes = express.Router()

weatherRoutes.get('/search', log, query)
weatherRoutes.get('/forecast', log, getByCity)
