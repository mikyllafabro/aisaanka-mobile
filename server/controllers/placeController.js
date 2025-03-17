import PlaceModel from "../models/Place.js";
import UserModel from "../models/User.js";
import mongoose from "mongoose";

// Save a new place entry
export const savePlace = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    const { destination, time } = req.body;

    const newPlace = new PlaceModel({
      user: req.user._id, // Associate place with the logged-in user
      place: destination,
      time: time || Date.now(), // Use provided time or current time
    });

    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all places for the logged-in user
export const getPlaces = async (req, res) => {
  try {
    const places = await PlaceModel.find().populate('user', 'name username email');
    res.status(200).json(places);
  } catch (error) {
    console.error("Error fetching places:", error); // Debugging log
    res.status(500).json({ message: error.message });
  }
};

// Get the most visited places
export const getMostVisitedPlaces = async (req, res) => {
  try {
    const mostVisitedPlaces = await PlaceModel.aggregate([
      {
        $group: {
          _id: "$place",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10 // Limit to top 10 most visited places
      }
    ]);

    res.status(200).json(mostVisitedPlaces);
  } catch (error) {
    console.error("Error fetching most visited places:", error); // Debugging log
    res.status(500).json({ message: error.message });
  }
};

// Get usage times grouped by AM and PM
export const getUsageTimes = async (req, res) => {
  try {
    const usageTimes = await PlaceModel.aggregate([
      {
        $project: {
          period: {
            $cond: [
              { $lt: [{ $hour: "$time" }, 12] },
              "AM",
              "PM"
            ]
          }
        }
      },
      {
        $group: {
          _id: "$period",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(usageTimes);
  } catch (error) {
    console.error("Error fetching usage times:", error); // Debugging log
    res.status(500).json({ message: error.message });
  }
};

export const saveTrip = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    // Updated to accept trip object directly from req.body
    const { trip } = req.body;

    if (!trip || !trip.from || !trip.to) {
      return res.status(400).json({ message: "Trip data with origin and destination is required" });
    }

    // Find the user
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use the trip data as provided, but add ID if missing
    const newTrip = {
      ...trip,
      id: trip.id || new mongoose.Types.ObjectId().toString(),
      timestamp: new Date()
    };

    // Initialize travelHistory if it doesn't exist
    if (!user.travelHistory) {
      user.travelHistory = [];
    }

    // Add trip to user's travel history
    user.travelHistory.unshift(newTrip); // Add to the beginning (most recent first)
    await user.save();

    // Also save as places for analytics
    const originPlace = new PlaceModel({
      user: req.user._id,
      place: trip.from,
      time: new Date()
    });
    
    const destinationPlace = new PlaceModel({
      user: req.user._id,
      place: trip.to,
      time: new Date()
    });

    await Promise.all([originPlace.save(), destinationPlace.save()]);

    res.status(201).json({
      message: "Trip saved successfully",
      trip: newTrip,
      tripCount: user.travelHistory.length
    });
  } catch (error) {
    console.error("Error saving trip:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's travel history
export const getUserTrips = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const trips = user.travelHistory || [];
    res.status(200).json({
      trips: trips,
      tripCount: trips.length
    });
  } catch (error) {
    console.error("Error fetching user trips:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get trip details by ID
export const getTripById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    const { tripId } = req.params;
    if (!tripId) {
      return res.status(400).json({ message: "Trip ID is required" });
    }

    const user = await UserModel.findById(req.user._id);
    if (!user || !user.travelHistory) {
      return res.status(404).json({ message: "User or travel history not found" });
    }

    const trip = user.travelHistory.find(t => t.id === tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error("Error fetching trip details:", error);
    res.status(500).json({ message: error.message });
  }
};