import express from 'express'
import { log } from '../../middleware/logger.middleware.js'
import { query } from './controller.js'

export const weatherRoutes = express.Router()

weatherRoutes.get('/', log, query)

