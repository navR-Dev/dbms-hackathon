const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

// Middleware to parse incoming JSON bodies
app.use(express.json());

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

app.get("/get-portfolio_asset", (req, res) => {
  const query = "SELECT * FROM portfolio_asset";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching portfolio_assetes:", err);
      return res.status(500).send("Error fetching portfolio_assets");
    }
    res.json(results);
  });
});

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

// POST route to add a transaction
app.post("/add-transaction", (req, res) => {
  const {
    portfolio_id,
    asset_id,
    transaction_type,
    transaction_date,
    units,
    price_per_unit,
    total_value,
  } = req.body;

  // Ensure that all necessary fields are provided
  if (
    !portfolio_id ||
    !asset_id ||
    !transaction_type ||
    !transaction_date ||
    !units ||
    !price_per_unit ||
    !total_value
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    INSERT INTO transaction (portfolio_id, asset_id, transaction_type, transaction_date, units, price_per_unit, total_value)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.execute(
    query,
    [
      portfolio_id,
      asset_id,
      transaction_type,
      transaction_date,
      units,
      price_per_unit,
      total_value,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting transaction:", err);
        return res.status(500).json({ error: "Failed to add transaction" });
      }
      res.status(201).json({
        message: "Transaction added successfully",
        transactionId: results.insertId,
      });
    },
  );
});
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

// Delete a portfolio
app.delete("/delete-portfolio/:id", (req, res) => {
  const { id } = req.params;

  // Delete the portfolio from the database
  const query = "DELETE FROM portfolio WHERE portfolio_id = ?";

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

// Handle root path ("/") and serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
