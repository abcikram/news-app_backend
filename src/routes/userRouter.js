import  express from 'express';
const router = express.Router();
import { adminLogin , createAdmin, updateAdmin , deleteAdmin ,getAllAdmin,getParticularAdmin} from '../controllers/adminController.js';
import { body, param } from 'express-validator';
