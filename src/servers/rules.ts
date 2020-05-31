import { Message } from 'wechaty';
import { getCity, getWeather } from '.';
import { AirQuality, Weather, weather_index, weather_index_detail } from './interface';

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

const forecastNow = (weather_res: Weather):string => {
    const {forecast_1h, forecast_24h, observe, rise, index, tips} = weather_res;
    const update_time = resetUpdateTime(forecast_1h[0].update_time);
    const keys: Array<weather_index_detail> = Object.keys(index).map((v, k) => index[v]);
    return `
今天：${forecast_24h[1].time}
日出日落：${rise[0].sunrise} ~ ${rise[1].sunset}
当前气温：${forecast_1h[0].degree}℃ ${forecast_1h[0].weather}
当前湿度：${observe.humidity}%
当前气压：${observe.pressure} hPa
当前风向：${forecast_1h[0].wind_direction} 
当前风力：${forecast_1h[0].wind_power}级
最高气温：${forecast_24h[1].max_degree}℃
最低气温：${forecast_24h[1].min_degree}℃

明天：${forecast_24h[2].time}
最高气温：${forecast_24h[2].max_degree}℃
最低气温：${forecast_24h[2].min_degree}℃
早间风向：${forecast_24h[2].day_wind_direction} 
早间风力：${forecast_24h[2].day_wind_power}级
晚间风向：${forecast_24h[2].night_wind_direction} 
晚间风力：${forecast_24h[2].night_wind_power}级

后天：${forecast_24h[3].time}
最高气温：${forecast_24h[3].max_degree}℃
最低气温：${forecast_24h[3].min_degree}℃
早间风向：${forecast_24h[3].day_wind_direction} 
早间风力：${forecast_24h[3].day_wind_power}级
晚间风向：${forecast_24h[3].night_wind_direction} 
晚间风力：${forecast_24h[3].night_wind_power}级
tips: ${tips.observe[Math.floor(Math.random() * 2)]}
1. ${randomDetail(keys)}
2. ${randomDetail(keys)}
3. ${randomDetail(keys)}kon
${!update_time ? null : `更新于：${update_time}`}
信息来源：腾讯天气`;
}

const parse24hWeather = (weather_res: Weather):string => {
    // const {forecast_1h, forecast_24h, observe, tips, rise } = weather_res;
    const currectWeather = forecastNow(weather_res);
    return currectWeather;
}

export const checkText = async (msg: Message) => {
    if (/功能/.test(msg.text())) {
        // await msg.say()
    }
    if(/天气/.test(msg.text().trim())) {
        let text = msg.text().trim();
        text = text.replace(/天气\s*/, '');
        const city: string = await getCity(encodeURI(text));
        if (!city) {
            await msg.say('未匹配相关城市名,请重新输入'); 
            return;
        }
        const [a,b, c] = city.split(', ');
        const encodeCity = {
            province: encodeURI(a),
            city: encodeURI(b),
            county: c ? encodeURI(c) : ''
        }
        const air_quality: AirQuality = await getWeather({weather_type: 'air|rise', ...encodeCity});
        if (!air_quality) {
            await msg.say('获取空气质量失败');   
        }
        const weather_res = await getWeather({...encodeCity, weather_type: 'observe|forecast_1h|forecast_24h|index|alarm|limit|tips|rise'});
        if (!weather_res) {
            await msg.say('获取天气失败，请稍后重试');
            return
        }
        await msg.say(`${parseAirQuality(city, air_quality)}${parse24hWeather(weather_res)}`);
    }
}

