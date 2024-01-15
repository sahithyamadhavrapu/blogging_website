const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const UserModel = require("./models/userModel"); // Import the UserModel

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/registration-form", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("MongoDB connected successfully");
});

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS)
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/register", (req, res) => {
  // Handle registration logic
  const { username, email, password } = req.body;

  // Create a new user in MongoDB (you might want to hash the password in a real application)
  const newUser = new UserModel({
    username,
    email,
    password,
  });

  newUser.save((err) => {
    if (err) {
      console.error("Error saving user:", err);
      res.status(500).send("Error saving user");
    } else {
      console.log("User registered successfully");
      res.sendFile(__dirname + "/public/success.html");
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

