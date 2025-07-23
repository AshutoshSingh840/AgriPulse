import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Calendar, Droplets, Beaker, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import type { CropRecommendation } from '../types';
import CropPlanModal from './CropPlanModal';

interface CropRecommendationCardProps {
  recommendation: CropRecommendation;
  className?: string;
}

export default function CropRecommendationCard({ recommendation, className = '' }: CropRecommendationCardProps) {
  const [showPlanModal, setShowPlanModal] = useState(false);

  const getCropEmoji = (crop: string) => {
    switch (crop.toLowerCase()) {
      case 'corn': return '🌽';
      case 'rice': return '🌾';
      case 'wheat': return '🌾';
      case 'tomatoes': return '🍅';
      default: return '🌱';
    }
  };

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{getCropEmoji(recommendation.crop_type)}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 capitalize">
              {recommendation.crop_type}
            </h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-green-500" size={16} />
              <span className="text-sm text-gray-600">
                {recommendation.confidence_score.toFixed(0)}% confidence
              </span>
            </div>
          </div>
        </div>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Recommended
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="text-blue-500" size={16} />
          <div>
            <p className="text-xs text-gray-500">Planting Date</p>
            <p className="text-sm font-medium text-gray-800">
              {format(new Date(recommendation.planting_date), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Leaf className="text-green-500" size={16} />
          <div>
            <p className="text-xs text-gray-500">Expected Yield</p>
            <p className="text-sm font-medium text-gray-800">
              {recommendation.expected_yield.toFixed(0)} kg
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="text-blue-500" size={16} />
            <span className="text-sm font-medium text-gray-700">Irrigation Schedule</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {recommendation.irrigation_schedule.slice(0, 2).map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Beaker className="text-purple-500" size={16} />
            <span className="text-sm font-medium text-gray-700">Fertilizer Tips</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {recommendation.fertilizer_recommendations.slice(0, 2).map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <motion.button 
        onClick={() => setShowPlanModal(true)}
        className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View Full Plan
      </motion.button>
      
      <CropPlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        recommendation={recommendation}
      />
    </motion.div>
  );
}