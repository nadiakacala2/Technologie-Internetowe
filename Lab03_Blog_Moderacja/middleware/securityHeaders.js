module.exports = function securityHeaders(req, res, next) {
    // Zapobiega sniffowaniu MIME
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Ogranicza przekazywanie referrera
    res.setHeader("Referrer-Policy", "no-referrer");

    // Prosty CSP (bezpieczny dla API + prostego frontu)
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';"
    );

    next();
};