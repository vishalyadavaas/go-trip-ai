const axios = require('axios');

// @desc    Get current weather for location
// @route   GET /api/weather
// @access  Public
const getCurrentWeather = async (req, res) => {
  try {
    let { lat, lng } = req.query;

    // Use default coordinates if not provided
    if (!lat || !lng) {
      lat = process.env.DEFAULT_LAT || '28.6139';
      lng = process.env.DEFAULT_LNG || '77.2090';
    }

    // Convert to numbers
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    // Validate coordinates
    if (isNaN(latNum) || isNaN(lngNum)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates provided'
      });
    }

    // Try OpenWeatherMap API
    if (process.env.OPENWEATHER_API_KEY && process.env.OPENWEATHER_API_KEY !== 'your_openweather_api_key_here') {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat: latNum,
              lon: lngNum,
              appid: process.env.OPENWEATHER_API_KEY,
              units: 'metric',
              lang: 'en'
            },
            timeout: 10000
          }
        );

        // SAFE ACCESS to response data with fallbacks
        const weatherData = {
          temperature: Math.round(response.data.main?.temp || 20),
          feelsLike: Math.round(response.data.main?.feels_like || 20),
          description: response.data.weather?.[0]?.description || 'Partly cloudy',
          icon: response.data.weather?.[0]?.icon || '02d', // Default icon
          humidity: response.data.main?.humidity || 50,
          windSpeed: response.data.wind?.speed || 5,
          windDirection: response.data.wind?.deg || 0,
          pressure: response.data.main?.pressure || 1013,
          visibility: response.data.visibility || 10000,
          cloudiness: response.data.clouds?.all || 40,
          city: response.data.name || `Location (${latNum.toFixed(2)}, ${lngNum.toFixed(2)})`,
          country: response.data.sys?.country || 'Unknown',
          coordinates: {
            lat: response.data.coord?.lat || latNum,
            lon: response.data.coord?.lon || lngNum
          }
        };

        return res.json({
          success: true,
          data: weatherData,
          source: 'OpenWeatherMap'
        });

      } catch (apiError) {
        console.warn('OpenWeatherMap API failed, using fallback:', apiError.message);
        // Continue to fallback mock data
      }
    }

    // Fallback: Mock weather data based on coordinates and season
    const mockWeather = generateMockWeather(latNum, lngNum);

    res.json({
      success: true,
      data: mockWeather,
      source: 'Mock Data',
      note: 'Using mock data due to API unavailability'
    });

  } catch (error) {
    console.error('Weather fetch error:', error);
    
    // Generate fallback data even in case of server error
    const fallbackWeather = generateMockWeather(
      parseFloat(lat) || 28.6139, 
      parseFloat(lng) || 77.2090
    );
    
    res.json({
      success: true,
      data: fallbackWeather,
      source: 'Fallback',
      note: 'Using fallback data due to server error'
    });
  }
};

