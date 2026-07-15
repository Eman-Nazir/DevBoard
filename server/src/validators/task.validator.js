import { body } from "express-validator";
import { validate } from "./auth.validator.js";

export const validateCreateTask = [
  body("title")
    .trim()
    .notEmpty().withMessage("Task title is required")
    .isLength({ min: 1, max: 200 }).withMessage("Title must be 1–200 characters"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Priority must be low, medium, high, or urgent"),

  body("dueDate")
    .optional()
    .isISO8601().withMessage("Due date must be a valid date"),

  validate,
];

export const validateMoveTask = [
  body("columnId")
    .notEmpty().withMessage("columnId is required"),

  body("order")
    .isNumeric().withMessage("order must be a number"),

  validate,
];