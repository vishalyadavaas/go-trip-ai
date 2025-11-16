const axios = require('axios');

// Google Gemini Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// @desc    Get flight options
// @route   GET /api/transport/flights
// @access  Public
const getFlights = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    // Validation
    if (!from || !to || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide from, to, and date parameters'
      });
    }

    // Validate date format
    const travelDate = new Date(date);
    if (isNaN(travelDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // Generate mock flight data
    const mockFlights = generateMockFlights(from, to, date);

    res.json({
      success: true,
      data: mockFlights,
      source: 'Mock Data',
      note: 'Using mock flight data'
    });

  } catch (error) {
    console.error('Flights fetch error:', error);
    
    // Generate fallback data even in case of error
    const fallbackFlights = generateMockFlights(
      req.query.from || 'DEL', 
      req.query.to || 'BOM', 
      req.query.date || new Date().toISOString().split('T')[0]
    );
    
    res.json({
      success: true,
      data: fallbackFlights,
      source: 'Fallback',
      note: 'Using fallback data due to server error'
    });
  }
};

// @desc    Get train options
// @route   GET /api/transport/trains
// @access  Public
const getTrains = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    // Validation
    if (!from || !to || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide from, to, and date parameters'
      });
    }

    // Generate mock train data
    const mockTrains = generateMockTrains(from, to, date);

    res.json({
      success: true,
      data: mockTrains,
      source: 'Mock Data',
      note: 'Using mock train data'
    });

  } catch (error) {
    console.error('Trains fetch error:', error);
    
    // Generate fallback data even in case of error
    const fallbackTrains = generateMockTrains(
      req.query.from || 'DEL', 
      req.query.to || 'BOM', 
      req.query.date || new Date().toISOString().split('T')[0]
    );
    
    res.json({
      success: true,
      data: fallbackTrains,
      source: 'Fallback',
      note: 'Using fallback data due to server error'
    });
  }
};

// @desc    Get AI travel recommendations for transport
// @route   POST /api/transport/recommendations
// @access  Public
const getTransportRecommendations = async (req, res) => {
  try {
    const { from, to, budget, travelStyle, companions } = req.body;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Please provide from and to locations'
      });
    }

    const prompt = `As a travel expert, provide transportation recommendations for traveling from ${from} to ${to}. 
Budget: ${budget || 'medium'}. Travel style: ${travelStyle || 'comfortable'}. Companions: ${companions || 'solo'}.

Please provide recommendations for:

BEST TRANSPORT OPTIONS:
- [Option 1 with details]
- [Option 2 with details] 
- [Option 3 with details]

COST COMPARISON:
- [Transport mode 1]: [Price range]
- [Transport mode 2]: [Price range]
- [Transport mode 3]: [Price range]

TRAVEL DURATION:
- [Fastest option]: [Time]
- [Cheapest option]: [Time]
- [Most comfortable]: [Time]

BOOKING TIPS:
- [Tip 1]
- [Tip 2]
- [Tip 3]

TRAVEL ADVICE:
- [Advice 1]
- [Advice 2]
- [Advice 3]`;

    let recommendations;

    // Try Google Gemini if API key is available
    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        const aiResponse = await callGeminiAPI(prompt, 'transport');
        recommendations = parseTransportRecommendations(aiResponse, from, to, budget, travelStyle, companions);
      } catch (apiError) {
        console.warn('Gemini AI failed, using enhanced fallback:', apiError.message);
        recommendations = generateEnhancedTransportRecommendations(from, to, budget, travelStyle, companions);
      }
    } else {
      console.log('Using enhanced fallback data - Gemini API key not configured');
      recommendations = generateEnhancedTransportRecommendations(from, to, budget, travelStyle, companions);
    }

    res.json({
      success: true,
      data: recommendations,
      source: GEMINI_API_KEY ? 'Google Gemini' : 'Enhanced Fallback Data'
    });

  } catch (error) {
    console.error('Transport recommendations error:', error);
    
    const fallbackRecommendations = generateEnhancedTransportRecommendations(
      req.body.from,
      req.body.to, 
      req.body.budget,
      req.body.travelStyle,
      req.body.companions
    );

    res.json({
      success: true,
      data: fallbackRecommendations,
      note: "Using enhanced fallback data due to service issue"
    });
  }
};

// Google Gemini API Caller for transport recommendations
async function callGeminiAPI(prompt, type) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topP: 0.8,
          topK: 40
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );

    if (response.data && response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API call failed:', error.response?.data || error.message);
    throw error;
  }
}

