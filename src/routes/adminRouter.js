import  express from 'express';
const router = express.Router();
import { adminLogin , createAdmin, updateAdmin , deleteAdmin ,getAllAdmin,getParticularAdmin} from '../controllers/adminController.js';
import { body, param } from 'express-validator';
import { Admin_authentication } from '../middleware/auth.js';


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
  ],createAdmin)

router.post('/login', [
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
      )
  ],adminLogin)


router.get('/getAll',Admin_authentication,getAllAdmin)

router.get('/get/:adminId',Admin_authentication,[
    param('adminId').isMongoId().withMessage("adminId is validate")
],getParticularAdmin)


router.patch('/update/:adminId',Admin_authentication, [
    param('adminId').isMongoId().withMessage("adminId is validate"),
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
      )
  ],updateAdmin);

router.delete('/delete/:adminId',[
    param('adminId').isMongoId().withMessage("adminId is validate")
],deleteAdmin)



export default router