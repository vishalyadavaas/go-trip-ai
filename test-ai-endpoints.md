# AI Controller API Testing Guide

## Overview
The AI controller has been integrated with **Google GenAI SDK (Gemini 2.0)** as per the official documentation.

## Prerequisites

1. **Set up your Gemini API Key** in `.env` file:
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

Get your API key from: https://aistudio.google.com/apikey

2. **Start the server**:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The server should run on `http://localhost:5000` (or your configured PORT)

---

## API Endpoints

All AI endpoints require authentication. You need to include a valid JWT token in the Authorization header.

### Base URL
```
http://localhost:5000/api/ai
```

---

## 1. Trip Recommendations

**Endpoint:** `POST /api/ai/recommend-trip`

**Description:** Get AI-powered trip recommendations with detailed itinerary

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "budget": "medium",
  "place": "Paris",
  "days": 5,
  "travelStyle": "adventure",
  "companions": "friends"
}
```

**Parameters:**
- `budget` (required): "low" | "medium" | "high"
- `place` (required): destination name
- `days` (required): number of days (integer)
- `travelStyle` (optional): "adventure" | "relaxed" | "balanced" | "luxury"
- `companions` (optional): "solo" | "couple" | "family" | "friends"

**Response:**
```json
{
  "success": true,
  "data": {
    "itinerary": [
      {
        "day": 1,
        "morning": "Visit Eiffel Tower...",
        "afternoon": "Explore Louvre Museum...",
        "evening": "Seine River cruise...",
        "accommodation": "Mid-range hotel in Le Marais",
        "meals": "Traditional French breakfast..."
      }
    ],
    "budgetBreakdown": {
      "accommodation": "€80-150 per night",
      "food": "€40-70 per day",
      "activities": "€50-100 per day",
      "transportation": "€20-40 per day",
      "totalEstimate": "Approximately €950-1800 for 5 days"
    },
    "mustVisit": ["Eiffel Tower", "Louvre Museum", "Notre-Dame"],
    "localCuisine": ["Croissants", "Coq au Vin", "Crème Brûlée"],
    "transportTips": "Use Paris Metro for efficient travel...",
    "culturalNotes": "French people appreciate basic French greetings...",
    "packingSuggestions": ["Comfortable walking shoes", "Light jacket"]
  },
  "source": "Google GenAI (Gemini 2.0)"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/ai/recommend-trip \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "budget": "medium",
    "place": "Paris",
    "days": 5,
    "travelStyle": "adventure",
    "companions": "friends"
  }'
```

---

## 2. Packing List Generator

**Endpoint:** `POST /api/ai/packing-list`

**Description:** Generate AI-powered packing list tailored to destination and activities

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "destination": "Tokyo",
  "days": 7,
  "season": "winter",
  "activities": ["sightseeing", "hiking", "shopping"],
  "budget": "medium"
}
```

**Parameters:**
- `destination` (required): destination name
- `days` (required): trip duration in days
- `season` (required): "summer" | "winter" | "spring" | "monsoon"
- `activities` (optional): array of planned activities
- `budget` (optional): "low" | "medium" | "high"

**Response:**
```json
{
  "success": true,
  "data": {
    "clothing": [
      { "item": "Warm sweaters and jackets", "completed": false },
      { "item": "Thermal underwear", "completed": false }
    ],
    "toiletries": [
      { "item": "Toothbrush and toothpaste", "completed": false }
    ],
    "electronics": [
      { "item": "Smartphone and charger", "completed": false },
      { "item": "Power bank", "completed": false }
    ],
    "documents": [
      { "item": "Passport/ID card", "completed": false }
    ],
    "medications": [
      { "item": "Prescription medications", "completed": false }
    ],
    "miscellaneous": [
      { "item": "Reusable water bottle", "completed": false }
    ]
  },
  "source": "Google GenAI (Gemini 2.0)"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/ai/packing-list \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "destination": "Tokyo",
    "days": 7,
    "season": "winter",
    "activities": ["sightseeing", "hiking", "shopping"],
    "budget": "medium"
  }'
```

---

## 3. Safety Tips Generator

**Endpoint:** `POST /api/ai/safety-tips`

