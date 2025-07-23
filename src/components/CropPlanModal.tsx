import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Droplets, Beaker, Bug, TrendingUp, DollarSign, Clock, AlertTriangle, CheckCircle, Leaf, BarChart3 } from 'lucide-react';
import { getDetailedCropPlan } from '../lib/crop-advisor';
import type { CropPlan, CropRecommendation } from '../types';
import { format } from 'date-fns';

interface CropPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: CropRecommendation;
}

export default function CropPlanModal({ isOpen, onClose, recommendation }: CropPlanModalProps) {
  const [cropPlan, setCropPlan] = useState<CropPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && !cropPlan) {
      loadCropPlan();
    }
  }, [isOpen]);

  const loadCropPlan = async () => {
    setLoading(true);
    try {
      const plan = await getDetailedCropPlan(recommendation.crop_type);
      setCropPlan(plan);
    } catch (error) {
      console.error('Error loading crop plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCropEmoji = (crop: string) => {
    switch (crop.toLowerCase()) {
      case 'corn': return '🌽';
      case 'rice': return '🌾';
      case 'wheat': return '🌾';
      case 'tomatoes': return '🍅';
      default: return '🌱';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Leaf },
    { id: 'stages', label: 'Growth Stages', icon: Calendar },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets },
    { id: 'fertilizer', label: 'Fertilizer', icon: Beaker },
    { id: 'pests', label: 'Pest Control', icon: Bug },
    { id: 'harvest', label: 'Harvest', icon: CheckCircle },
    { id: 'market', label: 'Market Info', icon: DollarSign }
  ];

  const renderTabContent = () => {
    if (!cropPlan) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Crop Overview</h3>
              <p className="text-green-700 leading-relaxed">{cropPlan.overview}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="text-blue-600" size={20} />
                  <h4 className="font-semibold text-blue-800">Planting Date</h4>
                </div>
                <p className="text-blue-700">{format(new Date(recommendation.planting_date), 'MMMM dd, yyyy')}</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="text-purple-600" size={20} />
                  <h4 className="font-semibold text-purple-800">Expected Yield</h4>
                </div>
                <p className="text-purple-700">{recommendation.expected_yield.toFixed(0)} kg</p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="text-orange-600" size={20} />
                  <h4 className="font-semibold text-orange-800">Growing Period</h4>
                </div>
                <p className="text-orange-700">
                  {Math.ceil((new Date(recommendation.harvest_date).getTime() - new Date(recommendation.planting_date).getTime()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="text-green-600" size={20} />
                  <h4 className="font-semibold text-green-800">Confidence Score</h4>
                </div>
                <p className="text-green-700">{recommendation.confidence_score.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        );

      case 'stages':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Stages Timeline</h3>
            {cropPlan.growth_stages.map((stage, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{stage.stage}</h4>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {stage.duration_days} days
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{stage.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-green-700 mb-2">Key Activities:</h5>
                    <ul className="space-y-1">
                      {stage.key_activities.map((activity, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="text-green-500 mt-0.5" size={14} />
                          <span className="text-gray-700">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-red-700 mb-2">Warning Signs:</h5>
                    <ul className="space-y-1">
                      {stage.warning_signs.map((warning, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm">
                          <AlertTriangle className="text-red-500 mt-0.5" size={14} />
                          <span className="text-gray-700">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'irrigation':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Irrigation Schedule</h3>
            {cropPlan.irrigation_details.map((detail, index) => (
              <motion.div
                key={index}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="font-semibold text-blue-800 mb-3">{detail.growth_stage}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-700 mb-1"><strong>Frequency:</strong> {detail.frequency}</p>
                    <p className="text-sm text-blue-700 mb-1"><strong>Amount:</strong> {detail.amount_per_session}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 mb-1"><strong>Timing:</strong> {detail.timing}</p>
                    <p className="text-sm text-blue-700"><strong>Weather Adjustments:</strong> {detail.weather_adjustments}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'fertilizer':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fertilizer Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Week</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Fertilizer Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Method</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {cropPlan.fertilizer_schedule.map((schedule, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="border border-gray-300 px-4 py-2 font-medium">{schedule.week}</td>
                      <td className="border border-gray-300 px-4 py-2">{schedule.fertilizer_type}</td>
                      <td className="border border-gray-300 px-4 py-2">{schedule.amount}</td>
                      <td className="border border-gray-300 px-4 py-2">{schedule.application_method}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{schedule.notes}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'pests':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pest Management</h3>
            {cropPlan.pest_management.map((pest, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="font-semibold text-gray-800 mb-3">{pest.pest_type}</h4>
                <p className="text-gray-600 mb-4">{pest.identification}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h5 className="font-medium text-blue-800 mb-2">Prevention</h5>
                    <ul className="space-y-1">
                      {pest.prevention.map((method, i) => (
                        <li key={i} className="text-sm text-blue-700">• {method}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h5 className="font-medium text-green-800 mb-2">Organic Treatment</h5>
                    <ul className="space-y-1">
                      {pest.organic_treatment.map((method, i) => (
                        <li key={i} className="text-sm text-green-700">• {method}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {pest.chemical_treatment && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <h5 className="font-medium text-orange-800 mb-2">Chemical Treatment</h5>
                      <ul className="space-y-1">
                        {pest.chemical_treatment.map((method, i) => (
                          <li key={i} className="text-sm text-orange-700">• {method}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'harvest':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Harvest Guidelines</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800">
                <strong>Expected Harvest Date:</strong> {format(new Date(recommendation.harvest_date), 'MMMM dd, yyyy')}
              </p>
            </div>
            
            {cropPlan.harvest_guidelines.map((guideline, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="font-semibold text-gray-800 mb-2">{guideline.indicator}</h4>
                <p className="text-gray-600 mb-2">{guideline.description}</p>
                <p className="text-sm text-blue-600"><strong>Timing:</strong> {guideline.timing}</p>
              </motion.div>
            ))}
          </div>
        );

      case 'market':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="text-green-600" size={20} />
                  <h4 className="font-semibold text-green-800">Current Price</h4>
                </div>
                <p className="text-2xl font-bold text-green-700">${cropPlan.market_insights.current_price}/kg</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className={`${cropPlan.market_insights.price_trend === 'up' ? 'text-green-500' : cropPlan.market_insights.price_trend === 'down' ? 'text-red-500' : 'text-gray-500'}`} size={16} />
                  <span className="text-sm capitalize text-gray-600">{cropPlan.market_insights.price_trend}</span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="text-blue-600" size={20} />
                  <h4 className="font-semibold text-blue-800">Best Selling Time</h4>
                </div>
                <p className="text-blue-700">{cropPlan.market_insights.best_selling_time}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-3">Storage Tips</h4>
                <ul className="space-y-2">
                  {cropPlan.market_insights.storage_tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="text-purple-600 mt-0.5" size={14} />
                      <span className="text-sm text-purple-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-3">Quality Factors</h4>
                <ul className="space-y-2">
                  {cropPlan.market_insights.quality_factors.map((factor, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="text-orange-600 mt-0.5" size={14} />
                      <span className="text-sm text-orange-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{getCropEmoji(recommendation.crop_type)}</span>
                  <div>
                    <h2 className="text-2xl font-bold capitalize">
                      {recommendation.crop_type} Growing Plan
                    </h2>
                    <p className="text-green-200">
                      Complete guide for successful cultivation
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-green-500 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'text-green-600 border-b-2 border-green-600 bg-white'
                          : 'text-gray-600 hover:text-green-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Leaf size={48} className="text-green-500" />
                  </motion.div>
                  <p className="ml-4 text-gray-600">Loading detailed crop plan...</p>
                </div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderTabContent()}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}