const express = require('express');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

app.use(express.json());
app.use('/', cartRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
});

module.exports = app;