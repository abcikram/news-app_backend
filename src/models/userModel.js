import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            trim: true,
            required: true
        },
        password: {
            type: String,
            required:true
        },
        bookmarks:{
            type:[ObjectId],
            ref:'news',
        },
        preference:[
            {
                category : {
                    type:ObjectId,
                    ref:'category'
                },
                type: {
                    type:String,
                    enum:['green','yellow','red'],
                    default:'green' 
                }
            }
        ]
    },
      {
        timestamps: true
      },
)

const User = mongoose.model('user',userSchema);

export default User;

