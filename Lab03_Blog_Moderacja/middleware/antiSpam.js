const limits = new Map();

// max komentarzy i okno czasowe
const MAX_COMMENTS = 3;
const WINDOW_MS = 60 * 1000; // 60 sekund

module.exports = function antiSpam(req, res, next) {
    const ip = req.ip;
    const now = Date.now();

    if (!limits.has(ip)) {
        limits.set(ip, []);
    }

    // zostaw tylko wpisy z ostatniej minuty
    const timestamps = limits.get(ip).filter(ts => now - ts < WINDOW_MS);
    timestamps.push(now);
    limits.set(ip, timestamps);

    if (timestamps.length > MAX_COMMENTS) {
        return res.status(429).json({
            error: "Too many comments. Please try again later."
        });
    }

    next();
};
