import express from 'express';
import { 
  savePlace, 
  getPlaces, 
  getMostVisitedPlaces, 
  getUsageTimes,
  saveTrip,
  getUserTrips,
  getTripById
} from '../controllers/placeController.js';
import { verifyUser } from '../middleware/auth.js';

const router = express.Router();

// Place routes
router.post('/', verifyUser, savePlace);
router.get('/', verifyUser, getPlaces);
router.get('/most-visited', verifyUser, getMostVisitedPlaces);
router.get('/usage-times', verifyUser, getUsageTimes);

// Trip routes - adding these routes to fix the 404 error
router.post('/trips', verifyUser, saveTrip);
router.get('/trips', verifyUser, getUserTrips);
router.get('/trips/:tripId', verifyUser, getTripById);

export default router;