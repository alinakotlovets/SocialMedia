import {body} from "express-validator";
import {displayNameValidation} from "./authValidation";

export const validateEditUser = [
    displayNameValidation,
    body("description")
        .customSanitizer(value => {
            if (value === "") return null;
            return value;
        })
        .optional()
        .isLength({ min: 5, max: 100 }).withMessage("Description should be at least 5 and no more than 100 characters"),
]