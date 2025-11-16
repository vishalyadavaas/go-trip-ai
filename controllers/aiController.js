const { GoogleGenAI } = require('@google/genai');
const Trip = require('../models/Trip');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Google GenAI client
let ai;
if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

// @desc    Get AI trip recommendations
// @route   POST /api/ai/recommend-trip
// @access  Private
const recommendTrip = async (req, res) => {
  try {
    const { budget, place, days, travelStyle, companions } = req.body;

    if (!budget || !place || !days) {
      return res.status(400).json({
        success: false,
        message: 'Please provide budget, place, and days'
      });
    }

    const prompt = `As a travel expert, create a detailed ${days}-day trip plan for ${place} with a ${budget} budget for ${companions}. Travel style: ${travelStyle}.

Provide the response in this exact JSON format:
{
  "itinerary": [
    {
      "day": 1,
      "morning": "activity description",
      "afternoon": "activity description", 
      "evening": "activity description",
      "accommodation": "suggestion",
      "meals": "recommendations"
    }
  ],
  "budgetBreakdown": {
    "accommodation": "cost estimate",
    "food": "cost estimate",
    "activities": "cost estimate",
    "transportation": "cost estimate",
    "totalEstimate": "total cost"
  },
  "mustVisit": ["place1", "place2", "place3"],
  "localCuisine": ["dish1", "dish2", "dish3"],
  "transportTips": "transportation advice",
  "culturalNotes": "cultural insights and tips",
  "packingSuggestions": ["item1", "item2", "item3"]
}

Make it practical and realistic.`;

    let recommendation;

    // Try Google GenAI if initialized
    if (ai) {
      try {
        recommendation = await callGeminiAPI(prompt, 'recommendation');
      } catch (apiError) {
        console.warn('Google GenAI failed, using enhanced fallback:', apiError.message);
        recommendation = generateEnhancedRecommendation(budget, place, days, travelStyle, companions);
      }
    } else {
      console.log('Using enhanced fallback data - Google GenAI not configured');
      recommendation = generateEnhancedRecommendation(budget, place, days, travelStyle, companions);
    }

    res.json({
      success: true,
      data: recommendation,
      source: ai ? 'Google GenAI (Gemini 2.0)' : 'Enhanced Fallback Data'
    });

  } catch (error) {
    console.error('AI recommendation error:', error);
    
    const fallbackRecommendation = generateEnhancedRecommendation(
      req.body.budget, 
      req.body.place, 
      req.body.days, 
      req.body.travelStyle, 
      req.body.companions
    );

    res.json({
      success: true,
      data: fallbackRecommendation,
      note: "Using enhanced fallback data due to service issue"
    });
  }
};

// @desc    Generate AI packing list
// @route   POST /api/ai/packing-list
// @access  Private
const generatePackingList = async (req, res) => {
  try {
    const { destination, days, season, activities, budget } = req.body;

    if (!destination || !days || !season) {
      return res.status(400).json({
        success: false,
        message: 'Please provide destination, days, and season'
      });
    }

    const prompt = `Create a comprehensive packing list for a ${days}-day trip to ${destination} during ${season}. Activities: ${activities?.join(', ') || 'general sightseeing'}. Budget level: ${budget}.

Provide the response in this exact JSON format:
{
  "clothing": ["item1", "item2", "item3"],
  "toiletries": ["item1", "item2", "item3"],
  "electronics": ["item1", "item2", "item3"],
  "documents": ["item1", "item2", "item3"],
  "medications": ["item1", "item2", "item3"],
  "miscellaneous": ["item1", "item2", "item3"]
}

Make it practical and tailored to the destination.`;

    let packingList;

    // Try Google GenAI if initialized
    if (ai) {
      try {
        const aiResponse = await callGeminiAPI(prompt, 'packing');
        // Convert array to object with completed status for frontend
        const formattedPackingList = {};
        Object.keys(aiResponse).forEach(category => {
          formattedPackingList[category] = aiResponse[category].map(item => ({
            item,
            completed: false
          }));
        });
        packingList = formattedPackingList;
      } catch (apiError) {
        console.warn('Google GenAI failed, using enhanced fallback:', apiError.message);
        packingList = generateEnhancedPackingList(destination, days, season, activities, budget);
      }
    } else {
      console.log('Using enhanced fallback data - Google GenAI not configured');
      packingList = generateEnhancedPackingList(destination, days, season, activities, budget);
    }

    res.json({
      success: true,
      data: packingList,
      source: ai ? 'Google GenAI (Gemini 2.0)' : 'Enhanced Fallback Data'
    });

  } catch (error) {
    console.error('AI packing list error:', error);
    
    const fallbackPackingList = generateEnhancedPackingList(
      req.body.destination,
      req.body.days,
      req.body.season,
      req.body.activities,
      req.body.budget
    );

    res.json({
      success: true,
      data: fallbackPackingList,
      note: "Using enhanced fallback data due to service issue"
    });
  }
};

