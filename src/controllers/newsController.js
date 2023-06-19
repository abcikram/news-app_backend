import News from "../models/newsModel.js";
import Category from "../models/categoryModel.js";
import { validationResult } from "express-validator";

export const createCategory = async(req,res) =>{
    try{
       const  {topic} = req.body;

       const addTopic = await Category.create(req.body)
       res.status(201).json({status:true, message:"topic is created", data:addTopic})
    }catch(error){
        return res.status(500).json({status:false, message :error.message})
    }
}

export const createNews = async(req,res) =>{
    try{

        const error = validationResult(req);
 
        if (!error.isEmpty()) {
           return res.status(400).json({ errors: error.array()[0].msg });
        }
        
        const createNews = await News.create(req.body);

        res.status(201).json({status:true, msg:"admin is created successfully", data:createNews})
    }catch(error){
        return res.status(500).json({ status: false, message: error.message });
    }
}


