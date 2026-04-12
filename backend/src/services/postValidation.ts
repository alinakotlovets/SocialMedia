import {body} from "express-validator";

export const postValidation = [
    body("text")
        .trim()
        .notEmpty().withMessage("Post text is required")
        .isLength({min:1, max:280}).withMessage("Post text need be between 1 to 280 symbols")
]