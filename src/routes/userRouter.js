import express from "express";
const router = express.Router();
import {
  createUser,
  loginUser,
  updateUserProfile,
  sendOtpToEmail,
  verifyOTP,
  removeSavedNews,
  saveBookmarks,
  addcategory,
  removeCategory,
  userPreference,
  upreference,getPrefenceUser
} from "../controllers/userController.js";
import { body, check, param } from "express-validator";
import { User_authentication } from "../middleware/auth_user.js";

router.post("/get-otp", sendOtpToEmail);

router.post("/verify-otp", verifyOTP);

router.post(
  "/register",
  [
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
    body("bookmarks")
    .optional()
      .isArray()
      .withMessage("bookmarks must be an array"),
    check("bookmarks.*")
     .optional()
      .isMongoId()
      .withMessage("preference is validate"),
    body("preference")
      .notEmpty()
      .withMessage("preference is required")
      .isArray()
      .withMessage("preference is in array"),
    check("preference.*.category")
      .notEmpty()
      .withMessage("news category must be required")
      .isMongoId()
      .withMessage("CategoryId must be in string"),
    check("preference.*.type")
      .optional()
      .isIn(['green','yellow','red'])
      .withMessage("Type must be in green , yellow, red")
  ],
  createUser
);

router.post(
  "/login",
  [
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
  ],
  loginUser
);

router.patch(
  "/update-profile/:userId",
  User_authentication,
  [ 
    param('userId').isMongoId().withMessage("userId is not validate"),
    body("name")
      .optional()
      .isString()
      .withMessage("name must be in string"),

    body("phone")
      .optional()
      .isString()
      .withMessage("Phone number is in string")
      .isMobilePhone()
      .withMessage("Mobile  number is not valid"),

    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("enter valid email"),

    body("password")
      .optional()
      .trim()
      .isStrongPassword()
      .withMessage(
        "Length of the password must be between 8 to 15 characters , atleast use one Uppercase and one unique characters"
      ),
  ],
  updateUserProfile
);

router.post("/news/save",User_authentication,saveBookmarks);

router.delete('/news/save/:newsId',User_authentication,removeSavedNews)

router.post('/category/save',User_authentication,addcategory)

router.delete('/category/save/:categoryId',User_authentication,removeCategory)

router.get('/preference',User_authentication,getPrefenceUser)


export default router;
