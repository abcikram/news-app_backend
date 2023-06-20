import News from "../models/newsModel.js";
import Category from "../models/categoryModel.js";
import { validationResult } from "express-validator";


//create category :-
export const createCategory = async(req,res) =>{
    try{
        const error = validationResult(req);
 
        if (!error.isEmpty()) {
           return res.status(400).json({ errors: error.array()[0].msg });
        }

       const addTopic = await Category.create(req.body)
       res.status(201).json({status:true, message:"topic is created", data:addTopic})
    }catch(error){
        return res.status(500).json({status:false, message :error.message})
    }
}

//create news :-
export const createNews = async(req,res) =>{
    try{

        const error = validationResult(req);
 
        if (!error.isEmpty()) {
           return res.status(400).json({ errors: error.array()[0].msg });
        }
        
        const createNews = await News.create(req.body);

        res.status(201).json({status:true, message:"admin is created successfully", data:createNews})
    }catch(error){
        return res.status(500).json({ status: false, message: error.message });
    }
}


export const particularCategory = async(req,res) =>{
    try{

        const error = validationResult(req);
 
        if (!error.isEmpty()) {
           return res.status(400).json({ errors: error.array()[0].msg });
        }

        const categoryId  = req.params.categoryId
       
        const getCategory = await Category.findById(categoryId);
       
        res.status(200).json({status:true, data:getCategory})
    }catch(error){
        return res.status(500).json({ status: false, message: error.message });
    }   
}

export const newsTopHeadlline = async(req,res) =>{

}


export const trendingTopic = async(req,res) =>{
    try {
    //---------- news pagination ------------//
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 3;
  
    let skip = (page - 1) * limit;

    // we filtering the news which is created 7 hours ago . and then we filtering  , whose type is 
    const trendingNews = await News.find({ 
        "createdAt" : {$gt:new Date(Date.now() - 7*60*60*1000)},type:'major'
      }).skip(skip).limit(limit)
 
    if (trendingNews.length == 0) {
      return res.status(404).send({ status: false, message: "No news found" });
    }

    res.status(200).json({status:true,message:"The following trending news" ,data:trendingNews})
        
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
    
}


export const getAllNews = async (req, res) => {
 //search the news :-
  try {
    
  const { category ,title, sortBy } = req.query;

  if(category){
    const findCategory =  await Category.findOne({category});

    const getNewsCategory = await News.find({categoryId:findCategory._id})
  
    return res.status(200).json({data:getNewsCategory})
  }

  const filter = {};

  if(title){
         filter.title = {$regex : title , $options: "i"}
  }

  // sort By :- 
  let apiData = News.find(filter);

  if (sortBy) {
    let sortFix = sortBy.replace(",", " ");
    apiData = apiData.sort(sortFix);
  }

  const findNews = await apiData;
  res.status(200).json({status:true,data:findNews})

  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }

}


export const findTypedata = async(req,res) =>{
    try {
        const {category,color} = req.query;
    
        const findCategory =  await Category.findOne({category});
  
   if(color == 'red'){

        const redColor = await News.find({categoryId: {$nin: [findCategory._id]}}).populate('categoryId')
    
        res.status(200).json({status:true,data: redColor})
    }
    
    else if(color == 'yellow'){

        const yellowColor = await News.find( {
            $or: [
                { categoryId: findCategory._id, type: "major" }, 
                {categoryId: {$nin: [findCategory._id]}}
            ],
         } ).populate('categoryId') 

         res.status(200).json({status:true,data: yellowColor})
    }

    else if(color == 'green'){
        
        const greenColor = await News.find({
            $or: [
              { categoryId: findCategory._id },
              { categoryId: { $ne: findCategory._id } }
            ]
        }).populate('categoryId')

        res.status(200).json({status:true,data: greenColor})
      }

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}


