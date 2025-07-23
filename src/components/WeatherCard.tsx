import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind } from 'lucide-react';
import type { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData;
  className?: string;
}

export default function WeatherCard({ weather, className = '' }: WeatherCardProps) {
  const getWeatherIcon = (description: string) => {
    switch (description.toLowerCase()) {
      case 'sunny':
        return <Sun className="text-yellow-500" size={32} />;
      case 'partly cloudy':
        return <Cloud className="text-gray-500" size={32} />;
      case 'light rain':
      case 'thunderstorms':
        return <CloudRain className="text-blue-500" size={32} />;
      default:
        return <Cloud className="text-gray-500" size={32} />;
    }
  };

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Current Weather</h3>
        {getWeatherIcon(weather.description)}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Thermometer className="text-red-500" size={20} />
          <span className="text-gray-700">{weather.temperature.toFixed(1)}°C</span>
        </div>
        <div className="flex items-center space-x-2">
          <Droplets className="text-blue-500" size={20} />
          <span className="text-gray-700">{weather.humidity.toFixed(0)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <CloudRain className="text-blue-600" size={20} />
          <span className="text-gray-700">{weather.rainfall.toFixed(1)}mm</span>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="text-gray-600" size={20} />
          <span className="text-gray-700">{weather.wind_speed.toFixed(1)} km/h</span>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-sm text-gray-600 mb-2">Conditions</p>
        <p className="font-medium text-gray-800">{weather.description}</p>
      </div>
      
      {weather.alerts.length > 0 && (
        <motion.div 
          className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-medium text-red-800 mb-1">Weather Alert</p>
          {weather.alerts.map((alert, index) => (
            <p key={index} className="text-sm text-red-700">{alert}</p>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}