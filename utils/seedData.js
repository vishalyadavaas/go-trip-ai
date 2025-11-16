// backend/utils/seedData.js
const mongoose = require('mongoose');
const Place = require('../models/Place');
const Hotel = require('../models/hotel.model');
const Restaurant = require('../models/restaurant.model');
require('dotenv').config();

const samplePlaces = [
  {
    name: "Goa Beach",
    description: "Famous for its pristine beaches, vibrant nightlife, and Portuguese heritage. Goa offers a perfect blend of relaxation and entertainment with stunning coastline, colonial architecture, and delicious seafood.",
    city: "Goa",
    state: "Goa",
    country: "India",
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800"
    ],
    coordinates: {
      lat: 15.2993,
      lng: 74.1240
    },
    bestSeason: "November to February",
    rating: 4.5,
    tips: [
      "Try local seafood dishes at beach shacks",
      "Visit during off-season for better deals and fewer crowds",
      "Rent a scooter for easy transportation around beaches",
      "Don't miss the Saturday Night Market in Arpora",
      "Visit both North and South Goa for different experiences"
    ],
    category: "beach",
    budget: "medium",
    featured: true,
    popularity: 95,
    tags: ["beach", "nightlife", "seafood", "portuguese", "shacks"],
    idealDuration: "4-5 days",
    activities: ["Beach Hopping", "Water Sports", "Dolphin Watching", "Nightlife", "Shopping"],
    weather: {
      summer: { min: 25, max: 33, description: "Hot and humid" },
      winter: { min: 20, max: 31, description: "Pleasant and sunny" },
      monsoon: { min: 24, max: 29, description: "Heavy rainfall" }
    }
  },
  {
    name: "Manali",
    description: "Nestled in the Himalayas, Manali is a picturesque hill station known for its snow-capped mountains, lush valleys, and adventure sports. A perfect destination for nature lovers and thrill-seekers alike.",
    city: "Manali",
    state: "Himachal Pradesh",
    country: "India",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
      "https://images.unsplash.com/photo-1578645510447-e4b6594c972f?w=800",
      "https://images.unsplash.com/photo-1569941554646-783ce9349e6e?w=800",
      "https://images.unsplash.com/photo-1599561217509-0edd13c5d0e5?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
    ],
    coordinates: {
      lat: 32.2396,
      lng: 77.1887
    },
    bestSeason: "October to June",
    rating: 4.3,
    tips: [
      "Carry warm clothes even in summer months",
      "Try paragliding and zorbing in Solang Valley",
      "Visit Hadimba Temple and ancient caves",
      "Acclimatize properly to avoid altitude sickness",
      "Book adventure activities through registered operators"
    ],
    category: "mountain",
    budget: "low",
    featured: true,
    popularity: 88,
    tags: ["himalayas", "snow", "adventure", "trekking", "hills"],
    idealDuration: "3-4 days",
    activities: ["Paragliding", "Trekking", "Skiing", "Temple Visit", "River Rafting"],
    weather: {
      summer: { min: 10, max: 25, description: "Pleasant and cool" },
      winter: { min: -7, max: 10, description: "Extremely cold with snowfall" },
      monsoon: { min: 15, max: 22, description: "Moderate rainfall" }
    }
  },
  {
    name: "Taj Mahal",
    description: "An ivory-white marble mausoleum and one of the Seven Wonders of the World, symbolizing eternal love. Built by Emperor Shah Jahan in memory of his wife Mumtaz Mahal, it's an architectural masterpiece.",
    city: "Agra",
    state: "Uttar Pradesh",
    country: "India",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
      "https://images.unsplash.com/photo-1599732419884-2273f5bd8c23?w=800",
      "https://images.unsplash.com/photo-1585508494706-86d947b2e29a?w=800"
    ],
    coordinates: {
      lat: 27.1751,
      lng: 78.0421
    },
    bestSeason: "October to March",
    rating: 4.8,
    tips: [
      "Visit during sunrise for the best photos and fewer crowds",
      "Hire an authorized guide to learn about the fascinating history",
      "Combine your visit with Agra Fort and Fatehpur Sikri",
      "Book tickets online to avoid long queues",
      "The Taj looks different colors at different times of day"
    ],
    category: "historical",
    budget: "low",
    featured: true,
    popularity: 98,
    tags: ["wonder", "marble", "mogul", "architecture", "unesco"],
    idealDuration: "1-2 days",
    activities: ["Photography", "History Tour", "Architecture", "Sunrise View", "Museum Visit"],
    weather: {
      summer: { min: 25, max: 45, description: "Extremely hot" },
      winter: { min: 5, max: 22, description: "Cool and pleasant" },
      monsoon: { min: 25, max: 35, description: "Humid with occasional rain" }
    }
  },
  {
    name: "Mumbai City",
    description: "India's financial capital known as the 'City of Dreams'. Famous for Bollywood, diverse street food, colonial architecture, and the iconic Gateway of India. A vibrant metropolis that never sleeps.",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    images: [
      "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800",
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
      "https://images.unsplash.com/photo-1570168007204-dfb528c6248c?w=800",
      "https://images.unsplash.com/photo-1567591144882-57ecc9823c3a?w=800",
      "https://images.unsplash.com/photo-1562976544-5c5e4d31b9c4?w=800"
    ],
    coordinates: {
      lat: 19.0760,
      lng: 72.8777
    },
    bestSeason: "November to February",
    rating: 4.2,
    tips: [
      "Try diverse street food at Juhu Beach and Chowpatty",
      "Use local trains for fastest transportation around city",
      "Visit Marine Drive at night for beautiful city lights",
      "Explore Colaba Causeway for shopping and cafes",
      "Take a ferry ride to Elephanta Caves"
    ],
    category: "city",
    budget: "medium",
    featured: false,
    popularity: 92,
    tags: ["metropolis", "bollywood", "streetfood", "gateway", "financial"],
    idealDuration: "3-4 days",
    activities: ["City Tour", "Shopping", "Food Crawl", "Bollywood Tour", "Island Visit"],
    weather: {
      summer: { min: 25, max: 33, description: "Hot and humid" },
      winter: { min: 17, max: 30, description: "Pleasant and cool" },
      monsoon: { min: 24, max: 30, description: "Heavy rainfall" }
    }
  }
];

