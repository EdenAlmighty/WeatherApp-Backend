import 'dotenv/config'
import http from 'http'
import express from 'express'
import cors from 'cors'
import path from 'path';

import { fileURLToPath } from 'url'
import { weatherRoutes } from './api/weather/routes.js'
import { logger } from './services/logger.service.js'

logger.info('server.js loaded...')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(express.static('public'))
app.set('trust proxy', true)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
    console.log('__dirname: ', __dirname)
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:5174',
            'http://localhost:5174',
            'http://127.0.0.1:8080',
            'http://localhost:8080',
        ],
        credentials: true
    }
    app.use(cors(corsOptions))
}

app.use('/api/weather', weatherRoutes)

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030

server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})