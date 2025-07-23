import type { CropRecommendation } from '../types';
import type { CropPlan, GrowthStage, IrrigationDetail, FertilizerSchedule, PestManagement, HarvestGuideline, MarketInsight } from '../types';

const CROP_DATABASE = {
  'corn': {
    growing_season: 120,
    water_requirement: 'high',
    soil_type: 'loamy',
    temperature_range: [20, 30],
    rainfall_requirement: [500, 800]
  },
  'rice': {
    growing_season: 150,
    water_requirement: 'very_high',
    soil_type: 'clay',
    temperature_range: [25, 35],
    rainfall_requirement: [1200, 1800]
  },
  'wheat': {
    growing_season: 100,
    water_requirement: 'medium',
    soil_type: 'sandy_loam',
    temperature_range: [15, 25],
    rainfall_requirement: [300, 500]
  },
  'tomatoes': {
    growing_season: 90,
    water_requirement: 'high',
    soil_type: 'well_drained',
    temperature_range: [18, 28],
    rainfall_requirement: [400, 600]
  }
};

export async function getCropRecommendations(
  userId: string,
  location: string,
  soilType: string,
  farmSize: number
): Promise<CropRecommendation[]> {
  // Simulate AI analysis
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const crops = Object.keys(CROP_DATABASE);
  const recommendations: CropRecommendation[] = [];
  
  for (const crop of crops.slice(0, 3)) {
    const plantingDate = new Date();
    plantingDate.setDate(plantingDate.getDate() + Math.floor(Math.random() * 30));
    
    const harvestDate = new Date(plantingDate);
    harvestDate.setDate(harvestDate.getDate() + CROP_DATABASE[crop].growing_season);
    
    recommendations.push({
      id: crypto.randomUUID(),
      user_id: userId,
      crop_type: crop,
      planting_date: plantingDate.toISOString(),
      harvest_date: harvestDate.toISOString(),
      irrigation_schedule: [
        'Water deeply every 3-4 days',
        'Reduce watering during flowering',
        'Increase watering during fruit development'
      ],
      fertilizer_recommendations: [
        'Apply nitrogen-rich fertilizer during early growth',
        'Add phosphorus for root development',
        'Use potassium for disease resistance'
      ],
      expected_yield: farmSize * (800 + Math.random() * 400),
      confidence_score: 85 + Math.random() * 10,
      created_at: new Date().toISOString()
    });
  }
  
  return recommendations;
}

