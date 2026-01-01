module.exports = function securityHeaders(req, res, next) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");

    // Minimalny CSP – wystarczy do laba
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'"
    );

    next();
};