// @desc    Generate AI safety tips
// @route   POST /api/ai/safety-tips
// @access  Private
const generateSafetyTips = async (req, res) => {
  try {
    const { destination, travelStyle, companions, season } = req.body;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: 'Please provide destination'
      });
    }

    const prompt = `Provide comprehensive safety tips for traveling to ${destination}. Travel style: ${travelStyle}. Companions: ${companions}. Season: ${season}.

Provide the response in this exact JSON format:
{
  "generalSafety": ["tip1", "tip2", "tip3"],
  "healthPrecautions": ["tip1", "tip2", "tip3"],
  "localLaws": ["tip1", "tip2", "tip3"],
  "emergencyContacts": ["contact1", "contact2", "contact3"],
  "scamAwareness": ["tip1", "tip2", "tip3"],
  "transportationSafety": ["tip1", "tip2", "tip3"]
}

Make the tips practical and specific.`;

    let safetyTips;

    // Try Google GenAI if initialized
    if (ai) {
      try {
        safetyTips = await callGeminiAPI(prompt, 'safety');
      } catch (apiError) {
        console.warn('Google GenAI failed, using enhanced fallback:', apiError.message);
        safetyTips = generateEnhancedSafetyTips(destination, travelStyle, companions, season);
      }
    } else {
      console.log('Using enhanced fallback data - Google GenAI not configured');
      safetyTips = generateEnhancedSafetyTips(destination, travelStyle, companions, season);
    }

    res.json({
      success: true,
      data: safetyTips,
      source: ai ? 'Google GenAI (Gemini 2.0)' : 'Enhanced Fallback Data'
    });

  } catch (error) {
    console.error('AI safety tips error:', error);
    
    const fallbackSafetyTips = generateEnhancedSafetyTips(
      req.body.destination,
      req.body.travelStyle,
      req.body.companions,
      req.body.season
    );

    res.json({
      success: true,
      data: fallbackSafetyTips,
      note: "Using enhanced fallback data due to service issue"
    });
  }
};

// Gemini AI API Caller using Google GenAI SDK
async function callGeminiAPI(prompt, type) {
  if (!ai) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: type === 'recommendation' ? 2000 : 1000,
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text;
    
    // Try to parse JSON from the response
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : responseText;
      
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.warn('Failed to parse Gemini response as JSON, using fallback:', parseError.message);
      throw new Error('Invalid JSON response from Gemini');
    }
  } catch (error) {
    console.error('Gemini API call failed:', error.message);
    throw error;
  }
}

