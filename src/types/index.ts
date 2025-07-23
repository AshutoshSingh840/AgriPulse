export interface User {
  id: string;
  email: string;
  name: string;
  location: string;
  farm_size: number;
  primary_crops: string[];
  phone: string;
  preferred_language: string;
  created_at: string;
}

export interface WeatherData {
  id: string;
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  forecast_date: string;
  description: string;
  alerts: string[];
}

export interface CropRecommendation {
  id: string;
  user_id: string;
  crop_type: string;
  planting_date: string;
  harvest_date: string;
  irrigation_schedule: string[];
  fertilizer_recommendations: string[];
  expected_yield: number;
  confidence_score: number;
  created_at: string;
  detailed_plan?: CropPlan;
}

export interface CropPlan {
  overview: string;
  growth_stages: GrowthStage[];
  irrigation_details: IrrigationDetail[];
  fertilizer_schedule: FertilizerSchedule[];
  pest_management: PestManagement[];
  harvest_guidelines: HarvestGuideline[];
  market_insights: MarketInsight;
}

export interface GrowthStage {
  stage: string;
  duration_days: number;
  description: string;
  key_activities: string[];
  warning_signs: string[];
}

export interface IrrigationDetail {
  growth_stage: string;
  frequency: string;
  amount_per_session: string;
  timing: string;
  weather_adjustments: string;
}

export interface FertilizerSchedule {
  week: number;
  fertilizer_type: string;
  amount: string;
  application_method: string;
  notes: string;
}

export interface PestManagement {
  pest_type: string;
  identification: string;
  prevention: string[];
  organic_treatment: string[];
  chemical_treatment?: string[];
}

export interface HarvestGuideline {
  indicator: string;
  description: string;
  timing: string;
}

export interface MarketInsight {
  current_price: number;
  price_trend: 'up' | 'down' | 'stable';
  best_selling_time: string;
  storage_tips: string[];
  quality_factors: string[];
}

export interface FieldReport {
  id: string;
  user_id: string;
  crop_status: string;
  weather_conditions: string;
  soil_moisture: number;
  pest_issues: string[];
  growth_stage: string;
  photos: string[];
  created_at: string;
}

export interface Alert {
  id: string;
  type: 'weather' | 'crop' | 'market' | 'pest';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  action_required: string;
  created_at: string;
}