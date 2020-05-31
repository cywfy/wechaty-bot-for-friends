import { http } from '../util';
import { weatherOptions, AirQuality, Weather } from './interface';

// 腾讯天气接口
const TX_WEATHER_API = 'https://wis.qq.com/weather/common?source=pc';
// 城市名接口
const TX_WEATHER_SEARCH = 'https://wis.qq.com/city/like?source=pc&city=';

// weather_type=observe|forecast_1h|forecast_24h|index|alarm|limit|tips|rise&

const getParams = (url:string, params: weatherOptions):string => {
    let str:string;
    const keys = Object.keys(params);
    if (!keys) {return url;}
    str = keys.reduce((total, item:string) => (params[item] && (total += `${item}=${params[item]}&`), total), `${url}&`);
    return str;
};

export const getWeather = (options:weatherOptions):Promise<AirQuality & Weather> => {
    return new Promise((resolve, reject) => {
        http.get(getParams(TX_WEATHER_API, options)).then(res => {
            const {status, data} = res.data;
            if (status === 200) {
                resolve(data);
            }
        }).catch(err => reject(''));
    });
};

export const getCity = (city:string):Promise<string> => {
    return new Promise((resolve, reject) => {
        http.get(`${TX_WEATHER_SEARCH}${city}`).then(res => {
            const {data, status} = res.data;
            if (status === 200) {
                const r:string = Object.values(data)[0] as string;
                resolve(r);
            }
        }).catch(err => reject(''));
    });
};