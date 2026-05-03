const express = require('express');
const app = express();

app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send("Server running");
});

// Users array
let users = [];

// GET users
app.get('/users', (req, res) => {
    res.json(users);
});

// POST users
app.post('/users', (req, res) => {
    users.push(req.body);
    res.json(users);
});

// DELETE user
app.delete('/users/:id', (req, res) => {
    users = users.filter(u => u.id != req.params.id);
    res.json(users);
});

app.listen(3000, () => {
    console.log("Server started");
});