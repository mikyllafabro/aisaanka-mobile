const express = require('express');
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const GOOGLE_MAP_API_KEY="AIzaSyA97iQhpD5yGyKeHxmPOkGMTM7cqmGcuS8"
const FRONTEND_URL = process.env.FRONTEND_URL || "http://192.168.1.59:5000";

const mongoUrl = "mongodb+srv://fabromikylla:admin123@cluster0.zavvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const JWT_SECRET="aisaanka";
mongoose.connect(mongoUrl).then(()=> {
  console.log("Database connected");
})
.catch((e) => {
  console.log(e);
});

require('./models/User')
const User = mongoose.model("User");

app.get("/", (req, res) => {
  res.send({status: "Started"});
});

const axios = require('axios'); 

const port = 5000;

const cors = require('cors');
app.use(cors({
  origin: FRONTEND_URL
}));

app.post("/register", async (req, res) => {
  const {username, email, password} = req.body;

  const oldUser = await User.findOne({ email });
  
  if (oldUser) {
    return res.send({data: "Email already in use"});
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 6);
    console.log("Hashed password: ", hashedPassword);

    await User.create({
      username:username, 
      email:email,
      password:hashedPassword,
    });
    res.send({status: "ok", data: "User created"});
  } catch (error) {
    console.error("Error during registration:", error);
    res.send({status: "error", data: error});
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ data: "Email and password are required" });
  }

  const oldUser = await User.findOne({ email });

  if (!oldUser) {
    return res.status(400).send({ data: "User doesn't exist" });
  }

  // Log fetched password and password comparison
  console.log("Fetched password from DB: ", oldUser.password);
  const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
  console.log("Password comparison result: ", isPasswordCorrect);

  if (!isPasswordCorrect) {
    return res.status(400).send({ status: "error", data: "Invalid credentials" });
  }

  // Generate token upon successful login
  const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
  console.log("Generated JWT token: ", token);
  return res.status(200).send({ status: "ok", data: token });
});




app.post("/userdata", async (req, res) => {
  const token = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail=user.email;

    User.findOne({email:useremail}).then(data=>{
      return res.send({status: "ok", data: data});
    });

  } catch (error) {
    return res.send({ error: error})
  }
});

// Endpoint to search places (you can replace with actual Google Places API integration)
app.get('/api/search', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Fetch places using an external API (like Google Places)
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_MAP_API_KEY}`);
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

