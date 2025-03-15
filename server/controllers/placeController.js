import PlaceModel from "../models/Place.js";

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