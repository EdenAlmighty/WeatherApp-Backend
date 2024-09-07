import axios from 'axios'
import { checkCache, setCache } from '../../middleware/cache.middleware.js'

const WEATHER_API_URL = 'http://api.weatherapi.com/v1'

export const weatherService = {
    query,
    getByCity,
    getCities,
    getCityByIp
}

async function query(city) {
    const cityUpper = city.toUpperCase()

    // Check cache before attempting API call
    const cachedData = checkCache(cityUpper)
    if (cachedData) {
        console.log('From cache')
        return formatWeatherData(cachedData)
    }

    try {
        const res = await axios.get(`${WEATHER_API_URL}/forecast.json`, {
            params: {
                key: process.env.WEATHER_API_KEY,
                q: city,
                days: 1,
                aqi: 'no',
                alerts: 'no'
            }
        })

        const weatherData = res.data
        setCache(cityUpper, weatherData)

        return formatWeatherData(weatherData)
    } catch (err) {
        console.error('Failed to get weather data:', err)
        throw err
    }
}

function formatWeatherData(data) {
    console.log({data});
    
    const {
        location: {
            name: cityName,
            country,
            localtime_epoch: localTime} = {},

        current: {
            temp_c: temperature,
            humidity,
            precip_mm: precipitation,
            condition: { text: description} = {},
            wind_kph: windSpeed } = {},

        forecast: { forecastday = [] } = {}
    } = data || {}

    const hourlyForecast = forecastday.flatMap(day =>
        day.hour.map(hour => ({
            time: hour.time_epoch,
            temp: hour.temp_c
        }))
    )

    return {
        cityName,
        country,
        localTime,
        temperature,
        description,
        precipitation,
        humidity,
        windSpeed,
        forecast: hourlyForecast
    }
}

async function getByCity(cityName) {
    const cityUpper = cityName.toUpperCase()

    const cachedData = checkCache(cityUpper)
    if (cachedData) {
        return formatWeatherData(cachedData)
    }

    return await query(cityName)
}

async function getCities(query) {
    try {
        const res = await axios.get(`${WEATHER_API_URL}/search.json`, {
            params: {
                key: process.env.WEATHER_API_KEY,
                q: query
            }
        })

        return res.data.map(city => ({
            name: city.name,
            country: city.country
        }))
    } catch (err) {
        console.error('Failed to get city search suggestions:', err)
        throw err
    }
}

async function getCityByIp(ip) {
    try {
        const res = await axios.get(`${WEATHER_API_URL}/current.json`, {
            params: {
                key: process.env.WEATHER_API_KEY,
                q: ip,
                aqi: 'no',
            }
        })
        return res.data
    } catch (err) {
        console.error('Failed to get city data by IP:', err)
        throw err
    }
}
