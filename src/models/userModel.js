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

// import mongoose from 'mongoose';

// const { Schema } = mongoose;

// const userSchema = new Schema(
//     {
//         name: {
//             type: String,
//             required: true
//         },
//         phone: {
//             type: String,
//             required: true
//         },
//         email: {
//             type: String,
//             trim: true,
//             required: true
//         },
//         password: {
//             type: String,
//             required: true
//         },
//         bookmarks: [
//             {
//                 type: Schema.Types.ObjectId,
//                 ref: 'News'
//             }
//         ],
//         preferences: [
//             {
//                 category: {
//                     type: Schema.Types.ObjectId,
//                     ref: 'Category'
//                 },
//                 type: {
//                     type: String,
//                     enum: ['all news', 'major news', 'no news'],
//                     default: 'all news'
//                 }
//             }
//         ]
//     },
//     {
//         timestamps: true
//     }
// );

// const User = mongoose.model('User', userSchema);

// export default User;