export async function getDetailedCropPlan(cropType: string): Promise<CropPlan> {
  // Simulate AI analysis for detailed crop plan
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const cropPlans: Record<string, CropPlan> = {
    corn: {
      overview: "Corn is a warm-season crop that requires well-drained soil and consistent moisture. With proper care, you can expect yields of 800-1200 kg per acre. This plan is optimized for your local climate conditions.",
      growth_stages: [
        {
          stage: "Germination & Emergence",
          duration_days: 10,
          description: "Seeds germinate and first shoots emerge from soil",
          key_activities: ["Ensure consistent soil moisture", "Monitor for pests", "Apply starter fertilizer"],
          warning_signs: ["Poor germination rate", "Yellowing seedlings", "Pest damage"]
        },
        {
          stage: "Vegetative Growth",
          duration_days: 45,
          description: "Rapid leaf and stem development, root system establishment",
          key_activities: ["Regular watering", "Weed control", "Side-dress with nitrogen"],
          warning_signs: ["Stunted growth", "Leaf discoloration", "Weed competition"]
        },
        {
          stage: "Tasseling & Silking",
          duration_days: 20,
          description: "Reproductive phase begins, critical for yield determination",
          key_activities: ["Maintain consistent moisture", "Monitor for silk emergence", "Pest control"],
          warning_signs: ["Poor silk development", "Drought stress", "Pest infestation"]
        },
        {
          stage: "Grain Filling",
          duration_days: 30,
          description: "Kernels develop and fill with starch",
          key_activities: ["Consistent irrigation", "Monitor kernel development", "Prepare for harvest"],
          warning_signs: ["Kernel abortion", "Disease symptoms", "Nutrient deficiency"]
        },
        {
          stage: "Maturity",
          duration_days: 15,
          description: "Grain reaches physiological maturity",
          key_activities: ["Reduce irrigation", "Monitor moisture content", "Plan harvest timing"],
          warning_signs: ["Premature drying", "Lodging", "Pest damage to ears"]
        }
      ],
      irrigation_details: [
        {
          growth_stage: "Germination",
          frequency: "Daily",
          amount_per_session: "10-15mm",
          timing: "Early morning",
          weather_adjustments: "Reduce if rainfall >5mm/day"
        },
        {
          growth_stage: "Vegetative",
          frequency: "Every 2-3 days",
          amount_per_session: "20-25mm",
          timing: "Early morning or evening",
          weather_adjustments: "Increase frequency during hot weather"
        },
        {
          growth_stage: "Reproductive",
          frequency: "Every 2 days",
          amount_per_session: "25-30mm",
          timing: "Early morning",
          weather_adjustments: "Critical period - maintain even with light rain"
        }
      ],
      fertilizer_schedule: [
        {
          week: 1,
          fertilizer_type: "Starter Fertilizer (10-10-10)",
          amount: "50kg per acre",
          application_method: "Band application at planting",
          notes: "Place 2 inches to the side and below seed"
        },
        {
          week: 4,
          fertilizer_type: "Nitrogen (Urea 46-0-0)",
          amount: "100kg per acre",
          application_method: "Side-dress application",
          notes: "Apply when plants are 12-18 inches tall"
        },
        {
          week: 8,
          fertilizer_type: "Nitrogen (Urea 46-0-0)",
          amount: "75kg per acre",
          application_method: "Top-dress application",
          notes: "Apply before tasseling stage"
        }
      ],
      pest_management: [
        {
          pest_type: "Corn Borer",
          identification: "Small holes in leaves, sawdust-like frass, tunnels in stalks",
          prevention: ["Plant resistant varieties", "Crop rotation", "Remove crop residue"],
          organic_treatment: ["Bacillus thuringiensis (Bt) spray", "Trichogramma wasps", "Neem oil"],
          chemical_treatment: ["Chlorantraniliprole", "Spinosad"]
        },
        {
          pest_type: "Armyworm",
          identification: "Chewed leaves, defoliation, caterpillars feeding at night",
          prevention: ["Monitor regularly", "Encourage natural predators", "Avoid over-fertilization"],
          organic_treatment: ["Hand picking", "Bt spray", "Beneficial insects"],
          chemical_treatment: ["Emamectin benzoate", "Chlorpyrifos"]
        }
      ],
      harvest_guidelines: [
        {
          indicator: "Moisture Content",
          description: "Kernels should have 20-25% moisture content",
          timing: "Test moisture daily starting 100 days after planting"
        },
        {
          indicator: "Kernel Appearance",
          description: "Kernels are firm, fully developed, and dented",
          timing: "Visual inspection of multiple ears"
        },
        {
          indicator: "Husk Color",
          description: "Husks turn brown and dry",
          timing: "Monitor husk color change progression"
        }
      ],
      market_insights: {
        current_price: 25.50,
        price_trend: 'up',
        best_selling_time: "Immediately after harvest or store for 2-3 months",
        storage_tips: ["Dry to 14% moisture", "Store in ventilated containers", "Protect from rodents"],
        quality_factors: ["Moisture content", "Foreign matter", "Broken kernels", "Pest damage"]
      }
    },
    rice: {
      overview: "Rice is a water-intensive crop that thrives in flooded conditions. This plan is designed for lowland rice cultivation with expected yields of 1000-1500 kg per acre.",
      growth_stages: [
        {
          stage: "Land Preparation",
          duration_days: 14,
          description: "Field preparation and water management setup",
          key_activities: ["Plow and harrow field", "Level the field", "Prepare irrigation channels"],
          warning_signs: ["Poor field leveling", "Inadequate drainage", "Weed infestation"]
        },
        {
          stage: "Transplanting",
          duration_days: 7,
          description: "Seedling establishment in main field",
          key_activities: ["Transplant 21-day seedlings", "Maintain 2-3cm water depth", "Apply basal fertilizer"],
          warning_signs: ["Seedling shock", "Poor establishment", "Water stress"]
        },
        {
          stage: "Tillering",
          duration_days: 35,
          description: "Formation of tillers and root development",
          key_activities: ["Maintain water level", "Apply nitrogen fertilizer", "Weed control"],
          warning_signs: ["Poor tillering", "Nutrient deficiency", "Pest attack"]
        },
        {
          stage: "Panicle Initiation",
          duration_days: 20,
          description: "Formation of panicles (flower clusters)",
          key_activities: ["Increase water depth", "Apply phosphorus", "Monitor for diseases"],
          warning_signs: ["Poor panicle formation", "Disease symptoms", "Nutrient stress"]
        },
        {
          stage: "Grain Filling",
          duration_days: 30,
          description: "Grain development and maturation",
          key_activities: ["Maintain water until milk stage", "Drain field gradually", "Prepare for harvest"],
          warning_signs: ["Poor grain filling", "Lodging", "Bird damage"]
        }
      ],
      irrigation_details: [
        {
          growth_stage: "Transplanting",
          frequency: "Continuous",
          amount_per_session: "2-3cm standing water",
          timing: "Maintain throughout stage",
          weather_adjustments: "Adjust for rainfall to maintain level"
        },
        {
          growth_stage: "Tillering",
          frequency: "Continuous",
          amount_per_session: "3-5cm standing water",
          timing: "Maintain throughout stage",
          weather_adjustments: "Allow brief drying for root aeration"
        },
        {
          growth_stage: "Reproductive",
          frequency: "Continuous",
          amount_per_session: "5-7cm standing water",
          timing: "Critical water requirement",
          weather_adjustments: "Never allow drying during this stage"
        }
      ],
      fertilizer_schedule: [
        {
          week: 0,
          fertilizer_type: "Basal Fertilizer (14-14-14)",
          amount: "125kg per acre",
          application_method: "Broadcast before transplanting",
          notes: "Incorporate into soil during final puddling"
        },
        {
          week: 3,
          fertilizer_type: "Nitrogen (Urea 46-0-0)",
          amount: "65kg per acre",
          application_method: "Broadcast in standing water",
          notes: "Apply during active tillering stage"
        },
        {
          week: 7,
          fertilizer_type: "Nitrogen + Potassium",
          amount: "45kg N + 30kg K2O per acre",
          application_method: "Broadcast application",
          notes: "Apply at panicle initiation stage"
        }
      ],
      pest_management: [
        {
          pest_type: "Rice Stem Borer",
          identification: "Dead hearts, white heads, tunnels in stems",
          prevention: ["Use resistant varieties", "Synchronous planting", "Remove stubble"],
          organic_treatment: ["Trichogramma release", "Light traps", "Bt application"],
          chemical_treatment: ["Cartap hydrochloride", "Fipronil"]
        },
        {
          pest_type: "Brown Planthopper",
          identification: "Yellowing plants, hopperburn, honeydew secretion",
          prevention: ["Avoid excessive nitrogen", "Maintain proper spacing", "Use resistant varieties"],
          organic_treatment: ["Neem oil", "Predatory spiders", "Mirid bugs"],
          chemical_treatment: ["Imidacloprid", "Buprofezin"]
        }
      ],
      harvest_guidelines: [
        {
          indicator: "Grain Color",
          description: "80% of grains turn golden yellow",
          timing: "Check color change in multiple panicles"
        },
        {
          indicator: "Moisture Content",
          description: "Grain moisture at 20-22%",
          timing: "Test moisture content daily"
        },
        {
          indicator: "Panicle Drooping",
          description: "Panicles bend due to grain weight",
          timing: "Visual assessment of field maturity"
        }
      ],
      market_insights: {
        current_price: 22.00,
        price_trend: 'stable',
        best_selling_time: "Store for 1-2 months after harvest for better prices",
        storage_tips: ["Dry to 14% moisture", "Use hermetic storage", "Regular monitoring for pests"],
        quality_factors: ["Grain size uniformity", "Broken grain percentage", "Moisture content", "Purity"]
      }
    },
    tomatoes: {
      overview: "Tomatoes are high-value crops requiring intensive management. With proper care, you can achieve yields of 1500-2500 kg per acre. This plan focuses on disease prevention and quality production.",
      growth_stages: [
        {
          stage: "Seedling",
          duration_days: 21,
          description: "Nursery stage for healthy seedling development",
          key_activities: ["Maintain nursery temperature", "Regular watering", "Hardening process"],
          warning_signs: ["Damping off", "Weak seedlings", "Pest attack"]
        },
        {
          stage: "Transplanting & Establishment",
          duration_days: 14,
          description: "Field establishment and root development",
          key_activities: ["Careful transplanting", "Shade provision", "Starter fertilizer"],
          warning_signs: ["Transplant shock", "Wilting", "Poor establishment"]
        },
        {
          stage: "Vegetative Growth",
          duration_days: 35,
          description: "Rapid plant growth and branching",
          key_activities: ["Staking/support", "Pruning suckers", "Regular fertilization"],
          warning_signs: ["Slow growth", "Disease symptoms", "Nutrient deficiency"]
        },
        {
          stage: "Flowering & Fruit Set",
          duration_days: 21,
          description: "Flower formation and fruit development begins",
          key_activities: ["Maintain consistent moisture", "Support heavy branches", "Disease monitoring"],
          warning_signs: ["Poor fruit set", "Blossom end rot", "Disease outbreak"]
        },
        {
          stage: "Fruit Development & Harvest",
          duration_days: 60,
          description: "Continuous fruit production and harvesting",
          key_activities: ["Regular harvesting", "Continued fertilization", "Pest management"],
          warning_signs: ["Fruit cracking", "Disease spread", "Quality deterioration"]
        }
      ],
      irrigation_details: [
        {
          growth_stage: "Seedling",
          frequency: "Daily",
          amount_per_session: "Light watering",
          timing: "Morning",
          weather_adjustments: "Reduce if humidity is high"
        },
        {
          growth_stage: "Vegetative",
          frequency: "Every 2 days",
          amount_per_session: "Deep watering",
          timing: "Early morning",
          weather_adjustments: "Increase frequency in hot weather"
        },
        {
          growth_stage: "Fruiting",
          frequency: "Daily",
          amount_per_session: "Consistent moisture",
          timing: "Morning and evening if needed",
          weather_adjustments: "Critical to maintain consistency"
        }
      ],
      fertilizer_schedule: [
        {
          week: 0,
          fertilizer_type: "Basal Fertilizer (10-26-26)",
          amount: "200kg per acre",
          application_method: "Incorporate into soil",
          notes: "Apply during land preparation"
        },
        {
          week: 2,
          fertilizer_type: "Nitrogen (19-19-19)",
          amount: "50kg per acre",
          application_method: "Side dress application",
          notes: "Apply after transplant establishment"
        },
        {
          week: 6,
          fertilizer_type: "High Potassium (13-0-45)",
          amount: "75kg per acre",
          application_method: "Fertigation or side dress",
          notes: "Start at first fruit set"
        }
      ],
      pest_management: [
        {
          pest_type: "Tomato Hornworm",
          identification: "Large green caterpillars, defoliation, black droppings",
          prevention: ["Regular inspection", "Companion planting", "Remove weeds"],
          organic_treatment: ["Hand picking", "Bt spray", "Beneficial wasps"],
          chemical_treatment: ["Spinosad", "Indoxacarb"]
        },
        {
          pest_type: "Whitefly",
          identification: "Small white flying insects, yellowing leaves, honeydew",
          prevention: ["Yellow sticky traps", "Reflective mulch", "Proper spacing"],
          organic_treatment: ["Neem oil", "Insecticidal soap", "Beneficial insects"],
          chemical_treatment: ["Imidacloprid", "Thiamethoxam"]
        }
      ],
      harvest_guidelines: [
        {
          indicator: "Color Change",
          description: "Fruits show first blush of color",
          timing: "Harvest at breaker stage for shipping"
        },
        {
          indicator: "Firmness",
          description: "Fruits are firm but yield slightly to pressure",
          timing: "Check firmness daily"
        },
        {
          indicator: "Size",
          description: "Fruits reach expected size for variety",
          timing: "Monitor size development"
        }
      ],
      market_insights: {
        current_price: 45.00,
        price_trend: 'up',
        best_selling_time: "Early morning harvest for best prices",
        storage_tips: ["Store at 12-15°C", "Avoid refrigeration", "Handle carefully"],
        quality_factors: ["Color uniformity", "Firmness", "Size consistency", "Absence of defects"]
      }
    }
  };
  
  return cropPlans[cropType] || cropPlans.corn;
}
export async function getIrrigationSchedule(cropType: string, weatherData: any): Promise<string[]> {
  // AI-driven irrigation recommendations based on weather and crop needs
  const schedule = [];
  
  if (weatherData.rainfall < 5) {
    schedule.push('Water immediately - drought conditions detected');
  }
  
  if (weatherData.temperature > 30) {
    schedule.push('Increase watering frequency due to high temperature');
  }
  
  if (weatherData.humidity < 40) {
    schedule.push('Water in early morning to reduce evaporation');
  }
  
  return schedule.length > 0 ? schedule : ['Maintain regular watering schedule'];
}