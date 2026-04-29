import {body} from "express-validator";


const passwordValidation = body("password")
    .optional()
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({min:8, max:30}).withMessage("Password should at least 8 symbols and no more than 30 symbols")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter of english alphabet")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter of english alphabet")
    .custom(value=>{
        if (/\s/.test(value)) {
            throw new Error('No spaces are allowed in the password');
        }
        return true;
    });


export const displayNameValidation = body("displayName")
    .trim()
    .notEmpty().withMessage("Display name is required")
    .isLength({min: 2, max: 50}).withMessage("Display name should at least 2 symbols and no more than 50 symbols")

export const validateRegister = [
    displayNameValidation,
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({min: 2, max: 25}).withMessage("Username should at least 2 symbols and no more than 25 symbols"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email should be in valid format: example@emaiservice.com"),
    passwordValidation,
    body("description")
        .customSanitizer(value => {
            if (value === "") return null;
            return value;
        })
        .optional()
        .isLength({ min: 5, max: 100 }).withMessage("Description should be at least 5 and no more than 100 characters"),
    body("confirmPassword")
        .optional()
        .trim()
        .notEmpty().withMessage("Confirm password is required")
        .custom((value, {req}) =>{
            if(value !== req.body.password){
                throw new Error("Passwords do not match");
            }
            return true;
        })
]

export const validateLogin = [
    body("login")
        .trim()
        .notEmpty().withMessage("Login is required")
        .isLength({min: 2, max: 50}).withMessage("Login should at least 2 symbols and no more than 50 symbols"),
    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({min:8, max:30}).withMessage("Password should at least 8 symbols and no more than 30 symbols")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter of english alphabet")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter of english alphabet")
        .custom(value=>{
            if (/\s/.test(value)) {
                throw new Error('No spaces are allowed in the password');
            }
            return true;
        })
]