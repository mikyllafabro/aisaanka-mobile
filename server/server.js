const express = require('express');
const cors = require('cors');
const axios = require('axios'); // For making HTTP requests to external APIs (e.g., Google Places)

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Endpoint to search places (you can replace with actual Google Places API integration)
app.get('/api/search', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Fetch places using an external API (like Google Places)
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=AIzaSyCQ1Hn6oGdicusFM7nCxviTZ7MuHqCEE-w`);
    const places = response.data.results.map(place => ({
      description: place.formatted_address,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    }));

    res.json(places);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching places' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
