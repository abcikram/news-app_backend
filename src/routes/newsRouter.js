import  express from 'express';
const router = express.Router();
import { Admin_authentication } from '../middleware/auth.js';
import { body, param } from 'express-validator';
import { createNews, getAllNews, particularCategory,newsTopHeadlline, trendingTopic, findTypedata, removeNews,updateNews } from '../controllers/newsController.js';



router.post('/create', Admin_authentication,
  [
    body("title")
      .notEmpty()
      .withMessage("title must be present")
      .isString()
      .withMessage("title must be in string"),
    body("description")
      .notEmpty()
      .withMessage("description should be present")
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
    body("categoryId")
       .notEmpty()
       .withMessage("categoryId is required")
       .isMongoId()
       .withMessage("categoryId is not validate"),
  ],createNews);

router.get('/getall',getAllNews);
router.get('/get/type',findTypedata)
router.get('/topheadlines',newsTopHeadlline)
router.get('/trending',trendingTopic)

router.get('/category/:categoryId',[
  param("categoryId").isMongoId().withMessage("categoryId is not valid")
],particularCategory)


router.patch('/update/:newsId',Admin_authentication, [
  body("title")
    .optional()
    .isString()
    .withMessage("title must be in string"),
  body("description")
    .optional()
    .isString()
    .withMessage("description must be in String"),
  body("originalURL")
    .optional()
    .isString()
    .withMessage("originalURL should be in the String"),
  body("type")
    .optional()
    .isIn(["major", "no_major"])
    .withMessage("news type must be major,no_major"),
  body("categoryId")
    .optional()
    .isMongoId()
    .withMessage("category id is not validate"),
], updateNews);

router.delete('/delete/:newsId',Admin_authentication,removeNews)









export default router