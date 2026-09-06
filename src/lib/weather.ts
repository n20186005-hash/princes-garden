/**
 * 天气数据获取（服务端专用）
 * 数据源仅用于为非营利科普页面展示实时天气与出行建议，
 * 页面文案中不展示任何数据源/技术细节。
 */

export type WeatherCategory =
  | 'clear'
  | 'partly'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'rainheavy'
  | 'snow'
  | 'thunder';

export interface CurrentWeather {
  /** ISO 时间（Europe/Sofia） */
  time: string;
  temp: number;
  feelsLike: number;
  /** 相对湿度 0-100，缺省为 null */
  humidity: number | null;
  windKmh: number;
  isDay: number;
  code: number;
}

export interface DailyWeather {
  /** YYYY-MM-DD（Europe/Sofia 时区） */
  date: string;
  code: number;
  tMax: number;
  tMin: number;
  /** 0-100，缺省为 null */
  precipProb: number | null;
  /** 0+，缺省为 null */
  uv: number | null;
}

export interface WeatherData {
  /** 服务器本次生成时间（ISO） */
  updatedAt: string;
  current: CurrentWeather;
  daily: DailyWeather[];
}

const API_BASE = 'https://api.open-meteo.com/v1/forecast';

/** 缓存时长（秒）：与首页 ISR 保持一致 */
export const WEATHER_REVALIDATE = 900;

export function categoryOf(code: number): WeatherCategory {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2) return 'partly';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code === 61 || code === 63 || code === 80 || code === 81) return 'rain';
  if (code === 65 || code === 82) return 'rainheavy';
  if (code >= 71 && code <= 77) return 'snow';
  if (code === 85 || code === 86) return 'snow';
  if (code >= 95) return 'thunder';
  return 'cloudy';
}

export function iconOf(category: WeatherCategory): string {
  switch (category) {
    case 'clear':
      return '☀️';
    case 'partly':
      return '⛅';
    case 'cloudy':
      return '☁️';
    case 'fog':
      return '🌫️';
    case 'drizzle':
      return '🌦️';
    case 'rain':
      return '🌧️';
    case 'rainheavy':
      return '🌧️';
    case 'snow':
      return '🌨️';
    case 'thunder':
      return '⛈️';
    default:
      return '☁️';
  }
}

export function windForce(kmh: number): 'calm' | 'breeze' | 'fresh' | 'strong' | 'gale' {
  if (kmh < 12) return 'calm';
  if (kmh < 29) return 'breeze';
  if (kmh < 39) return 'fresh';
  if (kmh < 50) return 'strong';
  return 'gale';
}

export async function fetchWeather(): Promise<WeatherData | null> {
  const params = new URLSearchParams({
    latitude: '42.690128',
    longitude: '23.3337855',
    timezone: 'Europe/Sofia',
    forecast_days: '7',
    wind_speed_unit: 'kmh',
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'is_day',
      'weather_code',
      'wind_speed_10m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'uv_index_max',
    ].join(','),
  });

  try {
    const res = await fetch(`${API_BASE}?${params.toString()}`, {
      cache: 'force-cache',
      next: { revalidate: WEATHER_REVALIDATE },
      headers: {
        accept: 'application/json',
        'user-agent': 'PrinceGardenGuide/1.0',
      },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      current?: {
        time?: string;
        temperature_2m?: number;
        apparent_temperature?: number;
        relative_humidity_2m?: number;
        is_day?: number;
        weather_code?: number;
        wind_speed_10m?: number;
      };
      daily?: {
        time?: string[];
        weather_code?: number[];
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        precipitation_probability_max?: (number | null)[];
        uv_index_max?: (number | null)[];
      };
    };

    const cur = json.current;
    const day = json.daily;
    if (!cur || !day || !Array.isArray(day.time) || day.time.length === 0) return null;

    const current: CurrentWeather = {
      time: cur.time ?? '',
      temp: Math.round(cur.temperature_2m ?? 0),
      feelsLike: Math.round(cur.apparent_temperature ?? cur.temperature_2m ?? 0),
      humidity:
        typeof cur.relative_humidity_2m === 'number'
          ? Math.round(cur.relative_humidity_2m)
          : null,
      windKmh: Math.round(cur.wind_speed_10m ?? 0),
      isDay: cur.is_day ?? 1,
      code: cur.weather_code ?? 3,
    };

    const daily: DailyWeather[] = day.time.map((date, i) => ({
      date,
      code: day.weather_code?.[i] ?? 3,
      tMax: Math.round(day.temperature_2m_max?.[i] ?? 0),
      tMin: Math.round(day.temperature_2m_min?.[i] ?? 0),
      precipProb:
        typeof day.precipitation_probability_max?.[i] === 'number'
          ? day.precipitation_probability_max![i] as number
          : null,
      uv: typeof day.uv_index_max?.[i] === 'number' ? day.uv_index_max![i] as number : null,
    }));

    return {
      updatedAt: new Date().toISOString(),
      current,
      daily,
    };
  } catch {
    return null;
  }
}