// @desc    Get weather forecast
// @route   GET /api/weather/forecast
// @access  Public
const getWeatherForecast = async (req, res) => {
  try {
    let { lat, lng, days = 5 } = req.query;

    // Use default coordinates if not provided
    if (!lat || !lng) {
      lat = process.env.DEFAULT_LAT || '28.6139';
      lng = process.env.DEFAULT_LNG || '77.2090';
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    // Validate coordinates
    if (isNaN(latNum) || isNaN(lngNum)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates provided'
      });
    }

    // Try OpenWeatherMap forecast API
    if (process.env.OPENWEATHER_API_KEY && process.env.OPENWEATHER_API_KEY !== 'your_openweather_api_key_here') {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast`,
          {
            params: {
              lat: latNum,
              lon: lngNum,
              appid: process.env.OPENWEATHER_API_KEY,
              units: 'metric'
            },
            timeout: 10000
          }
        );

        // SAFE ACCESS with proper checks
        if (response.data && response.data.list && Array.isArray(response.data.list)) {
          // Group by day and take first entry of each day
          const forecast = response.data.list
            .filter((item, index) => index % 8 === 0) // Every 24 hours (3-hour intervals * 8)
            .slice(0, parseInt(days))
            .map(item => ({
              date: new Date(item.dt * 1000).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              }),
              timestamp: item.dt,
              temperature: Math.round(item.main?.temp || 20),
              feelsLike: Math.round(item.main?.feels_like || 20),
              description: item.weather?.[0]?.description || 'Partly cloudy',
              icon: item.weather?.[0]?.icon || '02d',
              humidity: item.main?.humidity || 50,
              windSpeed: item.wind?.speed || 5,
              pressure: item.main?.pressure || 1013
            }));

          return res.json({
            success: true,
            data: forecast,
            source: 'OpenWeatherMap'
          });
        }
      } catch (apiError) {
        console.warn('OpenWeatherMap forecast API failed, using fallback:', apiError.message);
      }
    }

    // Fallback: Mock forecast data
    const mockForecast = generateMockForecast(latNum, lngNum, parseInt(days));

    res.json({
      success: true,
      data: mockForecast,
      source: 'Mock Data',
      note: 'Using mock data due to API unavailability'
    });

  } catch (error) {
    console.error('Weather forecast error:', error);
    
    // Generate fallback forecast data
    const fallbackForecast = generateMockForecast(
      parseFloat(lat) || 28.6139, 
      parseFloat(lng) || 77.2090, 
      5
    );
    
    res.json({
      success: true,
      data: fallbackForecast,
      source: 'Fallback',
      note: 'Using fallback data due to server error'
    });
  }
};

// Helper function to generate mock weather data
function generateMockWeather(lat, lng) {
  const now = new Date();
  const month = now.getMonth();
  const isNorthern = lat > 0;
  
  // Determine season based on hemisphere and month
  let baseTemp;
  if (isNorthern) {
    if (month >= 2 && month <= 4) baseTemp = 20;
    else if (month >= 5 && month <= 7) baseTemp = 30;
    else if (month >= 8 && month <= 10) baseTemp = 15;
    else baseTemp = 5;
  } else {
    if (month >= 2 && month <= 4) baseTemp = 15;
    else if (month >= 5 && month <= 7) baseTemp = 5;
    else if (month >= 8 && month <= 10) baseTemp = 20;
    else baseTemp = 30;
  }

  // Adjust temperature based on latitude
  const latAdjustment = Math.abs(lat) / 90 * 30;
  const temperature = Math.round(baseTemp - latAdjustment + (Math.random() * 10 - 5));

  const weatherConditions = [
    { description: 'clear sky', icon: '01d' },
    { description: 'few clouds', icon: '02d' },
    { description: 'scattered clouds', icon: '03d' },
    { description: 'broken clouds', icon: '04d' },
    { description: 'light rain', icon: '10d' }
  ];

  const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

  return {
    temperature,
    feelsLike: temperature + Math.round(Math.random() * 4 - 2),
    description: condition.description,
    icon: condition.icon,
    humidity: 40 + Math.floor(Math.random() * 40),
    windSpeed: (1 + Math.random() * 10).toFixed(1),
    windDirection: Math.floor(Math.random() * 360),
    pressure: 1000 + Math.floor(Math.random() * 50),
    visibility: (5 + Math.random() * 15).toFixed(1),
    cloudiness: Math.floor(Math.random() * 100),
    city: `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
    country: 'Unknown',
    coordinates: { lat, lon: lng }
  };
}

// Helper function to generate mock forecast data
function generateMockForecast(lat, lng, days) {
  const forecast = [];
  const baseDate = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    
    const dailyWeather = generateMockWeather(lat, lng);
    forecast.push({
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      timestamp: Math.floor(date.getTime() / 1000),
      temperature: dailyWeather.temperature,
      feelsLike: dailyWeather.feelsLike,
      description: dailyWeather.description,
      icon: dailyWeather.icon,
      humidity: dailyWeather.humidity,
      windSpeed: dailyWeather.windSpeed,
      pressure: dailyWeather.pressure
    });
  }

  return forecast;
}

module.exports = {
  getCurrentWeather,
  getWeatherForecast
};