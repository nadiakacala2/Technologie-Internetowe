module.exports = function errorHandler(err, req, res, next) {
    console.error("ERROR:", err.message);

    res.status(500).json({
        error: "Internal Server Error"
    });
};