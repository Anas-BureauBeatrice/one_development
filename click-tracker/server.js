const express = require('express');
const { Pool } = require('pg');  // Use pg instead of mysql
const cors = require('cors');
const app = express();
const PORT = 3000;

// Setup CORS
app.use(cors());
app.use(express.json());

// Database connection using environment variable
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,  // Read from environment variable
    ssl: {
        rejectUnauthorized: false  // Ensure SSL connection
    }
});

// Route to increment clicks
app.post('/click', (req, res) => {
    const imageName = req.body.image_name;
    console.log("Received Image Name: ", imageName);

    const sql = 'UPDATE image_clicks SET clicks = clicks + 1 WHERE LOWER(image_name) = LOWER($1)'; // Use $1 for parameterized query
    pool.query(sql, [imageName], (err, result) => {
        if (err) {
            console.error("SQL Error: ", err);
            return res.status(500).json({ error: err });
        }
        console.log("Query Result: ", result);
        res.status(200).json({ message: 'Click recorded', result });
    });
});

// Route to get statistics
app.get('/statistics', (req, res) => {
    const sql = 'SELECT * FROM image_clicks';
    pool.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json(results.rows);  // Adjust for PostgreSQL query result
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
