//import { HttpStatusCode } from "axios"
import { getKeyValue, TOKEN_DICTIONARY } from "./storage.service.js"
import https from 'https';
import { getCoordinates } from "./api.coordinates.js";
import axios from "axios";
import { printError } from "./log.service.js";

const getWeather = async () => {
    const token = process.env.TOKEN ?? await getKeyValue(TOKEN_DICTIONARY.token)
    const city = process.env.CITY ?? await getKeyValue(TOKEN_DICTIONARY.city)
    if (!token) {
        throw new Error('Не задан ключ АПИ. Задайте его через команду -t [API_KEY]')
    }
    
    try {
        const coordinates = await getCoordinates(city, token)
        if (coordinates.length == 0 || !coordinates) {
            printError('Не правильно указан город')
        } else {
           return await getWeatherFromApi(coordinates, token)
        }
        
    } catch (e) {
        console.log(e.response.status)
        if (e.response.status == 400) {
            printError('Не указан город')
        } else if (e.response?.status == 401) {
            printError('Неверно указан token')
        }
    }
}

const getWeatherFromApi = async (coordinates, token) => {
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
           lat: coordinates[0].lat,
           lon: coordinates[0].lon,
           appid: token,
           lang: 'ru',
           units: 'metric'
        }
    });
        return data
}
export { getWeather };