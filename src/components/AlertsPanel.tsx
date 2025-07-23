import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import type { Alert } from '../types';

interface AlertsPanelProps {
  alerts: Alert[];
  className?: string;
}

export default function AlertsPanel({ alerts, className = '' }: AlertsPanelProps) {
  const [readAlerts, setReadAlerts] = useState<Set<string>>(new Set());

  const getAlertIcon = (type: string, severity: string) => {
    const iconProps = { size: 20 };
    
    switch (severity) {
      case 'critical':
        return <XCircle {...iconProps} className="text-red-500" />;
      case 'high':
        return <AlertTriangle {...iconProps} className="text-orange-500" />;
      case 'medium':
        return <Info {...iconProps} className="text-blue-500" />;
      default:
        return <CheckCircle {...iconProps} className="text-green-500" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  // Demo alerts if none provided
  const demoAlerts: Alert[] = [
    {
      id: '1',
      type: 'weather',
      severity: 'high',
      title: 'Heavy Rainfall Expected',
      description: 'Intense rainfall predicted for the next 48 hours. Consider delaying planting activities.',
      action_required: 'Protect seedlings and ensure proper drainage',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      type: 'crop',
      severity: 'medium',
      title: 'Optimal Planting Window',
      description: 'Current conditions are ideal for planting maize. Soil temperature and moisture levels are optimal.',
      action_required: 'Begin planting within the next 5 days',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      type: 'pest',
      severity: 'low',
      title: 'Pest Monitoring',
      description: 'Increased aphid activity reported in nearby farms. Monitor your crops closely.',
      action_required: 'Inspect plants daily and apply organic pest control if needed',
      created_at: new Date().toISOString()
    }
  ];

  const displayAlerts = alerts.length > 0 ? alerts : demoAlerts;

  const toggleReadStatus = (alertId: string) => {
    const newReadAlerts = new Set(readAlerts);
    if (newReadAlerts.has(alertId)) {
      newReadAlerts.delete(alertId);
    } else {
      newReadAlerts.add(alertId);
    }
    setReadAlerts(newReadAlerts);
  };

  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Alerts</h3>
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
          {displayAlerts.filter(alert => !readAlerts.has(alert.id)).length} unread
        </span>
      </div>
      
      <div className="space-y-3">
        {displayAlerts.map((alert, index) => (
          <motion.div 
            key={alert.id}
            className={`border rounded-lg p-4 ${getAlertColor(alert.severity)} ${
              readAlerts.has(alert.id) ? 'opacity-60' : ''
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
              {getAlertIcon(alert.type, alert.severity)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{alert.title}</h4>
                  <span className="text-xs uppercase font-medium px-2 py-1 bg-white bg-opacity-50 rounded">
                    {alert.type}
                  </span>
                </div>
                <p className="text-sm mb-2">{alert.description}</p>
                <div className="bg-white bg-opacity-50 rounded-lg p-2">
                  <p className="text-xs font-medium mb-1">Action Required:</p>
                  <p className="text-xs">{alert.action_required}</p>
                </div>
              </div>
            </div>
              <motion.button
                onClick={() => toggleReadStatus(alert.id)}
                className="ml-2 p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={readAlerts.has(alert.id) ? 'Mark as unread' : 'Mark as read'}
              >
                {readAlerts.has(alert.id) ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}