module.exports = function errorHandler(err, req, res, next) {
    console.error(err);

    // Jeœli status ju¿ ustawiony (np. 403, 422)
    if (res.headersSent) {
        return next(err);
    }

    const status = err.status || 500;

    res.status(status).json({
        error: err.message || "Internal Server Error"
    });
};
