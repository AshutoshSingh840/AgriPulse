import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();

  // Subscribe to real-time weather updates
  subscribeToWeatherUpdates(location: string, callback: (payload: any) => void) {
    const channelName = `weather-${location}`;
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weather_data',
          filter: `location=eq.${location}`
        },
        (payload) => {
          console.log('Weather update received:', payload);
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Subscribe to real-time crop recommendations
  subscribeToCropRecommendations(userId: string, callback: (payload: any) => void) {
    const channelName = `crops-${userId}`;
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crop_recommendations',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Crop recommendation update:', payload);
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Subscribe to real-time alerts
  subscribeToAlerts(userId: string, callback: (payload: any) => void) {
    const channelName = `alerts-${userId}`;
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Alert update:', payload);
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Subscribe to field reports
  subscribeToFieldReports(userId: string, callback: (payload: any) => void) {
    const channelName = `reports-${userId}`;
    
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'field_reports',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Field report update:', payload);
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Unsubscribe from a specific channel
  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.channels.forEach((channel, channelName) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  // Send real-time weather data
  async sendWeatherUpdate(weatherData: any) {
    try {
      const { data, error } = await supabase
        .from('weather_data')
        .insert([weatherData])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending weather update:', error);
      throw error;
    }
  }

  // Send real-time alert
  async sendAlert(alertData: any) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .insert([alertData])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending alert:', error);
      throw error;
    }
  }

  // Broadcast custom events
  broadcastEvent(channel: string, event: string, payload: any) {
    const channelInstance = this.channels.get(channel);
    if (channelInstance) {
      channelInstance.send({
        type: 'broadcast',
        event,
        payload
      });
    }
  }
}

// Create a singleton instance
export const realtimeManager = new RealtimeManager();