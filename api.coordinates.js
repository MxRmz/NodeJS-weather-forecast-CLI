import { getKeyValue, TOKEN_DICTIONARY } from "./storage.service.js"
import https from 'https';
import axios from "axios";

const getCoordinates = async (city, token) => {
    const { data } = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
        params: {
            q: city,
            appid: token 
        }
    });
    return data
}

export { getCoordinates };