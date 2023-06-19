import  express from 'express';
const router = express.Router();
import { Admin_authentication } from '../middleware/auth.js';
import { createCategory } from '../controllers/newsController.js';
import { body } from 'express-validator';

router.post('/create',Admin_authentication,[
    body('topic')
       .notEmpty()
       .withMessage("News topic is manditory")
       .isString()
       .withMessage("new topic must be in string")
],createCategory)




export default router