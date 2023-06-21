import express from 'express';
const router = express.Router();
import { createUser, loginUser, updateUserProfile } from '../controllers/userController.js';
import { body, check, param } from 'express-validator';

router.post('/register', [
    body("name")
        .notEmpty()
        .withMessage("name is require")
        .isString()
        .withMessage("name must be in string"),

    body("phone")
        .notEmpty()
        .withMessage("phone number is require")
        .isString()
        .withMessage("Phone number is in string")
        .isMobilePhone()
        .withMessage("Mobile  number is not valid"),

    body("email")
        .notEmpty()
        .withMessage("email is require")
        .trim()
        .isEmail()
        .withMessage("enter valid email"),

    body("password")
        .notEmpty()
        .trim()
        .withMessage("password must be present")
        .isStrongPassword()
        .withMessage(
            "Length of the password must be between 8 to 15 characters , atleast use one Uppercase and one unique characters"
    ),
    body("bookmarks").notEmpty()
        .withMessage('bookmarks is required')
        .isArray().
        withMessage("bookmarks must be an array"),
    check("bookmarks.*")
        .notEmpty()
        .withMessage("bookmarksId is required")
        .isMongoId().withMessage("preference is validate"),
    body("preference").notEmpty().withMessage("preference is required")
        .isMongoId().withMessage("preference is validate")

], createUser)


router.post('/login',
    [body("email")
        .notEmpty()
        .withMessage("email is require")
        .trim()
        .isEmail()
        .withMessage("enter valid email"),

    body("password")
        .notEmpty()
        .trim()
        .withMessage("password must be present")
        .isStrongPassword()
        .withMessage(
            "Length of the password must be between 8 to 15 characters , atleast use one Uppercase and one unique characters")
    ], loginUser)















export default router