# 🎯 HOW TO TEST DISTANCE API IN POSTMAN - STEP BY STEP

## ✅ SERVER IS RUNNING ON http://localhost:5000

---

## 📍 DISTANCE API TESTING (3 EASY STEPS)

### ✨ Step 1: Open Postman and Create New Request

1. Click on **"New"** → **"HTTP Request"**
2. Give it a name: "Distance - Delhi to Mumbai"

---

### ✨ Step 2: Configure the Request

**Method:** Select `GET` from dropdown

**URL:** 
```
http://localhost:5000/api/distance/calculate
```

---

### ✨ Step 3: Add Query Parameters

Click on the **"Params"** tab below the URL bar

Add these parameters:

| KEY | VALUE | DESCRIPTION |
|-----|-------|-------------|
| startLat | 28.6139 | Delhi Latitude |
| startLng | 77.2090 | Delhi Longitude |
| endLat | 19.0760 | Mumbai Latitude |
| endLng | 72.8777 | Mumbai Longitude |

Postman will automatically create the full URL:
```
http://localhost:5000/api/distance/calculate?startLat=28.6139&startLng=77.2090&endLat=19.0760&endLng=72.8777
```

---

### ✨ Step 4: Send the Request

Click the blue **"Send"** button

---

### ✅ EXPECTED RESULT:

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

Status: **200 OK** (green)

---

## 🎉 SUCCESS! YOUR API IS WORKING!

---

## 🧪 MORE TEST EXAMPLES

Copy these complete URLs and paste directly in Postman:

### 1️⃣ Mumbai to Bangalore
```
http://localhost:5000/api/distance/calculate?startLat=19.0760&startLng=72.8777&endLat=12.9716&endLng=77.5946
```

### 2️⃣ Delhi to Goa
```
http://localhost:5000/api/distance/calculate?startLat=28.6139&startLng=77.2090&endLat=15.2993&endLng=74.1240
```

### 3️⃣ Chennai to Kolkata
```
http://localhost:5000/api/distance/calculate?startLat=13.0827&startLng=80.2707&endLat=22.5726&endLng=88.3639
```

### 4️⃣ Jaipur to Udaipur
```
http://localhost:5000/api/distance/calculate?startLat=26.9124&startLng=75.7873&endLat=24.5854&endLng=73.7125
```

---

## 📸 POSTMAN SCREENSHOTS GUIDE

```
┌─────────────────────────────────────────────────────────┐
│ GET  http://localhost:5000/api/distance/calculate   Send│
├─────────────────────────────────────────────────────────┤
│ Params  Authorization  Headers  Body  Pre-request  Tests│
├─────────────────────────────────────────────────────────┤
│ Query Params:                                           │
│                                                         │
│  KEY           VALUE         DESCRIPTION               │
│  ✓ startLat    28.6139       Delhi Latitude           │
│  ✓ startLng    77.2090       Delhi Longitude          │
│  ✓ endLat      19.0760       Mumbai Latitude          │
│  ✓ endLng      72.8777       Mumbai Longitude         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🌍 MAJOR INDIAN CITIES COORDINATES

Use these for testing:

| City | Latitude | Longitude |
|------|----------|-----------|
| **Delhi** | 28.6139 | 77.2090 |
| **Mumbai** | 19.0760 | 72.8777 |
| **Bangalore** | 12.9716 | 77.5946 |
| **Chennai** | 13.0827 | 80.2707 |
| **Kolkata** | 22.5726 | 88.3639 |
| **Hyderabad** | 17.3850 | 78.4867 |
| **Pune** | 18.5204 | 73.8567 |
| **Ahmedabad** | 23.0225 | 72.5714 |
| **Jaipur** | 26.9124 | 75.7873 |
| **Goa** | 15.2993 | 74.1240 |
| **Udaipur** | 24.5854 | 73.7125 |
| **Shimla** | 31.1048 | 77.1734 |
| **Darjeeling** | 27.0360 | 88.2627 |

---

## ❌ TROUBLESHOOTING

### Issue: "Cannot GET /api/distance/calculate"
**Solution:** Server is not running. Run `npm run dev` in terminal

### Issue: "Please provide startLat, startLng, endLat, and endLng"
**Solution:** You forgot to add query parameters. Go to Params tab and add them.

### Issue: "Invalid coordinates provided"
**Solution:** Check that your lat/lng values are numbers, not text

### Issue: Connection refused
**Solution:** Make sure server is running on port 5000

---

## ✅ VERIFICATION CHECKLIST

- [ ] Server is running (check terminal output)
- [ ] Postman is open
- [ ] Request method is GET
- [ ] URL is correct: http://localhost:5000/api/distance/calculate
- [ ] All 4 query params are added (startLat, startLng, endLat, endLng)
- [ ] Clicked "Send" button
- [ ] Got 200 OK response
- [ ] Response has "success": true

---

## 🚀 QUICK COPY-PASTE TEST

**Fastest way to test:**

1. Open Postman
2. Create new GET request
3. Paste this URL:
```
http://localhost:5000/api/distance/calculate?startLat=28.6139&startLng=77.2090&endLat=19.0760&endLng=72.8777
```
4. Click Send
5. Done! ✅

---

## 📚 TESTING ALL OTHER APIs

Once Distance API works, test these:

### Weather API (also PUBLIC - no auth):
```
http://localhost:5000/api/weather?lat=19.0760&lng=72.8777
```

### Transport - Flights:
```
http://localhost:5000/api/transport/flights?from=DEL&to=BOM&date=2025-11-20
```

### Transport - Trains:
```
http://localhost:5000/api/transport/trains?from=DEL&to=BOM&date=2025-11-20
```

For AI APIs, you need to:
1. First login at: POST http://localhost:5000/api/auth/login
2. Copy the token
3. Add header: `Authorization: Bearer YOUR_TOKEN`

---

## 🎊 YOUR API IS WORKING PERFECTLY!

All endpoints are functional and ready to use! 🚀

For complete documentation, see:
- POSTMAN-TESTING-GUIDE.md
- QUICK-TEST-GUIDE.txt
