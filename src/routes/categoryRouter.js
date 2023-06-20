import  express from 'express';
const router = express.Router();
import { Admin_authentication } from '../middleware/auth.js';
import { createCategory,particularCategory } from '../controllers/newsController.js';
import { body,param } from 'express-validator';

router.post('/create',Admin_authentication,[
    body('category')
       .notEmpty()
       .withMessage("News category is manditory")
       .isString()
       .withMessage("new category must be in string")
],createCategory)






export default router