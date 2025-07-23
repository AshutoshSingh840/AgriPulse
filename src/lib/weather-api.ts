import type { WeatherData } from '../types';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo-key';

export async function getWeatherData(location: string): Promise<WeatherData> {
  try {
    // In a real app, this would call OpenWeatherMap or similar API
    // For demo purposes, we'll return mock data
    const mockData: WeatherData = {
      id: crypto.randomUUID(),
      location,
      temperature: 28 + Math.random() * 10,
      humidity: 65 + Math.random() * 20,
      rainfall: Math.random() * 10,
      wind_speed: 5 + Math.random() * 10,
      forecast_date: new Date().toISOString(),
      description: ['Sunny', 'Partly Cloudy', 'Light Rain', 'Overcast'][Math.floor(Math.random() * 4)],
      alerts: Math.random() > 0.7 ? ['Heavy rainfall expected in next 48 hours'] : []
    };
    
    return mockData;
  } catch (error) {
    console.error('Weather API error:', error);
    throw new Error('Failed to fetch weather data');
  }
}

export async function getWeatherForecast(location: string, days: number = 7): Promise<WeatherData[]> {
  const forecast: WeatherData[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    forecast.push({
      id: crypto.randomUUID(),
      location,
      temperature: 25 + Math.random() * 15,
      humidity: 60 + Math.random() * 25,
      rainfall: Math.random() * 15,
      wind_speed: 3 + Math.random() * 12,
      forecast_date: date.toISOString(),
      description: ['Sunny', 'Partly Cloudy', 'Light Rain', 'Overcast', 'Thunderstorms'][Math.floor(Math.random() * 5)],
      alerts: Math.random() > 0.8 
      ? [ ['Frost warning', 'Drought conditions'][Math.floor(Math.random() * 2)] ] 
      : []
    });
  }
  
  return forecast;
}