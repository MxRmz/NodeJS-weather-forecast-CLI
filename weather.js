import { getArgs } from './helpers/args.js'
import { getWeather } from './api.service.js'
import { printHelp, printError, printSuccess } from './log.service.js'
import { saveKeyValue, TOKEN_DICTIONARY } from './storage.service.js'

const saveToken = async (token) => {
    if (!token.length) {
        printError('Не передан токен')
        return
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.token, token);
        printSuccess('Токен сохранен')
    } catch (e) {
        printError(e.message);
    }
}

const saveCity = async (city) => {
    if (!city.length) {
        printError('Не передан город')
        return
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.city, city);
        printSuccess('Город сохранен')
    } catch (e) {
        printError(e.message);
    }
}

const getForecast = async () => {
    try {
        const weather = await getWeather(process.env.CITY);
        console.log(
        `
        Прогноз погоды для города ${weather.name}
        Сегодня ${weather.weather[0].description}.
        Средняя темперутура воздуха ${weather.main.temp} градуса по цельсию,
        Ощущается как ${weather.main.feels_like} градуса по цельсию,
        Давление составит ${weather.main.pressure}мм ртутного столбца,
        Скорость ветра ${weather.wind.speed}м/с,     
        `);
    } catch (e) {
        if (e.response?.status == 404) {
            printError('Неверно указан город')
        } else if (e.response?.status == 401) {
            printError('Неверно указан token')
        } else {
            printError(e.message)
        }
    }
}

const initCLI = () => {
    const args = getArgs(process.argv)
    if (args.h) {
        printHelp();
    }
    if (args.s) {
        return saveCity(args.s)
    }
    if (args.t) {
        return saveToken(args.t)
    }
    getForecast();
}

initCLI()