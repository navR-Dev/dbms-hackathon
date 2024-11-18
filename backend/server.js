const express = require("express");
const mysql = require("mysql2");
const path = require("path"); // For resolving paths
const cors = require("cors"); // For handling cross-origin requests

// Initialize the express app
const app = express();
const port = 3001; // Port for the server

// Enable CORS
app.use(cors());

// Set up the MySQL connection
const db = mysql.createConnection({
  host: "192.168.42.5", // Replace with your MySQL host IP
  user: "testuser", // Replace with your MySQL username
  password: "testpassword", // Replace with your MySQL password
  database: "ecoventure", // Replace with your MySQL database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MySQL!");
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Individual routes for each table

// Fetch all assets
app.get("/get-assets", (req, res) => {
  const query = "SELECT * FROM asset";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching assets:", err);
      return res.status(500).send("Error fetching assets");
    }
    res.json(results);
  });
});

// Fetch all investors
app.get("/get-investors", (req, res) => {
  const query = "SELECT * FROM investor";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching investors:", err);
      return res.status(500).send("Error fetching investors");
    }
    res.json(results);
  });
});

// Fetch all market history
app.get("/get-market-history", (req, res) => {
  const query = "SELECT * FROM market_history";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching market history:", err);
      return res.status(500).send("Error fetching market history");
    }
    res.json(results);
  });
});

// Fetch all portfolios
app.get("/get-portfolios", (req, res) => {
  const query = "SELECT * FROM portfolio";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching portfolios:", err);
      return res.status(500).send("Error fetching portfolios");
    }
    res.json(results);
  });
});

app.post("/add-portfolio", (req, res) => {
  const { investor_id, portfolio_name, initial_investment, status } = req.body;

  // Validate inputs
  if (!investor_id || !portfolio_name || !initial_investment || !status) {
    return res.status(400).send("All fields (investor_id, portfolio_name, initial_investment, status) are required.");
  }

  // Insert the new portfolio into the database
  const query = `
    INSERT INTO portfolio (investor_id, portfolio_name, initial_investment, status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [investor_id, portfolio_name, initial_investment, status], (err, result) => {
    if (err) {
      console.error("Error adding portfolio:", err);
      return res.status(500).send("Error adding portfolio");
    }
    res.status(201).json({
      message: "Portfolio added successfully",
      portfolio_id: result.insertId,
    });
  });
});

// Delete a portfolio
app.delete("/delete-portfolio/:id", (req, res) => {
  const { id } = req.params;

  // Delete the portfolio from the database
  const query = "DELETE FROM portfolio WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting portfolio:", err);
      return res.status(500).send("Error deleting portfolio");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Portfolio not found");
    }
    res.status(200).json({
      message: "Portfolio deleted successfully",
    });
  });
});

// Fetch all portfolio assets
app.get("/get-portfolio-assets", (req, res) => {
  const query = "SELECT * FROM portfolio_asset";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching portfolio assets:", err);
      return res.status(500).send("Error fetching portfolio assets");
    }
    res.json(results);
  });
});

// Fetch all transactions
app.get("/get-transactions", (req, res) => {
  const query = "SELECT * FROM transaction";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      return res.status(500).send("Error fetching transactions");
    }
    res.json(results);
  });
});

app.post("/add-transaction", (req, res) => {
  const { portfolio_id, asset_id, transaction_type, transaction_date, units, price_per_unit } = req.body;

  // Validate inputs
  if (!portfolio_id || !asset_id || !transaction_type || !transaction_date || !units || !price_per_unit) {
    return res.status(400).send("All fields are required.");
  }

  // Calculate total value
  const total_value = units * price_per_unit;

  // Insert the transaction into the database
  const query = `
    INSERT INTO transaction 
    (portfolio_id, asset_id, transaction_type, transaction_date, units, price_per_unit, total_value)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [portfolio_id, asset_id, transaction_type, transaction_date, units, price_per_unit, total_value], (err, result) => {
    if (err) {
      console.error("Error adding transaction:", err);
      return res.status(500).send("Error adding transaction");
    }
    res.status(201).json({
      message: "Transaction added successfully",
      transaction_id: result.insertId,
    });
  });
});

// Handle root path ("/") and serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
