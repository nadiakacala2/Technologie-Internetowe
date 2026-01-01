const express = require("express");
const router = express.Router();
console.log("tasks.routes.js loaded");

const tasksController = require("../controllers/tasks.controller");
const {
    validateTaskCreate,
    validateTaskMove
} = require("../middleware/validate");

// POST /api/tasks — dodanie zadania
router.post("/tasks", validateTaskCreate, tasksController.createTask);

// POST /api/tasks/:id/move — przeniesienie zadania
router.post("/tasks/:id/move", validateTaskMove, tasksController.moveTask);

// DELETE /api/tasks/:id — usuniêcie zadania (UI + sync)
router.delete("/tasks/:id", tasksController.deleteTask);

module.exports = router;
