import axios from 'axios'

const WEATHER_API_URL = 'http://api.weatherapi.com/v1'
let runTimeCache = {}

export const weatherService = {
    query,
    getByCity,
    getCities
}

async function query(city) {
    const cityUpper = city.toUpperCase()
    console.log('cityUpper: ', cityUpper)

    if (runTimeCache[cityUpper]) {
        return formatWeatherData(runTimeCache[cityUpper])
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
        runTimeCache[cityUpper] = weatherData

        return formatWeatherData(weatherData)
    } catch (err) {
        console.error('Failed to get weather data:', err)
        throw err
    }
}

function formatWeatherData(data) {
    const {
        location: {
            name: cityName = 'Unknown City',
            country = 'Unknown Country',
            localtime_epoch: localTime = 0 } = {},

        current: {
            temp_c: temperature = 30,
            humidity = 30,
            precip_mm: precipitation = 0,
            condition: { text: description = 'rainy' } = {},
            wind_kph: windSpeed = 30 } = {},

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

    if (runTimeCache[cityUpper]) {
        return formatWeatherData(runTimeCache[cityUpper])
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