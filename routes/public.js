const express = require("express");
const router = express.Router();
const Place = require("../models/Place");
const Hotel = require("../models/Hotel");
const Package = require("../models/Package");

// Get all data for users
router.get("/places", async (req,res)=>{ res.json(await Place.find()); });
router.get("/hotels", async (req,res)=>{ res.json(await Hotel.find()); });
router.get("/packages", async (req,res)=>{ res.json(await Package.find()); });

module.exports = router;
