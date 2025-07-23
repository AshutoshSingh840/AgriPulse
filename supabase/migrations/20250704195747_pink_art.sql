/*
  # Create users table and related database structure

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `name` (text, not null)
      - `location` (text, not null)
      - `farm_size` (numeric, not null)
      - `primary_crops` (text[], not null)
      - `phone` (text, not null)
      - `preferred_language` (text, not null, default 'en')
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())

    - `weather_data`
      - `id` (uuid, primary key)
      - `location` (text, not null)
      - `temperature` (numeric, not null)
      - `humidity` (numeric, not null)
      - `rainfall` (numeric, not null)
      - `wind_speed` (numeric, not null)
      - `forecast_date` (timestamp with time zone, not null)
      - `description` (text, not null)
      - `alerts` (text[], default '{}')
      - `created_at` (timestamp with time zone, default now())

    - `crop_recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `crop_type` (text, not null)
      - `planting_date` (timestamp with time zone, not null)
      - `harvest_date` (timestamp with time zone, not null)
      - `irrigation_schedule` (text[], not null)
      - `fertilizer_recommendations` (text[], not null)
      - `expected_yield` (numeric, not null)
      - `confidence_score` (numeric, not null)
      - `created_at` (timestamp with time zone, default now())

    - `field_reports`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `crop_status` (text, not null)
      - `weather_conditions` (text, not null)
      - `soil_moisture` (numeric, not null)
      - `pest_issues` (text[], default '{}')
      - `growth_stage` (text, not null)
      - `photos` (text[], default '{}')
      - `created_at` (timestamp with time zone, default now())

    - `alerts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (text, not null)
      - `severity` (text, not null)
      - `title` (text, not null)
      - `description` (text, not null)
      - `action_required` (text, not null)
      - `is_read` (boolean, default false)
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for weather data to be readable by all authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  location text NOT NULL,
  farm_size numeric NOT NULL,
  primary_crops text[] NOT NULL,
  phone text NOT NULL,
  preferred_language text NOT NULL DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  temperature numeric NOT NULL,
  humidity numeric NOT NULL,
  rainfall numeric NOT NULL,
  wind_speed numeric NOT NULL,
  forecast_date timestamptz NOT NULL,
  description text NOT NULL,
  alerts text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create crop_recommendations table
CREATE TABLE IF NOT EXISTS crop_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  crop_type text NOT NULL,
  planting_date timestamptz NOT NULL,
  harvest_date timestamptz NOT NULL,
  irrigation_schedule text[] NOT NULL,
  fertilizer_recommendations text[] NOT NULL,
  expected_yield numeric NOT NULL,
  confidence_score numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create field_reports table
CREATE TABLE IF NOT EXISTS field_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  crop_status text NOT NULL,
  weather_conditions text NOT NULL,
  soil_moisture numeric NOT NULL,
  pest_issues text[] DEFAULT '{}',
  growth_stage text NOT NULL,
  photos text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  severity text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  action_required text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for weather_data table
CREATE POLICY "Weather data is readable by all authenticated users" ON weather_data
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Weather data can be inserted by authenticated users" ON weather_data
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- RLS Policies for crop_recommendations table
CREATE POLICY "Users can view own crop recommendations" ON crop_recommendations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own crop recommendations" ON crop_recommendations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own crop recommendations" ON crop_recommendations
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for field_reports table
CREATE POLICY "Users can view own field reports" ON field_reports
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own field reports" ON field_reports
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own field reports" ON field_reports
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for alerts table
CREATE POLICY "Users can view own alerts" ON alerts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts" ON alerts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON alerts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_weather_data_location ON weather_data(location);
CREATE INDEX IF NOT EXISTS idx_weather_data_forecast_date ON weather_data(forecast_date);
CREATE INDEX IF NOT EXISTS idx_crop_recommendations_user_id ON crop_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_field_reports_user_id ON field_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON alerts(is_read);

-- Create updated_at trigger for users table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();