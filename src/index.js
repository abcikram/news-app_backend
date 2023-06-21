import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import connectDB from '../mongoDB/db.js';
import Colors from 'colors';
import adminRouter from './routes/adminRouter.js'
import newsRouter from './routes/newsRouter.js'
import categoryRouter from './routes/categoryRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();

dotenv.config()

connectDB()

app.use(express.json());
app.use(multer().any())
app.use(express.urlencoded({extended:false}))

app.use('/admin',adminRouter)
app.use('/news',newsRouter)
app.use('/category', categoryRouter)
app.use('/user',userRouter)

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`.yellow.bold)
})