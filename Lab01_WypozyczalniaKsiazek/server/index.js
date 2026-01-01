const express = require('express');
const db = require('./db/database');
const booksRoutes = require('./routes/books');
const loansRoutes = require('./routes/loans');

const app = express();
const PORT = 3000;
const membersRoutes = require('./routes/members');

// middleware
app.use(express.json());
app.use(express.static('public'));

// testowy endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'library-api' });
});

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'"
    );
    next();
});

// Simple request logging
app.use((req, res, next) => {
    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.url}`
    );
    next();
});

app.use('/api/members', membersRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/loans', loansRoutes);

// Central error handler (fallback)
app.use((err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: 'Internal server error'
    });
});

app.listen(PORT, () => {
  console.log(`Serwer dzia³a na http://localhost:${PORT}`);
});