**Description:** Get comprehensive safety tips for your destination

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "destination": "Bangkok",
  "travelStyle": "adventure",
  "companions": "solo",
  "season": "summer"
}
```

**Parameters:**
- `destination` (required): destination name
- `travelStyle` (optional): travel style
- `companions` (optional): who you're traveling with
- `season` (optional): time of year

**Response:**
```json
{
  "success": true,
  "data": {
    "generalSafety": [
      "Keep valuables in hotel safe...",
      "Stay aware of your surroundings..."
    ],
    "healthPrecautions": [
      "Drink only bottled water...",
      "Apply sunscreen regularly..."
    ],
    "localLaws": [
      "Research local customs...",
      "Dress appropriately for temples..."
    ],
    "emergencyContacts": [
      "Tourist Police: 1155",
      "Medical emergency: 1669"
    ],
    "scamAwareness": [
      "Be cautious of tuk-tuk scams...",
      "Verify prices before purchasing..."
    ],
    "transportationSafety": [
      "Use licensed taxis or Grab app...",
      "Keep vehicle doors locked..."
    ]
  },
  "source": "Google GenAI (Gemini 2.0)"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/ai/safety-tips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "destination": "Bangkok",
    "travelStyle": "adventure",
    "companions": "solo",
    "season": "summer"
  }'
```

---

## Testing with Postman

### 1. First, get an authentication token:

**Login:**
```
POST http://localhost:5000/api/auth/login
```
Body:
```json
{
  "email": "your@email.com",
  "password": "yourpassword"
}
```

**OR Register:**
```
POST http://localhost:5000/api/auth/register
```
Body:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

Copy the `token` from the response.

### 2. Test AI endpoints:

In Postman:
1. Select `POST` method
2. Enter the endpoint URL (e.g., `http://localhost:5000/api/ai/recommend-trip`)
3. Go to **Headers** tab
   - Add: `Content-Type: application/json`
   - Add: `Authorization: Bearer YOUR_TOKEN_HERE`
4. Go to **Body** tab
   - Select `raw`
   - Select `JSON` from dropdown
   - Paste the request JSON
5. Click **Send**

---

## Testing without Authentication (for development)

If you want to test without auth temporarily, you can modify the route file:

In `routes/ai.js`, remove the `auth` middleware:
```javascript
router.post('/recommend-trip', recommendTrip);  // Remove 'auth' parameter
router.post('/packing-list', generatePackingList);
router.post('/safety-tips', generateSafetyTips);
```

**Remember to add it back for production!**

---

## Features

✅ **Google GenAI Integration** - Uses latest Gemini 2.0 Flash Experimental model
✅ **Fallback System** - Automatically uses enhanced fallback data if API fails
✅ **Error Handling** - Comprehensive error handling with detailed messages
✅ **JSON Response** - Configured to request JSON responses from AI
✅ **Authentication** - Secured with JWT tokens
✅ **Validation** - Request validation for required fields

---

## Technical Implementation

The controller uses the official `@google/genai` SDK v1.29.1:

```javascript
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: 'gemini-2.0-flash-exp',
  contents: prompt,
  config: {
    temperature: 0.7,
    maxOutputTokens: 2000,
    responseMimeType: 'application/json'
  }
});
```

---

## Troubleshooting

### 1. "Google GenAI not configured" in response
- Check if `GEMINI_API_KEY` is set in your `.env` file
- Verify the API key is valid
- Restart the server after adding the key

### 2. "Invalid JSON response from Gemini"
- The AI returned text that couldn't be parsed as JSON
- The fallback system will automatically provide data
- Check the console logs for details

### 3. 401 Unauthorized
- You need to login first and get a JWT token
- Include the token in Authorization header: `Bearer YOUR_TOKEN`

### 4. 400 Bad Request
- Check that all required fields are included in the request body
- Verify the field names match exactly

---

## Environment Variables

Make sure your `.env` file includes:

```env
# Required
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

# Optional
PORT=5000
NODE_ENV=development
```

---

## Next Steps

1. ✅ Google GenAI SDK integrated
2. ✅ Three working AI endpoints
3. Test with real API key
4. Monitor API usage and costs
5. Implement rate limiting if needed
6. Add request caching for common queries
7. Consider streaming responses for better UX

---

## Notes

- The `source` field in responses indicates whether data came from "Google GenAI (Gemini 2.0)" or "Enhanced Fallback Data"
- All endpoints have comprehensive fallback data for development/testing without API key
- The AI is configured with `temperature: 0.7` for balanced creativity and consistency
- JSON output format is enforced via `responseMimeType: 'application/json'`