// Enhanced Fallback Data Generators (Keep the same excellent fallback data)
function generateEnhancedRecommendation(budget = 'medium', place = 'Unknown', days = 3, travelStyle = 'balanced', companions = 'solo') {
  const budgetRanges = {
    low: { accommodation: "₹800 - ₹1,500", food: "₹300 - ₹600", activities: "₹500 - ₹1,000", transportation: "₹200 - ₹500" },
    medium: { accommodation: "₹1,500 - ₹3,000", food: "₹500 - ₹1,000", activities: "₹1,000 - ₹2,000", transportation: "₹300 - ₹800" },
    high: { accommodation: "₹3,000 - ₹6,000", food: "₹1,000 - ₹2,500", activities: "₹2,000 - ₹5,000", transportation: "₹500 - ₹1,500" }
  };

  const budgetRange = budgetRanges[budget] || budgetRanges.medium;
  
  const itinerary = Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    morning: `Explore ${place}'s famous landmarks and cultural sites`,
    afternoon: `Visit local markets and experience ${place} culture`,
    evening: `Enjoy authentic ${place} cuisine and local entertainment`,
    accommodation: `${budget} budget hotels or guesthouses`,
    meals: `Traditional ${place} dishes at local restaurants`
  }));

  return {
    itinerary,
    budgetBreakdown: {
      accommodation: `${budgetRange.accommodation} per night`,
      food: `${budgetRange.food} per day`,
      activities: `${budgetRange.activities} per day`,
      transportation: `${budgetRange.transportation} per day`,
      totalEstimate: `Approximately ₹${calculateTotalEstimate(budgetRange, days)} for ${days} days`
    },
    mustVisit: [
      `Historic landmarks in ${place}`,
      `Local markets and shopping districts`,
      `Cultural and religious sites`,
      `Natural attractions and parks`,
      `Museums and art galleries`
    ],
    localCuisine: [
      `Traditional ${place} specialty dishes`,
      `Popular street food items`,
      `Local desserts and sweets`,
      `Regional beverages and drinks`,
      `Famous restaurant recommendations`
    ],
    transportTips: `Use public transportation like buses and metro for budget travel. Consider ride-sharing apps for convenience. Pre-book intercity travel for better rates and availability.`,
    culturalNotes: `Respect local customs and traditions. Dress modestly when visiting religious sites. Learn basic local greetings. Be mindful of photography restrictions. Always ask permission before taking photos of people.`,
    packingSuggestions: [
      "Comfortable walking shoes",
      "Weather-appropriate clothing",
      "Essential medications and first aid",
      "Travel documents and copies",
      "Power bank and universal adapter",
      "Reusable water bottle",
      "Sunglasses and sunscreen",
      "Day backpack for excursions"
    ]
  };
}

function generateEnhancedPackingList(destination = 'Unknown', days = 3, season = 'summer', activities = ['sightseeing'], budget = 'medium') {
  const seasonSpecific = {
    summer: [
      "Light cotton t-shirts (4-5)",
      "Shorts and light pants",
      "Sun hat and sunglasses", 
      "Sunscreen SPF 50+",
      "Light jacket for AC areas"
    ],
    winter: [
      "Warm sweaters and jackets",
      "Thermal underwear",
      "Woolen caps and gloves",
      "Moisturizer and lip balm",
      "Warm socks and boots"
    ],
    monsoon: [
      "Raincoat or umbrella",
      "Quick-dry clothing",
      "Waterproof backpack cover",
      "Extra pairs of socks",
      "Waterproof shoes"
    ],
    spring: [
      "Light layers and jackets",
      "Comfortable walking shoes", 
      "Allergy medication",
      "Light scarf for breeze",
      "Versatile clothing options"
    ]
  };

  return {
    clothing: [
      ...(seasonSpecific[season] || seasonSpecific.summer),
      "Comfortable walking shoes",
      "Sleepwear",
      "Underwear (5-6 pairs)",
      "Socks (5-6 pairs)",
      "One formal outfit for nice restaurants"
    ].map(item => ({ item, completed: false })),
    toiletries: [
      { item: "Toothbrush and toothpaste", completed: false },
      { item: "Shampoo and conditioner", completed: false },
      { item: "Body soap or shower gel", completed: false },
      { item: "Deodorant", completed: false },
      { item: "Razor and shaving cream", completed: false },
      { item: "Hair brush or comb", completed: false },
      { item: "Skincare products", completed: false },
      { item: "Makeup (if applicable)", completed: false }
    ],
    electronics: [
      { item: "Smartphone and charger", completed: false },
      { item: "Power bank (10,000mAh+)", completed: false },
      { item: "Universal travel adapter", completed: false },
      { item: "Camera and accessories", completed: false },
      { item: "Headphones or earbuds", completed: false },
      { item: "E-book reader or tablet", completed: false }
    ],
    documents: [
      { item: "Passport/ID card", completed: false },
      { item: "Travel insurance documents", completed: false },
      { item: "Flight/train tickets", completed: false },
      { item: "Hotel booking confirmations", completed: false },
      { item: "Emergency contact list", completed: false },
      { item: "Credit/debit cards", completed: false },
      { item: "Driver's license (if renting vehicle)", completed: false }
    ],
    medications: [
      { item: "Prescription medications", completed: false },
      { item: "Pain relievers (aspirin/ibuprofen)", completed: false },
      { item: "Band-aids and antiseptic", completed: false },
      { item: "Motion sickness pills", completed: false },
      { item: "Allergy medication", completed: false },
      { item: "Diarrhea medication", completed: false },
      { item: "Cold and flu medicine", completed: false }
    ],
    miscellaneous: [
      { item: "Reusable water bottle", completed: false },
      { item: "Healthy snacks", completed: false },
      { item: "Book or magazine", completed: false },
      { item: "Travel pillow and eye mask", completed: false },
      { item: "Small backpack for day trips", completed: false },
      { item: "Travel laundry soap", completed: false },
      { item: "Ziplock bags", completed: false },
      { item: "Small flashlight", completed: false }
    ]
  };
}

