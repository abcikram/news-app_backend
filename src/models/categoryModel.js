import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    topic:{
        type:String,
        required :true,
    },
    imageTopic:{
        type:String,
        default:"https://unsplash.com/photos/e616t35Vbeg",
    }
    
},{timestamps:true})

const Category = mongoose.model("topic",categorySchema)

export default Category