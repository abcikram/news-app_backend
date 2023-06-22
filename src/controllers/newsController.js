import News from "../models/newsModel.js";
import Category from "../models/categoryModel.js";
import { validationResult ,matchedData} from "express-validator";
import { isValidObjectId } from "mongoose";


//++++++++++++++++++++++++++++++++++++++++ create category  ++++++++++++++++++++++++++++++++++++++++++++//

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

//+++++++++++++++++++++++++++++++++++++++++ create news ++++++++++++++++++++++++++++++++++++++++++++++++//

export const createNews = async(req,res) =>{
    try{
        
        const error = validationResult(req);
 
        if (!error.isEmpty()) {
           return res.status(400).json({ errors: error.array()[0].msg });
        }

        const userIdFromToken = req.userId;

        if (!isValidObjectId(userIdFromToken))
            return res.status(400).json({ status: false, message: "Token is not valid" });

        const createNews = await News.create(req.body);

        res.status(201).json({status:true, message:"admin add the news successfully", data:createNews})
    }catch(error){
        return res.status(500).json({ status: false, message: error.message });
    }
}

//+++++++++++++++++++++++++++++++++++++++++ get particular news ++++++++++++++++++++++++++++++++++++++++++++//

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

//++++++++++++++++++++++++++++++++++++++++ Top Headline news ++++++++++++++++++++++++++++++++++++++++++++++++++//

export const newsTopHeadlline = async(req,res) =>{
    try {

        //---------- news pagination ------------//
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 3;

        let skip = (page - 1) * limit;

        const HeadlineNews = await News.find({
            "createdAt": { $gt: new Date(Date.now() - 4 * 60 * 60 * 1000) }
        }).sort({ "numberOfBookmarks": -1 }).skip(skip).limit(limit)
        
        if (HeadlineNews.length == 0) {
            return res.status(404).send({ status: false, message: "No headline news found" });
        }

        res.status(200).json({
            status: true,
            message: "This is today's following Headline news",
            data: HeadlineNews
        })
        
      } catch (error) {
          return res.status(500).json({ status: false, message: error.message });
      }
}

//+++++++++++++++++++++++++++++++++++++++++++++ trending news ++++++++++++++++++++++++++++++++++++++++++++++++//

export const trendingTopic = async(req,res) =>{
    try {
    //---------- news pagination ------------//
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 3;
  
    let skip = (page - 1) * limit;

    // we filtering the news which is created 7 hours ago. and then we filtering ,whose type it is. 
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

//+++++++++++++++++++++++++++++++++++++++++++ get All News ++++++++++++++++++++++++++++++++++++++++++++++++++//

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

//+++++++++++++++++++++++ select particular category and seclect major or non major  or no news ++++++++++++++//

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


//+++++++++++++++++++++++++++++++++++++ update The news +++++++++++++++++++++++++++++++++++++++++++++++++++++++//

export const updateNews = async (req, res) => {
    try {
        const newsId = req.params.newsId;

        const userIdFromToken = req.userId;

        if (!isValidObjectId(newsId)) return res.status(400).json({ status: false, message: "newsId is not valid" });

        if (!isValidObjectId(userIdFromToken)) return res.status(400).json({ status: false, message: "Token is not valid" });

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

        const data = matchedData(req);

        const updateNews = await News.findByIdAndUpdate({ _id: newsId }, {
            $set: data
        }, { new: true }
        );

        res.status(200).json({ status: true, message: "admin update this news successfully", data: updateNews })
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}


//++++++++++++++++++++++++++++++++++++++ remove news from data base ++++++++++++++++++++++++++++++++++++++++//

export const removeNews = async (req, res) => {
    try {
        const newsId = req.params.newsId;
        
        const userIdFromToken = req.userId;

        if (!isValidObjectId(newsId)) return res.status(400).json({ status: false, message: "newsId is not valid" });

        if (!isValidObjectId(userIdFromToken)) return res.status(400).json({ status: false, message: "Token is not valid" });

        const removeNews = await News.deleteOne({_id:newsId});

        res.status(200).json({ status: true, message: "admin remove this news successfully"})
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