function generateEnhancedSafetyTips(destination = 'Unknown', travelStyle = 'general', companions = 'solo', season = 'all year') {
  return {
    generalSafety: [
      "Keep valuables in hotel safe and carry only necessary cash",
      "Stay aware of your surroundings, especially in crowded tourist areas",
      "Make digital copies of passport and important documents",
      "Share your daily itinerary with family or friends back home",
      "Avoid displaying expensive jewelry, cameras, or electronics",
      "Use door stoppers or portable locks for added security"
    ],
    healthPrecautions: [
      "Drink only bottled or properly purified water",
      "Apply sunscreen regularly and stay hydrated throughout the day",
      "Carry all necessary medications with original prescriptions",
      "Wash hands frequently or use alcohol-based hand sanitizer",
      "Choose busy food vendors with high turnover for street food",
      "Get travel insurance that covers medical emergencies"
    ],
    localLaws: [
      "Research and respect local customs, traditions, and etiquette",
      "Dress appropriately for religious sites and conservative areas",
      "Always ask permission before photographing people or private property",
      "Understand and follow local traffic laws and regulations",
      "Be aware of restricted areas or activities for tourists",
      "Know the local emergency numbers and procedures"
    ],
    emergencyContacts: [
      "Local police: 100",
      "Medical emergency: 108 or 102", 
      "Fire department: 101",
      "Your country's embassy/consulate in destination",
      "Hotel front desk and security",
      "Local tour guide or fixer",
      "Travel insurance emergency line"
    ],
    scamAwareness: [
      "Be cautious of unsolicited help with luggage or directions",
      "Always verify prices before accepting services or making purchases",
      "Use only official transportation services and licensed tour guides",
      "Avoid too-good-to-be-true offers or deals from strangers",
      "Be wary of common distraction techniques in crowded areas",
      "Research common tourist scams in your destination beforehand"
    ],
    transportationSafety: [
      "Use licensed taxis or reputable ride-sharing services",
      "Avoid traveling alone late at night, especially in unfamiliar areas",
      "Keep vehicle doors locked and windows up while moving",
      "Note your driver's details and share with someone you trust",
      "Use well-lit and busy transportation hubs whenever possible",
      "Pre-book airport transfers for safe arrival and departure"
    ]
  };
}

// Helper functions
function calculateTotalEstimate(budgetRange, days) {
  const maxAcc = parseInt(budgetRange.accommodation.split('-')[1].replace(/[^0-9]/g, ''));
  const maxFood = parseInt(budgetRange.food.split('-')[1].replace(/[^0-9]/g, ''));
  const maxActivities = parseInt(budgetRange.activities.split('-')[1].replace(/[^0-9]/g, ''));
  const maxTransport = parseInt(budgetRange.transportation.split('-')[1].replace(/[^0-9]/g, ''));
  
  return ((maxAcc + maxFood + maxActivities + maxTransport) * days).toLocaleString();
}

module.exports = {
  recommendTrip,
  generatePackingList,
  generateSafetyTips
};