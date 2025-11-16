const axios = require('axios');

// @desc    Calculate distance between two points
// @route   GET /api/distance/calculate
// @access  Public
const calculateDistance = async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng } = req.query;

    // Validation
    if (!startLat || !startLng || !endLat || !endLng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide startLat, startLng, endLat, and endLng'
      });
    }

    // Convert to numbers
    const startLatNum = parseFloat(startLat);
    const startLngNum = parseFloat(startLng);
    const endLatNum = parseFloat(endLat);
    const endLngNum = parseFloat(endLng);

    // Validate coordinates
    if (isNaN(startLatNum) || isNaN(startLngNum) || isNaN(endLatNum) || isNaN(endLngNum)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates provided'
      });
    }

    // Try OpenRouteService API first
    if (process.env.OPENROUTESERVICE_API_KEY && process.env.OPENROUTESERVICE_API_KEY !== 'your_openrouteservice_api_key_here') {
      try {
        const response = await axios.get(
          `https://api.openrouteservice.org/v2/directions/driving-car`,
          {
            params: {
              api_key: process.env.OPENROUTESERVICE_API_KEY,
              start: `${startLngNum},${startLatNum}`,
              end: `${endLngNum},${endLatNum}`
            },
            timeout: 10000
          }
        );

        if (response.data.features && response.data.features.length > 0) {
          const distance = response.data.features[0].properties.segments[0].distance / 1000; // Convert to km
          const duration = response.data.features[0].properties.segments[0].duration / 60; // Convert to minutes

          return res.json({
            success: true,
            data: {
              distance: distance.toFixed(2),
              duration: Math.ceil(duration),
              unit: 'km',
              source: 'OpenRouteService'
            }
          });
        }
      } catch (apiError) {
        console.warn('OpenRouteService API failed, using fallback:', apiError.message);
      }
    }

    // Fallback: Haversine formula calculation
    const distance = calculateHaversineDistance(startLatNum, startLngNum, endLatNum, endLngNum);
    const estimatedDuration = calculateEstimatedDuration(distance);

    res.json({
      success: true,
      data: {
        distance: distance.toFixed(2),
        duration: estimatedDuration,
        unit: 'km',
        source: 'Haversine Formula',
        note: 'Approximate straight-line distance'
      }
    });

  } catch (error) {
    console.error('Distance calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating distance',
      error: error.message
    });
  }
};

// Haversine formula for distance calculation
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Estimate travel time based on distance (assuming average speed)
function calculateEstimatedDuration(distance) {
  const averageSpeed = 60; // km/h
  const baseTime = (distance / averageSpeed) * 60; // minutes
  const bufferTime = distance * 0.5; // Additional time for traffic, stops etc.
  return Math.ceil(baseTime + bufferTime);
}

module.exports = {
  calculateDistance
};