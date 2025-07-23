import { useEffect, useState } from 'react';
import { realtimeManager } from '../lib/realtime';
import { useAuth } from '../contexts/AuthContext';
import type { WeatherData, Alert, CropRecommendation, FieldReport } from '../types';

// Hook for real-time weather updates
export function useRealtimeWeather(location: string) {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location) return;

    const channel = realtimeManager.subscribeToWeatherUpdates(location, (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      setWeatherData(prev => {
        switch (eventType) {
          case 'INSERT':
            return [...prev, newRecord];
          case 'UPDATE':
            return prev.map(item => item.id === newRecord.id ? newRecord : item);
          case 'DELETE':
            return prev.filter(item => item.id !== oldRecord.id);
          default:
            return prev;
        }
      });
    });

    setLoading(false);

    return () => {
      realtimeManager.unsubscribe(`weather-${location}`);
    };
  }, [location]);

  return { weatherData, loading };
}

// Hook for real-time alerts
export function useRealtimeAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const channel = realtimeManager.subscribeToAlerts(user.id, (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      setAlerts(prev => {
        switch (eventType) {
          case 'INSERT':
            return [newRecord, ...prev];
          case 'UPDATE':
            return prev.map(item => item.id === newRecord.id ? newRecord : item);
          case 'DELETE':
            return prev.filter(item => item.id !== oldRecord.id);
          default:
            return prev;
        }
      });
    });

    setLoading(false);

    return () => {
      realtimeManager.unsubscribe(`alerts-${user.id}`);
    };
  }, [user?.id]);

  return { alerts, loading };
}

// Hook for real-time crop recommendations
export function useRealtimeCropRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const channel = realtimeManager.subscribeToCropRecommendations(user.id, (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      setRecommendations(prev => {
        switch (eventType) {
          case 'INSERT':
            return [newRecord, ...prev];
          case 'UPDATE':
            return prev.map(item => item.id === newRecord.id ? newRecord : item);
          case 'DELETE':
            return prev.filter(item => item.id !== oldRecord.id);
          default:
            return prev;
        }
      });
    });

    setLoading(false);

    return () => {
      realtimeManager.unsubscribe(`crops-${user.id}`);
    };
  }, [user?.id]);

  return { recommendations, loading };
}

// Hook for real-time field reports
export function useRealtimeFieldReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const channel = realtimeManager.subscribeToFieldReports(user.id, (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      setReports(prev => {
        switch (eventType) {
          case 'INSERT':
            return [newRecord, ...prev];
          case 'UPDATE':
            return prev.map(item => item.id === newRecord.id ? newRecord : item);
          case 'DELETE':
            return prev.filter(item => item.id !== oldRecord.id);
          default:
            return prev;
        }
      });
    });

    setLoading(false);

    return () => {
      realtimeManager.unsubscribe(`reports-${user.id}`);
    };
  }, [user?.id]);

  return { reports, loading };
}

// Hook for broadcasting custom events
export function useBroadcast(channelName: string) {
  const broadcast = (event: string, payload: any) => {
    realtimeManager.broadcastEvent(channelName, event, payload);
  };

  return { broadcast };
}