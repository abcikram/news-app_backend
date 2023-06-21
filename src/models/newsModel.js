import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;


const newsSchema = new mongoose.Schema({
    title : {
        type:String,
        required:true,
    },
    description :{
        type: String,
        required:true,
    },
    image : {
        type:String,
        default:"https://unsplash.com/photos/04X1Yp9hNH8",
    },
    originalURL:{
        type:String,
        required:true,
    },
    type :{
        type:String,
        enum:["major","no_major"],
        required:true,
    },
    numberOfBookmarks:{
        type:Number,
        default:0,
    },
    categoryId:{
       type:ObjectId,
       ref:"category",
       required:true,
    },
},{timestamps:true})



const News = mongoose.model('news',newsSchema)

export default News     