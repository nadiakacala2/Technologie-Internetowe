module.exports = function adminAuth(req, res, next) {
    const token = req.headers["x-admin-token"];

    if (!token || token !== "admin123") {
        return res.status(403).json({
            error: "Forbidden - invalid admin token"
        });
    }

    next();
};