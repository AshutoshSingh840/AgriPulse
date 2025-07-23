import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Send, Bell, Cloud, Leaf } from 'lucide-react';
import { useRealtimeWeather, useRealtimeAlerts } from '../hooks/useRealtime';
import { realtimeManager } from '../lib/realtime';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function RealtimeDemo() {
  const { user } = useAuth();
  const { alerts } = useRealtimeAlerts();
  const [testMessage, setTestMessage] = useState('');

  const sendTestWeatherUpdate = async () => {
    try {
      const weatherData = {
        location: user?.location || 'Test Location',
        temperature: 25 + Math.random() * 10,
        humidity: 60 + Math.random() * 20,
        rainfall: Math.random() * 5,
        wind_speed: 5 + Math.random() * 10,
        forecast_date: new Date().toISOString(),
        description: 'Real-time test update',
        alerts: ['Test weather alert from real-time system']
      };

      await realtimeManager.sendWeatherUpdate(weatherData);
      toast.success('Weather update sent via real-time!');
    } catch (error) {
      toast.error('Failed to send weather update');
    }
  };

  const sendTestAlert = async () => {
    if (!user?.id) return;

    try {
      const alertData = {
        user_id: user.id,
        type: 'weather',
        severity: 'medium',
        title: 'Real-time Test Alert',
        description: 'This is a test alert sent through the real-time system.',
        action_required: 'No action needed - this is just a test',
        is_read: false
      };

      await realtimeManager.sendAlert(alertData);
      toast.success('Alert sent via real-time!');
    } catch (error) {
      toast.error('Failed to send alert');
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <Zap className="text-yellow-500" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Real-time Demo</h3>
      </div>

      <div className="space-y-4">
        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            onClick={sendTestWeatherUpdate}
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Cloud size={20} />
            <span>Send Weather Update</span>
          </motion.button>

          <motion.button
            onClick={sendTestAlert}
            className="flex items-center justify-center space-x-2 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Bell size={20} />
            <span>Send Test Alert</span>
          </motion.button>
        </div>

        {/* Real-time Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 font-medium">Real-time Connection Active</span>
          </div>
          <p className="text-green-700 text-sm">
            Connected to Supabase real-time. Changes will appear instantly across all connected clients.
          </p>
        </div>

        {/* Recent Alerts */}
        {alerts.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">Recent Real-time Alerts</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="bg-white border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{alert.title}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">How Real-time Works</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Click the buttons above to send real-time updates</li>
            <li>• Open multiple browser tabs to see instant synchronization</li>
            <li>• All connected users will receive updates immediately</li>
            <li>• Data is automatically stored in your local Supabase database</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}