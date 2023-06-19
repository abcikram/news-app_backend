import  express from 'express';
const router = express.Router();
import { Admin_authentication } from '../middleware/auth.js';
import { body, param } from 'express-validator';
import { createNews } from '../controllers/newsController.js';



router.post('/create',Admin_authentication,  [
    body("title")
      .notEmpty()
      .withMessage("title must be present")
      .isString()
      .withMessage("title must be in string"),
    body("description")
      .notEmpty()
      .withMessage("mrp should be present")
      .isString()
      .withMessage("description must be in String"),
    body("originalURL")
      .notEmpty()
      .withMessage("originalURL must be require")
      .isString()
      .withMessage("originalURL should be in the String"),
    body("type")
        .notEmpty()
        .withMessage("news type must be present")
        .isIn(["major","no_major"])
        .withMessage("news type must be major,no_major") ,
    body("category")
       .notEmpty()
       .withMessage("category is required")
       .isMongoId()
       .withMessage("category id is not validate"),
  ],createNews);

router.get('/getall',)
router.get('/get/:newsId',[param('newsId')])
router.put('/update/:newsId',)
router.delete('/delete/:newsId',)









export default router