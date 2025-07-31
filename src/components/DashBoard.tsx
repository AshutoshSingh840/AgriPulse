import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, MapPin, Smartphone, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import WeatherCard from './WeatherCard';
import WeatherChart from './WeatherChart';
import CropRecommendationCard from './Crop-Recommendation-Card';
import VoiceInterface from './VoiceInterface';
import AlertsPanel from './AlertsPanel';
import FieldReportModal from './FieldReportModal';
import { getWeatherData, getWeatherForecast } from '../lib/weather-api';
import { getCropRecommendations } from '../lib/crop-advisor';
import type { WeatherData, CropRecommendation } from '../types';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<WeatherData[]>([]);
  const [cropRecommendations, setCropRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFieldReport, setShowFieldReport] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load weather data
      const weatherPromise = getWeatherData(user?.location || 'Default Location');
      const forecastPromise = getWeatherForecast(user?.location || 'Default Location');
      const cropsPromise = getCropRecommendations(
        user?.id || 'demo-user',
        user?.location || 'Default Location',
        'loamy',
        user?.farm_size || 2
      );

      const [weather, forecast, crops] = await Promise.all([
        weatherPromise,
        forecastPromise,
        cropsPromise
      ]);

      setCurrentWeather(weather);
      setWeatherForecast(forecast);
      setCropRecommendations(crops);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command:', command);
    toast.success(`Voice command received: "${command}"`);
    
    // In a real app, this would process the command with NLP
    if (command.toLowerCase().includes('weather')) {
      loadDashboardData();
    }
  };

  const handleRefresh = () => {
    toast.promise(
      loadDashboardData(),
      {
        loading: 'Refreshing data...',
        success: 'Data refreshed successfully!',
        error: 'Failed to refresh data'
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw size={48} className="text-green-500 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-600">Loading your farming insights...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>{user?.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🌾</span>
                  <span>{user?.farm_size} acres</span>
                </div>
              </div>
            </div>
            <motion.button
              onClick={handleRefresh}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weather Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentWeather && (
                <WeatherCard weather={currentWeather} />
              )}
              <VoiceInterface onVoiceCommand={handleVoiceCommand} />
            </div>

            {/* Weather Chart */}
            {weatherForecast.length > 0 && (
              <WeatherChart data={weatherForecast} />
            )}

            {/* Crop Recommendations */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">AI Crop Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cropRecommendations.slice(0, 2).map((recommendation) => (
                  <CropRecommendationCard 
                    key={recommendation.id} 
                    recommendation={recommendation} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <AlertsPanel alerts={[]} />
            
            {/* SMS Feature */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">SMS Updates</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Smartphone className="text-green-500" size={20} />
                  <span className="text-sm text-gray-600">
                    Get daily weather & crop alerts via SMS
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="text-blue-500" size={20} />
                  <span className="text-sm text-gray-600">
                    Report field conditions by text
                  </span>
                </div>
                <motion.button 
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Enable SMS Alerts
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Field Report', emoji: '📝', color: 'bg-blue-100 text-blue-800', action: () => setShowFieldReport(true) },
                  { label: 'Log Harvest', emoji: '🌾', color: 'bg-green-100 text-green-800' },
                  { label: 'Market Price', emoji: '💰', color: 'bg-yellow-100 text-yellow-800' },
                  { label: 'Get Support', emoji: '🤝', color: 'bg-blue-100 text-blue-800' }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${action.color}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-lg mb-1">{action.emoji}</div>
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        
        <FieldReportModal
          isOpen={showFieldReport}
          onClose={() => setShowFieldReport(false)}
        />
      </div>
    </div>
  );
}