// Parse transport recommendations from AI response
function parseTransportRecommendations(text, from, to, budget, travelStyle, companions) {
  try {
    // Extract transport options
    const optionsMatch = text.match(/BEST TRANSPORT OPTIONS:([^-]+?)(?=\n\n|$)/is);
    const costMatch = text.match(/COST COMPARISON:([^-]+?)(?=\n\n|$)/is);
    const durationMatch = text.match(/TRAVEL DURATION:([^-]+?)(?=\n\n|$)/is);
    const tipsMatch = text.match(/BOOKING TIPS:([^-]+?)(?=\n\n|$)/is);
    const adviceMatch = text.match(/TRAVEL ADVICE:([^-]+?)(?=\n\n|$)/is);

    return {
      bestOptions: extractListItems(optionsMatch ? optionsMatch[1] : '', 3),
      costComparison: extractListItems(costMatch ? costMatch[1] : '', 3),
      travelDuration: extractListItems(durationMatch ? durationMatch[1] : '', 3),
      bookingTips: extractListItems(tipsMatch ? tipsMatch[1] : '', 3),
      travelAdvice: extractListItems(adviceMatch ? adviceMatch[1] : '', 3),
      summary: `AI-recommended transport options from ${from} to ${to} for ${companions} with ${budget} budget`
    };
  } catch (error) {
    console.warn('Failed to parse AI transport recommendations, using fallback:', error.message);
    return generateEnhancedTransportRecommendations(from, to, budget, travelStyle, companions);
  }
}

// Enhanced fallback transport recommendations
function generateEnhancedTransportRecommendations(from, to, budget = 'medium', travelStyle = 'comfortable', companions = 'solo') {
  const budgetRanges = {
    low: {
      flight: "₹3,000 - ₹6,000",
      train: "₹500 - ₹2,000", 
      bus: "₹300 - ₹1,000",
      car: "₹2,000 - ₹4,000"
    },
    medium: {
      flight: "₹4,000 - ₹8,000",
      train: "₹1,000 - ₹3,000",
      bus: "₹500 - ₹1,500", 
      car: "₹3,000 - ₹6,000"
    },
    high: {
      flight: "₹6,000 - ₹15,000",
      train: "₹2,000 - ₹5,000",
      bus: "₹800 - ₹2,000",
      car: "₹5,000 - ₹10,000"
    }
  };

  const budgetRange = budgetRanges[budget] || budgetRanges.medium;

  return {
    bestOptions: [
      `Flight: Fastest option (1-2 hours) from ${getAirportName(from)} to ${getAirportName(to)}`,
      `Train: Comfortable journey (8-12 hours) with scenic views and meals`,
      `Bus: Budget-friendly option (10-14 hours) with overnight travel available`,
      `Car: Flexible road trip (8-10 hours) with stopover possibilities`
    ],
    costComparison: [
      `Flights: ${budgetRange.flight}`,
      `Trains: ${budgetRange.train}`,
      `Buses: ${budgetRange.bus}`,
      `Car rental: ${budgetRange.car}`
    ],
    travelDuration: [
      `Flights: 1-2 hours (fastest)`,
      `Trains: 8-12 hours (most comfortable)`,
      `Buses: 10-14 hours (most economical)`,
      `Car: 8-10 hours (most flexible)`
    ],
    bookingTips: [
      `Book flights 2-3 weeks in advance for best prices`,
      `Check train availability and book AC classes for comfort`,
      `Look for overnight buses to save on accommodation`,
      `Compare rental car companies for best deals and insurance`
    ],
    travelAdvice: [
      `For ${companions} travel, consider ${travelStyle} options that suit your group`,
      `Carry essential snacks and entertainment for long journeys`,
      `Check weather conditions and travel advisories before departure`,
      `Keep important documents and medications in carry-on luggage`
    ],
    summary: `Smart travel options from ${from} to ${to} tailored for ${companions} with ${budget} budget and ${travelStyle} preferences`
  };
}

// Helper function to extract list items from text
function extractListItems(text, maxItems) {
  const items = text.split('\n')
    .map(line => line.replace(/^-|\*|\d+\./, '').trim())
    .filter(line => line.length > 10 && !line.includes(':'))
    .slice(0, maxItems);
  
  return items.length > 0 ? items : Array.from({ length: maxItems }, (_, i) => `Recommendation ${i + 1}`);
}

