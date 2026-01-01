exports.validateTaskCreate = (req, res, next) => {
    const { title, col_id } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(422).json({ error: "Invalid title" });
    }

    if (!Number.isInteger(col_id) || col_id <= 0) {
        return res.status(422).json({ error: "Invalid col_id" });
    }

    next();
};

exports.validateTaskMove = (req, res, next) => {
    const { col_id, ord } = req.body;

    if (!Number.isInteger(col_id) || col_id <= 0) {
        return res.status(422).json({ error: "Invalid col_id" });
    }

    if (!Number.isInteger(ord) || ord < 1) {
        return res.status(422).json({ error: "Invalid ord" });
    }

    next();
};
