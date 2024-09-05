const cache = {}
const CACHE_DURATION = 5 * 60 * 1000

export function checkCache(key) {
    const cached = cache[key]
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        return cached.data
    }
    return null
}

export function setCache(key, data) {
    cache[key] = {
        data,
        timestamp: Date.now()
    }
}
