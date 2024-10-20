const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Setup CORS
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'one_development'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

// Route to increment clicks
app.post('/click', (req, res) => {
    const imageName = req.body.image_name;
    console.log("Received Image Name: ", imageName);

    const sql = 'UPDATE image_clicks SET clicks = clicks + 1 WHERE LOWER(image_name) = LOWER(?)';
    db.query(sql, [imageName], (err, result) => {
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
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
