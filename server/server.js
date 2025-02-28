const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const FRONTEND_URL = process.env.FRONTEND_URL || "http://192.168.1.59:5000";
const JWT_SECRET = "aisaanka";
const mongoUrl = "mongodb+srv://fabromikylla:admin123@cluster0.zavvr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Database Connection
mongoose.connect(mongoUrl).then(() => {
    console.log("Database connected");
}).catch((e) => {
    console.log("Database connection error:", e);
});

require('./models/User');
const User = mongoose.model("User");

// Middleware
app.use(express.json());
app.use(cors({ origin: FRONTEND_URL }));

// Home Route
app.get("/", (req, res) => {
    res.send({ status: "Started" });
});

// Register Route
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).send({ data: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        console.log("Hashed password: ", hashedPassword);

        await User.create({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 1, // Default role is user (1)
        });

        res.status(201).send({ status: "ok", data: "User created" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send({ status: "error", data: "Registration failed" });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ data: "Email and password are required" });
    }

    try {
        // Make email search case-insensitive
        const oldUser = await User.findOne({ email: email.toLowerCase() });

        if (!oldUser) {
            return res.status(400).send({ data: "User doesn't exist" });
        }

        console.log("Entered Password (Before Trim):", password.trim());
        console.log("Entered Password (After Trim):", password.trim());
        console.log("Stored Hashed Password:", oldUser.password);        

        // Check if the entered password matches the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password.toString(), oldUser.password);
        console.log("Password comparison result:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(400).send({ status: "error", data: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ email: oldUser.email, role: oldUser.role }, JWT_SECRET);
        console.log("Generated JWT token:", token);

        return res.status(200).send({ status: "ok", data: { token, role: oldUser.role } });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send({ status: "error", data: "Login failed" });
    }
});

// Update User Role (Admin Feature)
app.put("/update-role", async (req, res) => {
    const { email, role } = req.body;

    if (![0, 1].includes(role)) {
        return res.status(400).send({ data: "Invalid role" });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ data: "User not found" });
        }

        res.send({ status: "ok", data: "Role updated successfully", updatedUser });
    } catch (error) {
        res.status(500).send({ status: "error", data: "Role update failed" });
    }
});

// Fetch User Data
app.post("/userdata", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET);
        const userEmail = user.email;

        const userData = await User.findOne({ email: userEmail });
        if (!userData) {
            return res.status(404).send({ data: "User not found" });
        }

        return res.send({ status: "ok", data: userData });
    } catch (error) {
        return res.status(401).send({ error: "Invalid token" });
    }
});

// Fetch All Users
app.get("/users", async (req, res) => {
  try {
      const users = await User.find({}, "username email role"); // Fetch only needed fields
      res.status(200).send({ status: "ok", data: users });
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send({ status: "error", data: "Failed to fetch users" });
  }
});


// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});"$2a$10$Zbt.nWqmjUhSQXrLRnoTU.CPTi62jV02omyGz4PnniC/rbk.2QT/6"