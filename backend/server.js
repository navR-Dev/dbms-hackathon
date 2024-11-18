const express = require("express");
const mysql = require("mysql2");
const path = require("path"); // For resolving paths
const cors = require("cors"); // Make sure cors is imported after express

// Initialize express app first
const app = express();
const port = 3001; // Change port to avoid conflict with React

// Enable CORS middleware (should be done after initializing app)
app.use(cors());

// Set up the MySQL connection with your provided credentials
const db = mysql.createConnection({
  host: "192.168.42.5", // Replace with your MySQL host IP
  user: "testuser", // Replace with your MySQL username
  password: "testpassword", // Your MySQL password
  database: "ecoventure", // Your MySQL database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MySQL!");
});

// Serve static files from the current directory
app.use(express.static(__dirname)); // This serves all files in the current directory

// API endpoint to get all records from the 'asset' table
app.get("/get-assets", (req, res) => {
  const query = "SELECT * FROM asset"; // Select all records from the asset table

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching assets:", err);
      return res.status(500).send("Error fetching assets");
    }
    res.json(results); // Return all the asset records as JSON
  });
});

// Handle root path ("/") and serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Serve index.html directly from the current directory
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
