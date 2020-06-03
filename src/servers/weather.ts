import { http } from '../util';
import { weatherOptions, AirQuality, Weather, weather_index_detail } from './interface';
import { Message } from 'wechaty';
const bot_info = require('../../bot_info.json')

// 腾讯天气接口
const TX_WEATHER_API = 'https://wis.qq.com/weather/common?source=pc';
// 城市名接口
const TX_WEATHER_SEARCH = 'https://wis.qq.com/city/like?source=pc&city=';

const getParams = (url:string, params: weatherOptions):string => {
    let str:string;
    const keys = Object.keys(params);
    if (!keys) {return url;}
    str = keys.reduce((total, item:string) => (params[item] && (total += `${item}=${params[item]}&`), total), `${url}&`);
    return str;
};

const resetUpdateTime = (str: string):string => {
    const [a, b, c] = str.replace(/(\d{4})/g, '$1 ').split(' ');
    if (!a || !b || !c) return '';
    return `${a}年${b.replace(/(\d{2})/, '$1月')}日 ${c.replace(/(\d{2})/, '$1:')}`
}

const randomDetail = (keys: Array<weather_index_detail>):string => {
    return keys.splice(Math.floor(Math.random() * keys.length), 1)[0]?.detail
}

const parseAirQuality = (city:string, jsonText:AirQuality) => {
    const {air} = jsonText;
    const text = 
`城市：${city.replace(/,/, '')}
空气质量指数：${air.aqi} ${air.aqi_name} | PM2.5: ${air['pm2.5']}`;
// PM10: ${air.pm10}
// SO2: ${air.so2}
// NO2: ${air.no2}
// O3: ${air.o3}
// CO: ${air.co}
    return text;
}

// 当前气压：${observe.pressure} hPa
// 当前风向：${forecast_1h[0].wind_direction} 
// 当前风力：${forecast_1h[0].wind_power}级
const forecastNow = (weather_res: Weather):string => {
    const {forecast_1h, forecast_24h, observe, rise, index, tips} = weather_res;
    const update_time = resetUpdateTime(forecast_1h[0].update_time);
    const keys: Array<weather_index_detail> = Object.keys(index).map((v, k) => index[v]);
    return `
今天：${forecast_24h[1].time}
日出日落：${rise[0].sunrise} ~ ${rise[1].sunset}
当前温度：${forecast_1h[0].degree}℃  天气： ${forecast_1h[0].weather}
当前湿度：${observe.humidity}%
今日温度：${forecast_24h[1].min_degree}℃ ~ ${forecast_24h[1].max_degree}℃

明天：${forecast_24h[2].time}
早间天气：${forecast_24h[2].day_weather}
晚间天气：${forecast_24h[2].night_weather}
明天温度：${forecast_24h[2].min_degree}℃ ~ ${forecast_24h[2].max_degree}℃

后天：${forecast_24h[3].time}
早间天气：${forecast_24h[3].day_weather}
晚间天气：${forecast_24h[3].night_weather}
后天气温：${forecast_24h[3].min_degree}℃ ~ ${forecast_24h[3].max_degree}℃
tips: ${tips.observe[Math.floor(Math.random() * 2)]}
1. ${randomDetail(keys)}
2. ${randomDetail(keys)}
3. ${randomDetail(keys)}
${!update_time ? null : `更新于：${update_time}`}
信息来源：腾讯天气`;
}

const parse24hWeather = (weather_res: Weather):string => {
    const currectWeather = forecastNow(weather_res);
    return currectWeather;
}


const getWeather = (options:weatherOptions):Promise<AirQuality & Weather> => {
    return new Promise((resolve, reject) => {
        http.get(getParams(TX_WEATHER_API, options)).then(res => {
            const {status, data} = res.data;
            if (status === 200) {
                if (!Object.values(data).length) {
                    throw '';
                }
                resolve(data);
                console.log('获取天气成功');
            }
        }).catch(err => {
            console.log('获取天气失败');
            reject('');
        });
    });
};

const getCity = (city:string):Promise<Array<string>> => {
    return new Promise((resolve, reject) => {
        http.get(`${TX_WEATHER_SEARCH}${city}`).then(res => {
            const {data, status} = res.data;
            if (status === 200) {
                if (!Object.values(data).length) {
                    resolve(['']);
                    console.log('没有该城市名');
                }
                console.log('获取城市名成功');
                resolve(Object.values(data));
            }
        }).catch(err => {
            console.log('搜索城市名失败');
            reject('')
        });
    });
};

export const weatherServer = async (msg: Message) => {
    let text = msg.text().trim();
    const r = new RegExp(`@${bot_info.name}\\s*`);
    text = text.replace(r, '').replace(/天气\s*/, '');
    try {
        if (!text) {
            throw "请输入需要查看天气的城市名";
        }
        const city: Array<string> = await getCity(encodeURI(text));
        if (!city.length) {
            throw '未匹配相关城市名,请重新输入'
        }
        if (city.length > 1) {
            const word = city.reduce((t, v, c, arr) => (c === arr.length -1 ? t += v : t += `${v}\n`, t), '请选择如下城市中的一个查询天气(天气：xxxx)：\n');
            await msg.say(word);
            return
        }
        const [a,b, c] = city[0].split(', ');
        const encodeCity = {
            province: encodeURI(a),
            city: encodeURI(b),
            county: c ? encodeURI(c) : ''
        }
        const air_quality: AirQuality = await getWeather({weather_type: 'air|rise', ...encodeCity});
        if (!air_quality) {
            throw '获取空气质量失败';
        }
        const weather_res = await getWeather({...encodeCity, weather_type: 'observe|forecast_1h|forecast_24h|index|alarm|limit|tips|rise'});
        if (!weather_res) {
            throw '获取天气失败，请稍后重试'
        }
        await msg.say(`${parseAirQuality(city[0], air_quality)}${parse24hWeather(weather_res)}`);
        console.log('发送天气成功');
    } catch (error) {
        await msg.say(error);
    }
}