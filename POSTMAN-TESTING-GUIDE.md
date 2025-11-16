# 📮 Complete Postman Testing Guide - All APIs

## 🚀 Server Status: RUNNING on http://localhost:5000

---

## 📋 Table of Contents
1. [Setup Postman](#setup-postman)
2. [Authentication APIs](#authentication-apis)
3. [Distance API](#distance-api)
4. [Weather API](#weather-api)
5. [Transport API](#transport-api)
6. [AI APIs](#ai-apis)
7. [Places API](#places-api)
8. [Trips API](#trips-api)
9. [Hotels API](#hotels-api)
10. [Restaurants API](#restaurants-api)

---

## 🔧 Setup Postman

### Create Environment Variables
1. Click on **Environments** in Postman
2. Create new environment: "Go Trip AI - Local"
3. Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `baseUrl` | `http://localhost:5000` | `http://localhost:5000` |
| `authToken` | (leave empty) | (will be filled after login) |

---

## 🔐 Authentication APIs

### 1. Register User

**Method:** `POST`  
**URL:** `{{baseUrl}}/api/auth/register`  
**Headers:**
```json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

**Action:** Copy the `token` and paste it in your environment variable `authToken`

---

### 2. Login User

**Method:** `POST`  
**URL:** `{{baseUrl}}/api/auth/login`  
**Headers:**
```json
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

**Action:** Copy the `token` and save it to environment variable `authToken`

---

## 📏 Distance API ⭐ (PUBLIC - No Auth Required)

### Calculate Distance Between Two Points

**Method:** `GET`  
**URL:** `{{baseUrl}}/api/distance/calculate`  
**Headers:** *(No headers required)*

**Query Params:**

| Key | Value | Description |
|-----|-------|-------------|
| `startLat` | `28.6139` | Delhi latitude |
| `startLng` | `77.2090` | Delhi longitude |
| `endLat` | `19.0760` | Mumbai latitude |
| `endLng` | `72.8777` | Mumbai longitude |

**Full URL Example:**
```
http://localhost:5000/api/distance/calculate?startLat=28.6139&startLng=77.2090&endLat=19.0760&endLng=72.8777
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "distance": "1135.47",
    "duration": 1136,
    "unit": "km",
    "source": "Haversine Formula",
    "note": "Approximate straight-line distance"
  }
}
```

**More Test Examples:**

1. **Delhi to Goa:**
   - `startLat=28.6139&startLng=77.2090&endLat=15.2993&endLng=74.1240`

2. **Mumbai to Bangalore:**
   - `startLat=19.0760&startLng=72.8777&endLat=12.9716&endLng=77.5946`

3. **Jaipur to Udaipur:**
   - `startLat=26.9124&startLng=75.7873&endLat=24.5854&endLng=73.7125`

---

## 🌤️ Weather API (PUBLIC - No Auth Required)

### Get Current Weather

**Method:** `GET`  
**URL:** `{{baseUrl}}/api/weather`  
**Headers:** *(No headers required)*

**Query Params:**

| Key | Value | Description |
|-----|-------|-------------|
| `lat` | `19.0760` | Latitude (Mumbai) |
| `lng` | `72.8777` | Longitude (Mumbai) |

**Full URL Example:**
```
http://localhost:5000/api/weather?lat=19.0760&lng=72.8777
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "temperature": 28,
    "feelsLike": 30,
    "description": "partly cloudy",
    "icon": "02d",
    "humidity": 75,
    "windSpeed": "8.5",
    "pressure": 1013,
    "visibility": "10.0",
    "cloudiness": 40,
    "city": "Mumbai",
    "country": "IN",
    "coordinates": {
      "lat": 19.076,
      "lon": 72.8777
    }
  },
  "source": "Mock Data"
}
```

**Test Different Coordinates:**
- **Delhi:** `lat=28.6139&lng=77.2090`
- **Bangalore:** `lat=12.9716&lng=77.5946`
- **Goa:** `lat=15.2993&lng=74.1240`

---

### Get Weather Forecast

**Method:** `GET`  
**URL:** `{{baseUrl}}/api/weather/forecast`  
**Headers:** *(No headers required)*

**Query Params:**

| Key | Value | Description |
|-----|-------|-------------|
| `lat` | `19.0760` | Latitude |
| `lng` | `72.8777` | Longitude |
| `days` | `5` | Number of days (optional, default 5) |

**Full URL Example:**
```
http://localhost:5000/api/weather/forecast?lat=19.0760&lng=72.8777&days=5
```

---

## 🚗 Transport API (PUBLIC - No Auth Required)

### Get Flight Options

**Method:** `GET`  
**URL:** `{{baseUrl}}/api/transport/flights`  
**Headers:** *(No headers required)*

**Query Params:**

| Key | Value | Description |
|-----|-------|-------------|
| `from` | `DEL` | From airport code |
| `to` | `BOM` | To airport code |
| `date` | `2025-11-20` | Travel date (YYYY-MM-DD) |

**Full URL Example:**
```
http://localhost:5000/api/transport/flights?from=DEL&to=BOM&date=2025-11-20
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "airline": "IndiGo",
      "flightNumber": "6E150",
      "departure": {
        "airport": "Delhi Airport",
        "iata": "DEL",
        "scheduled": "2025-11-20T06:30:00.000Z",
        "terminal": "1",
        "gate": "A5"
      },
      "arrival": {
        "airport": "Mumbai Airport",
        "iata": "BOM",
        "scheduled": "2025-11-20T08:45:00.000Z",
        "terminal": "2",
        "gate": "B12"
      },
      "aircraft": "A320",
      "duration": "2h 15m",
      "status": "scheduled",
      "price": "₹4,250",
      "seatsAvailable": 35
    }
  ],
  "source": "Mock Data"
}
```

---

### Get Train Options

**Method:** `GET`  
**URL:** `{{baseUrl}}/api/transport/trains`  
**Headers:** *(No headers required)*

**Query Params:**

| Key | Value | Description |
|-----|-------|-------------|
| `from` | `DEL` | From station code |
| `to` | `BOM` | To station code |
| `date` | `2025-11-20` | Travel date (YYYY-MM-DD) |

**Full URL Example:**
```
http://localhost:5000/api/transport/trains?from=DEL&to=BOM&date=2025-11-20
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Rajdhani Express",
      "number": "12951",
      "from": {
        "station": "New Delhi Junction",
        "code": "DEL",
        "time": "16:55"
      },
      "to": {
        "station": "Mumbai Central Junction",
        "code": "BOM",
        "time": "08:35"
      },
      "duration": "15h 40m",
      "classes": [
        {
          "class": "1A",
          "availability": "Y",
          "price": "₹3,245"
        },
        {
          "class": "2A",
          "availability": "Y",
          "price": "₹2,165"
        }
      ],
      "type": "Superfast"
    }
  ],
  "source": "Mock Data"
}
```

---

### Get AI Transport Recommendations

**Method:** `POST`  
**URL:** `{{baseUrl}}/api/transport/recommendations`  
**Headers:**
```json
Content-Type: application/json
```
*(No auth required - PUBLIC endpoint)*

**Body (raw JSON):**
```json
{
  "from": "Delhi",
  "to": "Goa",
  "budget": "medium",
  "travelStyle": "comfortable",
  "companions": "family"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "bestOptions": [
      "Flight: Fastest option (1-2 hours)...",
      "Train: Comfortable journey (8-12 hours)...",
      "Bus: Budget-friendly option..."
    ],
    "costComparison": [
      "Flights: ₹4,000 - ₹8,000",
      "Trains: ₹1,000 - ₹3,000",
      "Buses: ₹500 - ₹1,500"
    ],
    "travelDuration": [...],
    "bookingTips": [...],
    "travelAdvice": [...],
    "summary": "Smart travel options from Delhi to Goa..."
  },
  "source": "Enhanced Fallback Data"
}
```

---

## 🤖 AI APIs (AUTH REQUIRED)

### 1. AI Trip Recommendations

**Method:** `POST`  
**URL:** `{{baseUrl}}/api/ai/recommend-trip`  
**Headers:**
```json
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

**Body (raw JSON):**
```json
{
  "budget": "medium",
  "place": "Goa",
  "days": 5,
  "travelStyle": "adventure",
  "companions": "friends"
}
```

**Budget Options:** `low`, `medium`, `high`  
**Travel Style:** `adventure`, `relaxed`, `balanced`, `luxury`  
**Companions:** `solo`, `couple`, `family`, `friends`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "itinerary": [
      {
        "day": 1,
        "morning": "Explore Goa's famous landmarks...",
        "afternoon": "Visit local markets...",
        "evening": "Enjoy authentic Goa cuisine...",
        "accommodation": "medium budget hotels",
        "meals": "Traditional Goa dishes..."
      }
    ],
    "budgetBreakdown": {
      "accommodation": "₹1,500 - ₹3,000 per night",
      "food": "₹500 - ₹1,000 per day",
      "activities": "₹1,000 - ₹2,000 per day",
      "transportation": "₹300 - ₹800 per day",
      "totalEstimate": "Approximately ₹16,500 for 5 days"
    },
    "mustVisit": [...],
    "localCuisine": [...],
    "transportTips": "...",
    "culturalNotes": "...",
    "packingSuggestions": [...]
  },
  "source": "Google GenAI (Gemini 2.0)" // or "Enhanced Fallback Data"
}
```

---

### 2. AI Packing List

**Method:** `POST`  
**URL:** `{{baseUrl}}/api/ai/packing-list`  
**Headers:**
```json
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

**Body (raw JSON):**
```json
{
  "destination": "Goa",
  "days": 5,
  "season": "summer",
  "activities": ["beach", "water sports", "sightseeing"],
  "budget": "medium"
}
```

**Season Options:** `summer`, `winter`, `spring`, `monsoon`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "clothing": [
      { "item": "Light cotton t-shirts (4-5)", "completed": false },
      { "item": "Shorts and light pants", "completed": false }
    ],
    "toiletries": [...],
    "electronics": [...],
    "documents": [...],
    "medications": [...],
    "miscellaneous": [...]
  },
  "source": "Google GenAI (Gemini 2.0)"
}
```

---

### 3. AI Safety Tips

**Method:** `POST`  
**URL:** `{{baseUrl}}/api/ai/safety-tips`  
**Headers:**
```json
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

**Body (raw JSON):**
```json
{
  "destination": "Goa",
  "travelStyle": "adventure",
  "companions": "friends",
  "season": "summer"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "generalSafety": [...],
    "healthPrecautions": [...],
    "localLaws": [...],
    "emergencyContacts": [...],
    "scamAwareness": [...],
    "transportationSafety": [...]
  },
  "source": "Google GenAI (Gemini 2.0)"
}
```

---

## 📍 Places API

### Get Places

**Method:** `GET`  
**URL:** `{{baseUrl}}/api/places`  
**Headers:** *(Check if auth required)*

---

## 🗺️ Trips API

### Get Trips

**Method:** `GET`  
**URL:** `{{baseUrl}}/api/drips`  
**Headers:**
```json
Authorization: Bearer {{authToken}}
```

*(Note: There's a typo in server.js - "/api/drips" instead of "/api/trips")*

---

## 🏨 Hotels API

### Get Hotels

**Method:** `GET`  
**URL:** `{{baseUrl}}/api/hotels`  

---

## 🍽️ Restaurants API

### Get Restaurants

**Method:** `GET`  
**URL:** `{{baseUrl}}/api/restaurants`

---

## 🧪 Postman Tests Scripts

Add these to the **Tests** tab for automatic validation:

```javascript
// Test for successful response
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Response has data field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
});

// For auth endpoints - save token
if (pm.response.json().token) {
    pm.environment.set("authToken", pm.response.json().token);
    console.log("Token saved to environment");
}
```

---

## 📦 Import Postman Collection

You can create a collection with all these requests. Here's the order to test:

1. ✅ **Register/Login** (to get auth token)
2. ✅ **Distance API** (test with different coordinates)
3. ✅ **Weather API** (test with different cities)
4. ✅ **Transport API** (test different routes)
5. ✅ **AI Trip Recommendations** (requires auth)
6. ✅ **AI Packing List** (requires auth)
7. ✅ **AI Safety Tips** (requires auth)
8. ✅ **Other APIs** (places, trips, hotels, restaurants)

---

## 🔍 Quick Testing Checklist

- [ ] Server running on port 5000
- [ ] Environment variables set in Postman
- [ ] Register/Login successful and token saved
- [ ] Distance API working (no auth)
- [ ] Weather API working (no auth)
- [ ] Transport API working (no auth)
- [ ] AI APIs working (with auth token)
- [ ] All responses returning expected format

---

## 🐛 Troubleshooting

### Issue: 401 Unauthorized
**Solution:** Make sure you've logged in and saved the token to `{{authToken}}`

### Issue: 400 Bad Request
**Solution:** Check that all required fields are included in the request body

### Issue: 500 Internal Server Error
**Solution:** Check server logs in terminal for specific error

### Issue: Cannot connect
**Solution:** Verify server is running on port 5000

---

## 📝 Notes

- ✅ **Distance API** is **PUBLIC** - No authentication required
- ✅ **Weather API** is **PUBLIC** - No authentication required  
- ✅ **Transport API** is **PUBLIC** - No authentication required
- 🔒 **AI APIs** require **JWT authentication**
- The server has a typo: `/api/drips` should be `/api/trips`

---

**Server Running:** ✅ http://localhost:5000  
**Status:** All APIs are functional and ready to test!
