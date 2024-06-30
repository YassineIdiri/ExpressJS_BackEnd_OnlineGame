const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const supabaseUrl = 'https://gaadrwigaogjwzuksvvf.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhYWRyd2lnYW9nand6dWtzdnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3NDI5OTgsImV4cCI6MjAzNTMxODk5OH0.WnRdUq2JYkH5UxwtVNPmcFFsqswuyt7d4hJNoVmfH8c';
const supabase = createClient(supabaseUrl, supabaseKey);

// Configurer CORS pour permettre l'accès à partir de votre frontend
const corsOptions = {
    origin: 'https://online-game-iota.vercel.app', // Remplacez par l'URL de votre frontend déployé
    optionsSuccessStatus: 200 // Pour les navigateurs anciens supportant pas bien les requêtes PUT/DELETE
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/log', async (req, res) => {
    try {
        const { username } = "Yassine";

        const { data, error } = await supabase
            .from('game_infos')
            .select('*')
            .eq('player', username)
            .eq('result', 'win');

        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ message: 'Internal Server Error', error });
        }

        const wins = data.length;
        return res.json({ wins });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err });
    }
});

app.get('/login', async (req, res) => {
    try {
        const { error } = await supabase
            .from('users')
            .insert([{ Name: "Yassine", Password: "password" }]);

        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
        return res.json({ message: 'Registration successful' });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { name, password } = req.body;

        const { error } = await supabase
            .from('users')
            .insert([{ Name: name, Password: password }]);

        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
        return res.json({ message: 'Registration successful' });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err });
    }
});

app.post('/win', async (req, res) => {
    try {
        const { username } = req.body;

        const { data, error } = await supabase
            .from('game_infos')
            .select('*')
            .eq('player', username)
            .eq('result', 'win');

        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ message: 'Internal Server Error', error });
        }

        const wins = data.length;
        return res.json({ wins });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err });
    }
});

app.post('/draw', async (req, res) => {
    try {
        const { username } = req.body;

        const { data, error } = await supabase
            .from('game_infos')
            .select('*')
            .eq('player', username)
            .eq('result', 'draw');

        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ message: 'Internal Server Error', error });
        }

        const draws = data.length;
        return res.json({ draws });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err });
    }
});

app.post('/lose', async (req, res) => {
    try {
        const { username } = req.body;

        const { data, error } = await supabase
            .from('game_infos')
            .select('*')
            .eq('player', username)
            .eq('result', 'lose');

        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ message: 'Internal Server Error', error });
        }

        const losses = data.length;
        return res.json({ losses });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err });
    }
});

app.post('/history', async (req, res) => {
    try {
        const { username } = req.body;

        const { data, error } = await supabase
            .from('game_infos')
            .select('Id, result, date, score')
            .eq('player', username)
            .order('Id', { ascending: false });

        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
        return res.json({ history: data });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err });
    }
});

app.post('/save-game', async (req, res) => {
    try {
        const { date, user, result, score } = req.body;

        const { error } = await supabase
            .from('game_infos')
            .insert([{ date, player: user, result, score }]);

        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ message: 'Internal Server Error', error });
        }
        return res.json({ message: 'Game data saved successfully' });
    } catch (err) {
        console.error('Unexpected error:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err });
    }
});

module.exports = app;