// Hotels data template - will be populated with actual place IDs
const getHotelsData = (placeId, placeName) => {
  const hotelsTemplates = {
    "Goa Beach": [
      {
        name: "Goa Marriott Resort & Spa",
        priceRange: "expensive",
        rating: 4.7,
        address: "Miramar, Panaji, Goa 403001",
        amenities: ["Pool", "Spa", "Beach Access", "Multiple Restaurants", "Free WiFi", "Gym"],
        bookingLink: "https://booking.com/goa-marriott",
        distanceFromPlace: 0.5,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"
      },
      {
        name: "Sea View Beach Resort",
        priceRange: "medium",
        rating: 4.2,
        address: "Calangute Beach, Goa 403516",
        amenities: ["Pool", "Restaurant", "Beach View", "Free WiFi", "Air Conditioning"],
        bookingLink: "https://booking.com/sea-view-goa",
        distanceFromPlace: 0.2,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400"
      },
      {
        name: "Backpackers Hostel Goa",
        priceRange: "cheap",
        rating: 3.9,
        address: "Anjuna, Goa 403509",
        amenities: ["Free WiFi", "Common Kitchen", "Bike Rental", "Beach Access"],
        bookingLink: "https://booking.com/backpackers-goa",
        distanceFromPlace: 1.5,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400"
      },
      {
        name: "Taj Fort Aguada Resort",
        priceRange: "expensive",
        rating: 4.8,
        address: "Sinquerim, Bardez, Goa 403515",
        amenities: ["Private Beach", "Spa", "Multiple Pools", "Luxury Suites", "Fine Dining"],
        bookingLink: "https://booking.com/taj-fort-aguada",
        distanceFromPlace: 2.0,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400"
      },
      {
        name: "Goa Ecostay",
        priceRange: "medium",
        rating: 4.1,
        address: "Palolem, South Goa 403702",
        amenities: ["Eco-friendly", "Beach Access", "Yoga Classes", "Organic Restaurant"],
        bookingLink: "https://booking.com/goa-ecostay",
        distanceFromPlace: 0.8,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400"
      }
    ],
    "Manali": [
      {
        name: "Snow Valley Resorts",
        priceRange: "expensive",
        rating: 4.6,
        address: "Mall Road, Manali, Himachal Pradesh 175131",
        amenities: ["Mountain View", "Heated Pool", "Spa", "Restaurant", "Free WiFi"],
        bookingLink: "https://booking.com/snow-valley-manali",
        distanceFromPlace: 1.2,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400"
      },
      {
        name: "Himalayan Comfort Stay",
        priceRange: "medium",
        rating: 4.3,
        address: "Old Manali, Himachal Pradesh 175131",
        amenities: ["Mountain View", "Free WiFi", "Restaurant", "Garden"],
        bookingLink: "https://booking.com/himalayan-comfort",
        distanceFromPlace: 2.5,
        image: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=400"
      },
      {
        name: "Manali Backpackers Hostel",
        priceRange: "cheap",
        rating: 4.0,
        address: "Circuit House Road, Manali 175131",
        amenities: ["Free WiFi", "Common Room", "Kitchen", "Trekking Guides"],
        bookingLink: "https://booking.com/manali-backpackers",
        distanceFromPlace: 1.8,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400"
      },
      {
        name: "Apple Country Resort",
        priceRange: "expensive",
        rating: 4.7,
        address: "Prini, Manali 175131",
        amenities: ["Orchard View", "Spa", "Adventure Sports", "Multi-cuisine Restaurant"],
        bookingLink: "https://booking.com/apple-country",
        distanceFromPlace: 3.2,
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400"
      },
      {
        name: "River View Hotel",
        priceRange: "medium",
        rating: 4.2,
        address: "Left Bank, Manali 175131",
        amenities: ["River View", "Free WiFi", "Restaurant", "Parking"],
        bookingLink: "https://booking.com/river-view-manali",
        distanceFromPlace: 0.5,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400"
      }
    ],
    "Taj Mahal": [
      {
        name: "Taj Hotel & Convention Centre",
        priceRange: "expensive",
        rating: 4.8,
        address: "Taj East Gate Road, Agra, Uttar Pradesh 282001",
        amenities: ["Pool", "Spa", "Restaurant", "Free WiFi", "Air Conditioning"],
        bookingLink: "https://booking.com/taj-hotel",
        distanceFromPlace: 1.2,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"
      },
      {
        name: "Hotel Amar",
        priceRange: "medium",
        rating: 4.2,
        address: "Fatehabad Road, Agra, Uttar Pradesh 282001",
        amenities: ["Restaurant", "Free WiFi", "Air Conditioning"],
        bookingLink: "https://booking.com/hotel-amar",
        distanceFromPlace: 2.5,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400"
      },
      {
        name: "Budget Stay Agra",
        priceRange: "cheap",
        rating: 3.8,
        address: "Civil Lines, Agra, Uttar Pradesh 282002",
        amenities: ["Free WiFi", "Breakfast"],
        bookingLink: "https://booking.com/budget-stay-agra",
        distanceFromPlace: 3.1,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400"
      },
      {
        name: "Mughal Sheraton",
        priceRange: "expensive",
        rating: 4.6,
        address: "Taj Ganj, Agra, Uttar Pradesh 282001",
        amenities: ["Pool", "Spa", "Gym", "Restaurant", "Bar"],
        bookingLink: "https://booking.com/mughal-sheraton",
        distanceFromPlace: 0.8,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400"
      },
      {
        name: "Green View Hotel",
        priceRange: "medium",
        rating: 4.1,
        address: "Mahatma Gandhi Road, Agra, Uttar Pradesh 282003",
        amenities: ["Garden", "Restaurant", "Free WiFi"],
        bookingLink: "https://booking.com/green-view",
        distanceFromPlace: 2.8,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400"
      }
    ],
    "Mumbai City": [
      {
        name: "The Taj Mahal Palace",
        priceRange: "expensive",
        rating: 4.9,
        address: "Apollo Bunder, Mumbai 400001",
        amenities: ["Luxury Spa", "Multiple Restaurants", "Pool", "Harbor View", "Butler Service"],
        bookingLink: "https://booking.com/taj-mumbai",
        distanceFromPlace: 0.1,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400"
      },
      {
        name: "Trident Nariman Point",
        priceRange: "expensive",
        rating: 4.7,
        address: "Nariman Point, Mumbai 400021",
        amenities: ["Sea View", "Business Center", "Pool", "Fine Dining", "Spa"],
        bookingLink: "https://booking.com/trident-mumbai",
        distanceFromPlace: 1.5,
        image: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=400"
      },
      {
        name: "Backpacker Panda Colaba",
        priceRange: "cheap",
        rating: 4.0,
        address: "Colaba, Mumbai 400005",
        amenities: ["Free WiFi", "Common Kitchen", "Walking Tours", "Social Events"],
        bookingLink: "https://booking.com/backpacker-panda",
        distanceFromPlace: 2.3,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400"
      },
      {
        name: "Hotel Suba Palace",
        priceRange: "medium",
        rating: 4.2,
        address: "Marine Drive, Mumbai 400020",
        amenities: ["Sea View", "Restaurant", "Free WiFi", "Conference Room"],
        bookingLink: "https://booking.com/suba-palace",
        distanceFromPlace: 0.8,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400"
      },
      {
        name: "Ibis Mumbai Airport",
        priceRange: "medium",
        rating: 4.1,
        address: "Andheri East, Mumbai 400069",
        amenities: ["Airport Shuttle", "Restaurant", "Free WiFi", "Parking"],
        bookingLink: "https://booking.com/ibis-mumbai",
        distanceFromPlace: 8.5,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400"
      }
    ]
  };

  return hotelsTemplates[placeName].map(hotel => ({
    ...hotel,
    placeId: placeId
  }));
};

