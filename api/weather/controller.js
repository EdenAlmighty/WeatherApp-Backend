import { weatherService } from './service.js'

export async function query(req, res) {
    try {
        const searchValue = req.query.q
        const cities = await weatherService.getCities(searchValue)
        res.send(cities)
    } catch (err) {
        console.error('Failed to get city suggestions:', error)
        res.status(500).send({ error: 'Failed to get city suggestions' })
    }
}

export async function getByCity(req, res) {
    try {
        const cityName = req.query.q
        const weatherData = await weatherService.query(cityName)
        res.send(weatherData)
    } catch (err) {
        console.error('Failed to get weather data:', error)
        res.status(500).send({ error: 'Failed to get weather data' })
    }
}


export async function getCities(req, res) {
    try {
        const searchValue = req.query.q
        const cities = await weatherService.getCities(searchValue)
        res.send(cities)
    } catch (err) {
        console.error('Failed to get city search suggestions:', err)
        res.status(500).send({ err: 'Failed to get city search suggestions' })
    }
}


export async function getCityByIp(req, res) {
    try {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '82.187.114.94'
        console.log('ip: ', ip);
        
        const weatherData = await weatherService.getCityByIp(ip)
        res.send(weatherData)
    } catch (err) {
        console.error('Failed to get city search suggestions:', err)
        res.status(500).send({ err: 'Failed to get city search suggestions' })
    }
}