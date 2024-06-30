const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "game"
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE Name = ? AND Password = ?', [email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (result.length > 0) {
            return res.json({ message: 'Login success' });
        } else {
            return res.status(401).json({ message: 'Login failed. Incorrect email or password.' });
        }
    });
});

app.post('/register', async (req, res) => {
    const { name, password } = req.body;

        db.query('INSERT INTO users (Name, Password) VALUES (?, ?)', [name, password], (err, result) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            return res.json({ message: 'Registration successful' });
        });
});

app.post('/win', (req, res) => {
    const { username } = req.body;

    console.log(db.query('SELECT COUNT(*) AS wins FROM game_infos WHERE player = ? AND result = "win"', [username], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        return res.json({ wins: result[0].wins });
    }));
});

app.post('/draw', (req, res) => {
    const { username } = req.body;

    db.query('SELECT COUNT(*) AS draws FROM game_infos WHERE player = ? AND result = "draw"', [username], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        return res.json({ draws: result[0].draws });
    });
});

app.post('/lose', (req, res) => {
    const { username } = req.body;

    db.query('SELECT COUNT(*) AS losses FROM game_infos WHERE player = ? AND result = "lose"', [username], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        return res.json({ losses: result[0].losses });
    });
});

app.post('/history', (req, res) => {
    const { username } = req.body;

    db.query('SELECT Id, result, DATE_FORMAT(date, "%Y-%m-%d %H:%i:%s") AS time, score FROM game_infos WHERE player = ? ORDER BY Id DESC', [username], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        return res.json({ history: result });
    });
});

app.post('/save-game', (req, res) => {
    const { date, user, result,score } = req.body;

    db.query('INSERT INTO game_infos (date, player, result, score) VALUES (?, ?, ?, ?)', 
    [date,user, result, score], (err, result) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        return res.json({ message: 'Game data saved successfully' });
    });
});


app.listen(8081, () => {
    console.log("Server listening on port 8081...");
});
