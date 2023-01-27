export const airContent = [
    {
        index: 1,
        icon: 'bi-shield-check',
        category: 'Good',
        color: '#acd06b',
        recommendation:
            'Air quality is satisfactory and poses little or no risk.'
    },
    {
        index: 2,
        icon: 'bi-shield-exclamation',
        category: 'Moderate',
        color: '#f7d26b',
        recommendation:
            'Sensitive individuals should avoid outdoor activity'
            + ' as they may experience respiratory symptoms.'
    },
    {
        index: 3,
        icon: 'bi-shield-exclamation',
        category: 'Unhealthy for sensitive groups',
        color: '#fb985d',
        recommendation:
            'General public and sensitive individuals in particular are at risk'
            + ' to experience irritation and respiratory problems.'
    },
    {
        index: 4,
        icon: 'bi-shield-x',
        category: 'Unhealthy',
        color: '#f5666c',
        recommendation:
            'Increase likelihood or adverse effects and aggravation'
            + ' to the heart and lungs among general public.'
    },
    {
        index: 5,
        icon: 'bi-shield-x',
        category: 'Very Unhealthy',
        color: '#a27eb6',
        recommendation:
            'General public will be noticeably affected.'
            + " Sensitive groups should restrict outdoor activities."
    }
]

export function getAirQuality(lat, lon, key) {
    return fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`)
        .then(async (res) => await res.json())
        .then(data => {
            console.log(data);
            const { list: [{ components, main }] } = data;
            return {
                airIndex: main.aqi,
                pm25: components.pm2_5
            }
        })
}