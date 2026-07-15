import { body } from "express-validator";
import { validate } from "./auth.validator.js";

export const validateCreateWorkspace = [
  body("name")
    .trim()
    .notEmpty().withMessage("Workspace name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage("Description cannot exceed 200 characters"),

  validate,
];

export const validateUpdateWorkspace = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage("Description cannot exceed 200 characters"),

  validate,
];

export const validateInviteMember = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email")
    .normalizeEmail(),

  body("role")
    .optional()
    .isIn(["admin", "member", "viewer"])
    .withMessage("Role must be admin, member, or viewer"),

  validate,
];