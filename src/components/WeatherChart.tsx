import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Droplets, Thermometer } from 'lucide-react';
import type { WeatherData } from '../types';

interface WeatherChartProps {
  data: WeatherData[];
  className?: string;
}

export default function WeatherChart({ data, className = '' }: WeatherChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'humidity' | 'rainfall'>('temperature');

  const chartData = data.map(item => ({
    date: new Date(item.forecast_date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    temperature: item.temperature,
    humidity: item.humidity,
    rainfall: item.rainfall
  }));

  const metrics = [
    { key: 'temperature', label: 'Temperature', icon: Thermometer, color: '#ef4444', unit: '°C' },
    { key: 'humidity', label: 'Humidity', icon: Droplets, color: '#3b82f6', unit: '%' },
    { key: 'rainfall', label: 'Rainfall', icon: TrendingUp, color: '#10b981', unit: 'mm' }
  ];

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">7-Day Weather Forecast</h3>
        <div className="flex space-x-2">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <motion.button
                key={metric.key}
                onClick={() => setSelectedMetric(metric.key as any)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === metric.key
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={14} />
                <span>{metric.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            className="text-gray-600"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            className="text-gray-600"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#f8fafc', 
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: any, name: string) => [
              `${value.toFixed(1)} ${metrics.find(m => m.key === selectedMetric)?.unit}`,
              metrics.find(m => m.key === selectedMetric)?.label
            ]}
          />
          {selectedMetric && (
            <Line 
            type="monotone" 
              dataKey={selectedMetric}
              stroke={metrics.find(m => m.key === selectedMetric)?.color}
            strokeWidth={2}
              dot={{ fill: metrics.find(m => m.key === selectedMetric)?.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: metrics.find(m => m.key === selectedMetric)?.color, strokeWidth: 2 }}
          />
          )}
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const currentValue = chartData[0]?.[metric.key] || 0;
          const previousValue = chartData[1]?.[metric.key] || 0;
          const trend = currentValue > previousValue ? 'up' : currentValue < previousValue ? 'down' : 'stable';
          
          return (
            <div key={metric.key} className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Icon size={16} style={{ color: metric.color }} />
                <span className="text-sm font-medium text-gray-700">{metric.label}</span>
              </div>
              <p className="text-lg font-bold" style={{ color: metric.color }}>
                {currentValue.toFixed(1)}{metric.unit}
              </p>
              <p className={`text-xs ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} vs yesterday
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}