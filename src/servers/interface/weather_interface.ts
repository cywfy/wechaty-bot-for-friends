export interface weatherAir {
    aqi: number,
    aqi_level: number,
    co: string,
    no2: string,
    o3: string,
    pm10: string,
    aqi_name: string
    ['pm2.5']: string,
    so2: string,
    update_time: string
}

export interface weatherRise {
    sunrise: string,
    sunset: string,
    time: string
}

export interface AirQuality {
    air: weatherAir,
    rise: {
        [propName: number]: weatherRise
    }
}

export interface weather_observer {
    degree: string,
    humidity: string,
    precipitation: string,
    pressure: string,
    update_time: string,
    weather: string,
    weather_code: string,
    weather_short: string,
    wind_direction: string,
    wind_power: string
}

export interface Weather {
    alarm?: object,
    forecast_1h: {
        [propName: number]: weather_forecast1_detail
    },
    forecast_24h:{
        [propName: number]: weather_forecast24_detail
    },
    index: weather_index,
    limit: {
        tail_number: string,
        time: string
    },
    observe: weather_observer,
    rise: {
        [propName: number]: weatherRise
    },
    tips: {
        observe: {
            [propName: number]: string
        }
    }
}

export interface weather_forecast1_detail {
    degree: string,
    update_time: string,
    weather: string,
    weather_code: string,
    weather_short: string,
    wind_direction: string,
    wind_power: string
}

export interface weather_forecast24_detail {
    day_weather: string,
    day_weather_code: string,
    day_weather_short: string,
    day_wind_direction: string,
    day_wind_direction_code: string,
    day_wind_power: string,
    day_wind_power_code: string,
    max_degree: string,
    min_degree: string,
    night_weather: string,
    night_weather_code: string,
    night_weather_short: string,
    night_wind_direction: string,
    night_wind_direction_code: string,
    night_wind_power: string,
    night_wind_power_code: string,
    time: string
}

export interface weather_index {
    [prppName: string]: weather_index_detail
}

export interface weather_index_detail {
    detail: string,
    info: string,
    name: string
}

export interface weatherOptions {
    province: string,
    city: string,
    county: string,
    weather_type: string,
    [propName: string]: string
}