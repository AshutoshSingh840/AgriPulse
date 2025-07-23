# AgriPulse - AI Climate-Smart Farming Advisor

A comprehensive farming management platform with real-time data synchronization, AI-powered crop recommendations, and climate-smart farming insights.

## Features

- 🌾 **AI Crop Recommendations** - Get personalized crop suggestions based on your location, soil, and climate
- 🌤️ **Real-time Weather Monitoring** - Live weather updates and forecasts
- 📱 **Voice Interface** - Multilingual voice commands and responses
- 📊 **Field Reporting** - Digital field reports with photo uploads
- 🔔 **Smart Alerts** - Real-time notifications for weather, pests, and crop conditions
- 📈 **Analytics Dashboard** - Comprehensive farming insights and trends
- 🌐 **Offline Support** - Works even with limited internet connectivity

## Real-time Features

This application uses Supabase for real-time data synchronization:

- **Live Weather Updates** - Weather data syncs instantly across all connected devices
- **Real-time Alerts** - Instant notifications for critical farming conditions
- **Collaborative Field Reports** - Share field observations in real-time
- **Live Crop Recommendations** - AI recommendations update automatically

## Local Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for local Supabase)

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Clone and Setup Project

```bash
git clone <your-repo>
cd agripulse
npm install
```

### 3. Start Local Supabase

```bash
# Initialize Supabase (if not already done)
supabase init

# Start local Supabase stack
supabase start
```

This will start:
- PostgreSQL database on `localhost:54322`
- Supabase Studio on `http://localhost:54323`
- API server on `http://localhost:54321`
- Real-time server for live updates

### 4. Environment Setup

The `.env` file is automatically configured for local development:

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=<local-anon-key>
```

### 5. Run Database Migrations

```bash
supabase db reset
```

### 6. Start Development Server

```bash
npm run dev
```

## Real-time Data Usage

### Weather Updates

```typescript
import { useRealtimeWeather } from './hooks/useRealtime';

function WeatherComponent() {
  const { weatherData } = useRealtimeWeather('Nairobi');
  
  return (
    <div>
      {weatherData.map(weather => (
        <div key={weather.id}>{weather.description}</div>
      ))}
    </div>
  );
}
```

### Alerts

```typescript
import { useRealtimeAlerts } from './hooks/useRealtime';

function AlertsComponent() {
  const { alerts } = useRealtimeAlerts();
  
  return (
    <div>
      {alerts.map(alert => (
        <div key={alert.id}>{alert.title}</div>
      ))}
    </div>
  );
}
```

### Broadcasting Custom Events

```typescript
import { realtimeManager } from './lib/realtime';

// Send real-time weather update
await realtimeManager.sendWeatherUpdate({
  location: 'Nairobi',
  temperature: 25,
  humidity: 70,
  // ... other weather data
});

// Send real-time alert
await realtimeManager.sendAlert({
  user_id: 'user-id',
  type: 'weather',
  severity: 'high',
  title: 'Heavy Rain Alert',
  description: 'Heavy rainfall expected in your area',
  action_required: 'Protect your crops'
});
```

## Database Schema

The application uses the following main tables:

- `users` - User profiles and farm information
- `weather_data` - Real-time weather information
- `crop_recommendations` - AI-generated crop suggestions
- `field_reports` - User-submitted field observations
- `alerts` - System and user alerts

All tables have Row Level Security (RLS) enabled for data protection.

## Production Deployment

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run Migrations

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

### 3. Update Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Deploy

Deploy to your preferred platform (Vercel, Netlify, etc.)

## Real-time Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │   Supabase       │    │   PostgreSQL    │
│                 │    │   Real-time      │    │   Database      │
│  ┌───────────┐  │    │                  │    │                 │
│  │ useRealtime│◄─┼────┤  WebSocket       │    │  ┌───────────┐  │
│  │   Hooks   │  │    │  Connection      │    │  │  Tables   │  │
│  └───────────┘  │    │                  │    │  │  + RLS    │  │
│                 │    │  ┌─────────────┐ │    │  └───────────┘  │
│  ┌───────────┐  │    │  │ Realtime    │ │    │                 │
│  │ Realtime  │──┼────┤  │ Manager     │ │    │  ┌───────────┐  │
│  │ Manager   │  │    │  └─────────────┘ │    │  │ Triggers  │  │
│  └───────────┘  │    │                  │    │  │ & Events  │  │
└─────────────────┘    └──────────────────┘    │  └───────────┘  │
                                               └─────────────────┘
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with local Supabase
5. Submit a pull request

## License

MIT License - see LICENSE file for details