import { logger } from "../../services/logger.service.js"

export async function query(req, res) {
    try {
        res.send('code query')
    } catch (err) {
        logger.error('Failed to get :', err)
        res.status(500).send({ err: 'Failed to get' })
    }
}