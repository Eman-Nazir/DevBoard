import { body } from "express-validator";
import { validate } from "./auth.validator.js";

export const validateCreateProject = [
  body("name")
    .trim()
    .notEmpty().withMessage("Project name is required")
    .isLength({ min: 2, max: 80 }).withMessage("Name must be 2–80 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),

  body("githubRepo")
    .optional()
    .trim()
    .custom((val) => {
      if (val && !val.startsWith("https://")) {
        throw new Error("GitHub repo must be a valid https URL");
      }
      return true;
    }),

  validate,
];