// Helper function to generate mock flight data
function generateMockFlights(from, to, date) {
  const airlines = [
    'Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'AirAsia',
    'Emirates', 'Qatar Airways', 'Singapore Airlines', 'British Airways'
  ];

  const flights = [];
  const numFlights = 3 + Math.floor(Math.random() * 4); // 3-6 flights

  for (let i = 0; i < numFlights; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const departureTime = new Date(date);
    departureTime.setHours(6 + i * 3, Math.floor(Math.random() * 60));
    
    const arrivalTime = new Date(departureTime);
    arrivalTime.setHours(arrivalTime.getHours() + 2 + Math.floor(Math.random() * 4));

    const basePrice = 3000 + Math.floor(Math.random() * 7000);
    const price = `₹${basePrice.toLocaleString()}`;

    // Calculate duration in hours and minutes
    const durationMs = arrivalTime - departureTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    flights.push({
      airline,
      flightNumber: `${getAirlineCode(airline)}${100 + i * 50}`,
      departure: {
        airport: `${getAirportName(from)} Airport`,
        iata: from.toUpperCase(),
        scheduled: departureTime.toISOString(),
        terminal: ['1', '2', '3'][Math.floor(Math.random() * 3)],
        gate: `A${Math.floor(Math.random() * 20) + 1}`
      },
      arrival: {
        airport: `${getAirportName(to)} Airport`,
        iata: to.toUpperCase(),
        scheduled: arrivalTime.toISOString(),
        terminal: ['1', '2', '3'][Math.floor(Math.random() * 3)],
        gate: `B${Math.floor(Math.random() * 20) + 1}`
      },
      aircraft: ['A320', 'B737', 'A321', 'B787'][Math.floor(Math.random() * 4)],
      duration: `${hours}h ${minutes}m`,
      status: 'scheduled',
      price,
      seatsAvailable: Math.floor(Math.random() * 50) + 10
    });
  }

  // Sort flights by departure time
  return flights.sort((a, b) => new Date(a.departure.scheduled) - new Date(b.departure.scheduled));
}

// Helper function to generate mock train data
function generateMockTrains(from, to, date) {
  const trainNames = [
    'Rajdhani Express', 'Shatabdi Express', 'Duronto Express', 'Garib Rath',
    'Jan Shatabdi', 'Tejas Express', 'Vande Bharat', 'Intercity Express'
  ];

  const trains = [];
  const numTrains = 2 + Math.floor(Math.random() * 3); // 2-4 trains

  for (let i = 0; i < numTrains; i++) {
    const trainName = trainNames[Math.floor(Math.random() * trainNames.length)];
    const departureTime = new Date(date);
    departureTime.setHours(6 + i * 4, Math.floor(Math.random() * 60));
    
    const arrivalTime = new Date(departureTime);
    arrivalTime.setHours(arrivalTime.getHours() + 4 + Math.floor(Math.random() * 8));

    const durationMs = arrivalTime - departureTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const duration = `${hours}h ${minutes}m`;

    const classes = [
      { class: '1A', availability: 'Y', price: `₹${(2499 + Math.floor(Math.random() * 1000)).toLocaleString()}` },
      { class: '2A', availability: 'Y', price: `₹${(1799 + Math.floor(Math.random() * 800)).toLocaleString()}` },
      { class: '3A', availability: Math.random() > 0.3 ? 'Y' : 'N', price: `₹${(1299 + Math.floor(Math.random() * 600)).toLocaleString()}` },
      { class: 'SL', availability: 'Y', price: `₹${(699 + Math.floor(Math.random() * 300)).toLocaleString()}` }
    ];

    trains.push({
      name: trainName,
      number: `12${Math.floor(Math.random() * 900) + 100}`,
      from: {
        station: `${getStationName(from)} Junction`,
        code: from.toUpperCase(),
        time: departureTime.toTimeString().substring(0, 5)
      },
      to: {
        station: `${getStationName(to)} Junction`, 
        code: to.toUpperCase(),
        time: arrivalTime.toTimeString().substring(0, 5)
      },
      duration,
      classes,
      type: ['Superfast', 'Mail', 'Express'][Math.floor(Math.random() * 3)]
    });
  }

  // Sort trains by departure time
  return trains.sort((a, b) => a.from.time.localeCompare(b.from.time));
}

// Helper function to get airline code
function getAirlineCode(airlineName) {
  const codes = {
    'Air India': 'AI',
    'IndiGo': '6E',
    'SpiceJet': 'SG',
    'Vistara': 'UK',
    'AirAsia': 'I5',
    'Emirates': 'EK',
    'Qatar Airways': 'QR',
    'Singapore Airlines': 'SQ',
    'British Airways': 'BA'
  };
  return codes[airlineName] || 'FL';
}

// Helper function to get airport name
function getAirportName(iataCode) {
  const airports = {
    'DEL': 'Delhi',
    'BOM': 'Mumbai',
    'MAA': 'Chennai',
    'BLR': 'Bangalore',
    'HYD': 'Hyderabad',
    'CCU': 'Kolkata',
    'AMD': 'Ahmedabad',
    'PNQ': 'Pune'
  };
  return airports[iataCode] || iataCode;
}

// Helper function to get station name
function getStationName(code) {
  const stations = {
    'DEL': 'New Delhi',
    'BOM': 'Mumbai Central',
    'MAA': 'Chennai Central',
    'BLR': 'Bangalore',
    'HYD': 'Hyderabad',
    'CCU': 'Kolkata',
    'AMD': 'Ahmedabad',
    'PNQ': 'Pune'
  };
  return stations[code] || code;
}

module.exports = {
  getFlights,
  getTrains,
  getTransportRecommendations
};