// Restaurants data template - will be populated with actual place IDs
const getRestaurantsData = (placeId, placeName) => {
  const restaurantsTemplates = {
    "Goa Beach": [
      {
        name: "Goan Fish Curry House",
        priceRange: "medium",
        rating: 4.5,
        address: "Calangute Beach Road, Goa 403516",
        cuisineType: ["Goan", "Seafood", "Indian"],
        menuLink: "https://menu.com/goan-fish-curry",
        distanceFromPlace: 0.3,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"
      },
      {
        name: "Martin's Corner",
        priceRange: "expensive",
        rating: 4.7,
        address: "Betalbatim, South Goa 403713",
        cuisineType: ["Goan", "Portuguese", "Seafood"],
        menuLink: "https://menu.com/martins-corner",
        distanceFromPlace: 2.0,
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400"
      },
      {
        name: "Beach Shack Delights",
        priceRange: "cheap",
        rating: 4.2,
        address: "Anjuna Beach, Goa 403509",
        cuisineType: ["Street Food", "Seafood", "International"],
        menuLink: "https://menu.com/beach-shack",
        distanceFromPlace: 0.1,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
      },
      {
        name: "Portuguese Tavern",
        priceRange: "medium",
        rating: 4.3,
        address: "Fontainhas, Panaji 403001",
        cuisineType: ["Portuguese", "European", "Seafood"],
        menuLink: "https://menu.com/portuguese-tavern",
        distanceFromPlace: 3.2,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400"
      },
      {
        name: "Sunset Cafe",
        priceRange: "cheap",
        rating: 4.0,
        address: "Vagator Beach, Goa 403509",
        cuisineType: ["Cafe", "Continental", "Bakery"],
        menuLink: "https://menu.com/sunset-cafe",
        distanceFromPlace: 1.5,
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400"
      }
    ],
    "Manali": [
      {
        name: "Johnson's Cafe",
        priceRange: "medium",
        rating: 4.5,
        address: "Circuit House Road, Manali 175131",
        cuisineType: ["Himachali", "Tibetan", "Continental"],
        menuLink: "https://menu.com/johnsons-cafe",
        distanceFromPlace: 0.8,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"
      },
      {
        name: "Il Forno",
        priceRange: "expensive",
        rating: 4.6,
        address: "Old Manali, Manali 175131",
        cuisineType: ["Italian", "Wood-fired Pizza", "European"],
        menuLink: "https://menu.com/il-forno",
        distanceFromPlace: 2.1,
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400"
      },
      {
        name: "Mount View Dhaba",
        priceRange: "cheap",
        rating: 4.1,
        address: "Mall Road, Manali 175131",
        cuisineType: ["North Indian", "Himachali", "Street Food"],
        menuLink: "https://menu.com/mount-view-dhaba",
        distanceFromPlace: 1.2,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
      },
      {
        name: "The Lazy Dog Lounge",
        priceRange: "medium",
        rating: 4.4,
        address: "Old Manali, Manali 175131",
        cuisineType: ["Continental", "Israeli", "Mexican"],
        menuLink: "https://menu.com/lazy-dog",
        distanceFromPlace: 2.5,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400"
      },
      {
        name: "Tibetan Kitchen",
        priceRange: "cheap",
        rating: 4.3,
        address: "Model Town, Manali 175131",
        cuisineType: ["Tibetan", "Momos", "Noodles"],
        menuLink: "https://menu.com/tibetan-kitchen",
        distanceFromPlace: 1.8,
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400"
      }
    ],
    "Taj Mahal": [
      {
        name: "Taj Mahal View Restaurant",
        priceRange: "medium",
        rating: 4.5,
        address: "Taj East Gate, Agra, Uttar Pradesh 282001",
        cuisineType: ["North Indian", "Mughlai", "Chinese"],
        menuLink: "https://menu.com/taj-view",
        distanceFromPlace: 0.3,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"
      },
      {
        name: "Peshawri - ITC Mughal",
        priceRange: "expensive",
        rating: 4.7,
        address: "Fatehabad Road, Agra, Uttar Pradesh 282001",
        cuisineType: ["Northwest Frontier", "Barbecue"],
        menuLink: "https://menu.com/peshawri",
        distanceFromPlace: 2.0,
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400"
      },
      {
        name: "Street Food Corner",
        priceRange: "cheap",
        rating: 4.2,
        address: "Taj Ganj, Agra, Uttar Pradesh 282001",
        cuisineType: ["Street Food", "Indian", "Snacks"],
        menuLink: "https://menu.com/street-food-corner",
        distanceFromPlace: 0.5,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
      },
      {
        name: "Dasaprakash",
        priceRange: "medium",
        rating: 4.3,
        address: "Meher Bagh, Agra, Uttar Pradesh 282002",
        cuisineType: ["South Indian", "Vegetarian"],
        menuLink: "https://menu.com/dasaprakash",
        distanceFromPlace: 3.2,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400"
      },
      {
        name: "Zorba the Buddha",
        priceRange: "cheap",
        rating: 4.0,
        address: "Civil Lines, Agra, Uttar Pradesh 282002",
        cuisineType: ["Cafe", "Continental", "Bakery"],
        menuLink: "https://menu.com/zorba-buddha",
        distanceFromPlace: 2.8,
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400"
      }
    ],
    "Mumbai City": [
      {
        name: "Bademiya Kabab",
        priceRange: "medium",
        rating: 4.6,
        address: "Tulloch Road, Apollo Bunder, Mumbai 400039",
        cuisineType: ["Mughlai", "Barbecue", "Street Food"],
        menuLink: "https://menu.com/bademiya",
        distanceFromPlace: 0.8,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"
      },
      {
        name: "The Table",
        priceRange: "expensive",
        rating: 4.8,
        address: "CS Mahal, Apollo Bunder, Colaba, Mumbai 400039",
        cuisineType: ["Contemporary", "European", "Asian Fusion"],
        menuLink: "https://menu.com/the-table",
        distanceFromPlace: 1.2,
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400"
      },
      {
        name: "Cafe Mondegar",
        priceRange: "cheap",
        rating: 4.3,
        address: "Metro House, Colaba Causeway, Mumbai 400039",
        cuisineType: ["Continental", "Indian", "Cafe"],
        menuLink: "https://menu.com/mondegar",
        distanceFromPlace: 1.5,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
      },
      {
        name: "Trishna",
        priceRange: "expensive",
        rating: 4.7,
        address: "Kala Ghoda, Fort, Mumbai 400023",
        cuisineType: ["Seafood", "Coastal", "Mangalorean"],
        menuLink: "https://menu.com/trishna",
        distanceFromPlace: 2.3,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400"
      },
      {
        name: "Kyani & Co.",
        priceRange: "cheap",
        rating: 4.2,
        address: "JSS Road, Marine Lines, Mumbai 400002",
        cuisineType: ["Parsi", "Iranian", "Bakery"],
        menuLink: "https://menu.com/kyani",
        distanceFromPlace: 3.1,
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400"
      }
    ]
  };

  return restaurantsTemplates[placeName].map(restaurant => ({
    ...restaurant,
    placeId: placeId
  }));
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Place.deleteMany({});
    await Hotel.deleteMany({});
    await Restaurant.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert sample places and get their IDs
    const insertedPlaces = await Place.insertMany(samplePlaces);
    console.log(`✅ Successfully seeded ${insertedPlaces.length} places`);

    // Create a mapping of place names to their MongoDB IDs
    const placeIdMap = {};
    insertedPlaces.forEach(place => {
      placeIdMap[place.name] = place._id;
    });

    // Seed hotels and restaurants for each place
    let totalHotels = 0;
    let totalRestaurants = 0;

    for (const place of insertedPlaces) {
      const hotelsData = getHotelsData(place._id, place.name);
      const restaurantsData = getRestaurantsData(place._id, place.name);

      await Hotel.insertMany(hotelsData);
      await Restaurant.insertMany(restaurantsData);

      totalHotels += hotelsData.length;
      totalRestaurants += restaurantsData.length;

      console.log(`🏨 Added ${hotelsData.length} hotels for ${place.name}`);
      console.log(`🍽️  Added ${restaurantsData.length} restaurants for ${place.name}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Places: ${insertedPlaces.length}`);
    console.log(`   Hotels: ${totalHotels}`);
    console.log(`   Restaurants: ${totalRestaurants}`);
    console.log(`   Total records: ${insertedPlaces.length + totalHotels + totalRestaurants}`);

    // Display place IDs for reference
    console.log('\n🔗 Place IDs (for API testing):');
    insertedPlaces.forEach(place => {
      console.log(`   ${place.name}: ${place._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();