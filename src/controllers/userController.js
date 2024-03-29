import User from "../models/userModel.js";
import News from "../models/newsModel.js";
import nodemailer from 'nodemailer';
import config from "../config/data.js";
import { validationResult, matchedData } from "express-validator";
import bcrypt from 'bcrypt';
import UserOtpVarification from "../models/optvarification.js";
import randomstring from 'randomstring';
import jwt from 'jsonwebtoken';
import { isValidObjectId } from "mongoose";
import Category from "../models/categoryModel.js";



//++++++++++++++++++++++++++++++++++ otp send :- +++++++++++++++++++++++++++++++++++++++++++++//

export const sendOtpToEmail = async (req, res) => {
    try {
        const email = req.body.email;

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp-mail.outlook.com",
            port: 587,
            secureConnection: false,
            tls: {
                rejectUnauthorized: false,
            },
            auth: {
                user: config.emailUser,
                pass: config.emailPassword,
            },
        });

        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: "For Reset Password by otp", // Subject line
            text: "Hello world?", // plain text body
            html:
                `<p>Enter ${otp}  and verify your email address , this opt will expire in 4 hours only </a>`,
        };

        //hash the otp :-
        const saltRound = 10;
        const hashOTP = await bcrypt.hash(otp, saltRound);

        //create token :-
        const randomString = randomstring.generate(); 

        const newOtpVarification =  new UserOtpVarification({
            otp: hashOTP,
            email:email,
            token:randomString
        })

        await newOtpVarification.save();

        await transporter.sendMail(mailOptions);

        res.status(200).json({ status: true, message: "varification OTP  mail is sent", data: email });

    } catch (error) {
        return res.status(400).json({ status: false, message: error.message })
    }

}


//++++++++++++++++++++++++++++++++++++ user verifyOTP ++++++++++++++++++++++++++++++++++++++++++++//


export const verifyOTP = async(req,res) =>{
    try {
        let { email, otp } = req.body;

    if (!email || !otp) {
      throw new Error("Please Enter otp or email");
    }

    const otpRecord = await UserOtpVarification.findOne({ email : email });
    

    if (otpRecord <= 0) {
      throw new Error("Account does not exist");
    }

    const hashedOTP = otpRecord.otp;

    const validOTP = await bcrypt.compare(otp, hashedOTP);

    if (!validOTP) {
      res
        .status(400)
        .send({
          status: false,
          message: "Invalid code passes , check your Inbox",
        });
    }

    res
      .status(200)
      .send({ status: true, message: "User OTP is verified Successfully" ,token:otpRecord.token});

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

//+++++++++++++++++++++++++++++++++++++ user create ++++++++++++++++++++++++++++++++++++++++++++++//

export const createUser = async(req,res) =>{
    try {
         const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

        const data = matchedData(req);

        let matchOtpEmailToken = await UserOtpVarification.findOne({email:data.email,token:req.body.token})
        console.log(matchOtpEmailToken);
        if(!matchOtpEmailToken) return res.status(400).json({message:"email is not verified"});


        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(data.password, salt);
        req.body.password = newPassword;

        const userCreate = await User.create(req.body);

        res.status(201).json({ status: true, message: "user is created successfully", data: userCreate })

        await UserOtpVarification.deleteMany({ email:data.email });

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

//++++++++++++++++++++++++++++++++++++++ userLogin +++++++++++++++++++++++++++++++++++++++++++++++//

export const loginUser = async(req,res) =>{
    try {

        const error = validationResult(req)

        if (!error.isEmpty) {
            return res.status(400).json({ errors: error.array()[0].msg })
        }

        const data = matchedData(req);

        const finddata = await User.findOne({ email: data.email })

        if (!finddata) return res.status(404).json({ status: false, msg: "user data is not found" })

        const passwordMatch = await bcrypt.compare(data.password, finddata.password)

        if (passwordMatch == false)
            return res.status(400).json({ status: false, message: "Please enter correct password" });

        const user = await User.findOne({
            email: req.body.email,
            password: finddata.password,
        });

        if (!user)
            return res.status(400).json({ status: false, message: "email or password are wrong" });

        const usertoken = process.env.JWT_USER_TOKEN

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                exp: Math.floor(Date.now() / 1000) + 120 * 60,
            },
            usertoken
        );

        res.status(200).json({
            status: true,
            message: "user Login Successfully",
            userId: user._id,
            token: token,
        });

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}


//+++++++++++++++++++++++++++++++++++++ user profile Update +++++++++++++++++++++++++++++++++++++++//

export const updateUserProfile = async(req,res) =>{
    try {
        const error = validationResult(req);
        //  console.log("error:",error);
        if (!error.isEmpty()) {
          return res.status(400).json({ errors: error.array()[0].msg });
        }
    
        const data = matchedData(req);
    
        const userIdByToken = req.userId;
    
        if (!isValidObjectId(userIdByToken))
          return res
            .status(400)
            .json({ status: false, message: "Token is not validate" });
    
        //authorization:-
        if (data.userId !== userIdByToken) {
            return res.status(403).json({ status: false, message: "Unauthorize access" });
        }
          const userUpdate = await User.findOneAndUpdate(
            { _id: data.userId},
            { $set: data },
            { new: true }
          );
    
          if (!userUpdate)
            return res.status(404).json({
              status: false,
              message: "user data is not found ",
            });
    
          res.status(200).send({
            status: true,
            message: "user's profile is updated successfully",
            data: userUpdate,
          });

      } catch (error) {
        res.status(500).json({ status: false, message: error.message });
      }
}

//++++++++++++++++++++++++++++++++++ User Saved bookmarks +++++++++++++++++++++++++++++++++++++++++//

export const saveBookmarks = async(req,res) =>{
    try {
        const {bookmarks} = req.body;

        const userIdFromToken = req.userId
    
        if (!isValidObjectId(userIdFromToken))
          return res.status(400).json({ status: false, message: "Token is not validate" });

        if (!isValidObjectId(bookmarks))
          return res.status(400).json({ status: false, message: "bookmakrs is not validate" });

        const findfromtoken = await User.findById(userIdFromToken)

        if(!findfromtoken) return res.status(404).json({status:false,message:"User is not found"})

        const savebookmark = await User.findByIdAndUpdate(userIdFromToken,
            { $push: { bookmarks: bookmarks }},{new:true}) 

        const updateNews = await News.updateOne({_id:bookmarks},{$inc:{ numberOfBookmarks :1}})

         res.status(200).json({status:true,message:"User save this news",data:savebookmark })

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
} 


//++++++++++++++++++++++++++++++++++ removed from bookmarks +++++++++++++++++++++++++++++++++++++++++++++++++++//

export const removeSavedNews = async(req,res) =>{
    try {
        const newsId = req.params.newsId;

        const userIdFromToken = req.userId
    
        if (!isValidObjectId(userIdFromToken))
          return res.status(400).json({ status: false, message: "Token is not validate" });

        if (!isValidObjectId(newsId))
          return res.status(400).json({ status: false, message: "newsId is not validate" });

        const findfromtoken = await User.findById(userIdFromToken)

        if(!findfromtoken) return res.status(404).json({status:false,message:"User is not found"})

        const removebookmark = await User.findByIdAndUpdate(userIdFromToken,
            { $pull: { bookmarks: newsId }},{new:true}) 
        
            await News.updateOne({_id: newsId},{$inc:{numberOfBookmarks:-1}})

         res.status(200).json({status:true,message:"User removed this news from Bookmarks",data:removebookmark})

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}


//++++++++++++++++++++++++++++++++++++++++ add category +++++++++++++++++++++++++++++++++++++++++++++++++//

export const addcategory = async(req,res) =>{
    try {
        const {category,type} = req.body;

        const userIdFromToken = req.userId
    
        if (!isValidObjectId(userIdFromToken))
          return res.status(400).json({ status: false, message: "Token is not validate" });

        if (!isValidObjectId(category))
          return res.status(400).json({ status: false, message: "preference is not validate" });

        if(["green", "yellow", "red"].indexOf(type) == -1)  
          return res.status(400).json({ status: false, message: "type must be in green , yellow , red" });;

        const findfromtoken = await User.findById(userIdFromToken)

        const findCategory = await Category.findOne({_id:category})

        if(!findfromtoken) return res.status(404).json({status:false,message:"User is not found"})
        
    //++++++++++++ find the category exist in user's preference of not +++++++++// 
        const findExistCategory = await User.findOne({ "preference.category" : category }) 

        if(!findExistCategory) {
    //+++++++++++++ category is not exist in the user's preference +++++++++++++++// 

            const addcategory = await User.findByIdAndUpdate(userIdFromToken,
                { $addToSet:
                    { preference: {category :category , type : type} }
                },{new:true}
              ).populate({
                path: "preference.category",
                select: "category -_id ",
              })        
    
            res.status(200).json({
                status:true,
                message:`user add ${findCategory.category} category`,
                data:addcategory
            })
        }
        
    //+++++++++++++ category is already exist,only category type will be updated +++++++++++++//

            const updateCategory = await User.findOneAndUpdate({"preference.category" : category},
                    {
                        $set:{"preference.$.type":type}
                    },
                    {new:true}
                ).populate({
                    path: "preference.category",
                    select: "category -_id ",
                  });
      

            res.status(200).json({
                status:true,
                message:`user update ${findCategory.category} category to type ${type}`,
                data:updateCategory
            })

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

//+++++++++++++++++++++++++++++++++++++++ remove Category +++++++++++++++++++++++++++++++++++++++++++++++//

export const removeCategory = async(req,res) =>{
    try {
        const categoryId = req.params.categoryId;

        const userIdFromToken = req.userId;
    
        if (!isValidObjectId(userIdFromToken))
          return res.status(400).json({ status: false, message: "Token is not validate" });

        if (!isValidObjectId(categoryId))
          return res.status(400).json({ status: false, message: "preference is not validate" });

        const findfromtoken = await User.findById(userIdFromToken)

        if(!findfromtoken) return res.status(404).json({status:false,message:"User is not found"})

        const removecategory = await User.findByIdAndUpdate(userIdFromToken,
            { $pull: { preference: {category :categoryId} }},{new:true})
            .populate({
                path: "preference.category",
                select: "category -_id ",
              })

        const findCategory = await Category.findOne({_id:categoryId})
    
         res.status(200).json({status:true,message:`user remove ${findCategory.category} category`,data:removecategory})
    
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}   
    
//++++++++++++++++++++++++++++++++++++++ get preference +++++++++++++++++++++++++++++++++++++++++++//
    
export const getPrefenceUser = async(req,res) =>{
            try {
                const userIdFromToken = req.userId; // Assuming you have implemented user authentication and obtained the user ID from the request

                // Retrieve the user's preferences from the database
                const user = await User.findById(userIdFromToken).select('preference');
                
               const preferenceFilters = [];

                const categories =user.preference.map((item) => {
                    let preferenceObject = { categoryId: item.category };
                    if (item.type === "yellow") {
                      preferenceObject.type = "major";
                    } else if (item.type === "red") {
                      return item.category;
                    }
                    preferenceFilters.push(preferenceObject);
                    return item.category;
                  });
                  
                //   console.log(preferenceFilters);

                const lengthPurpus  = await News.find({
                    $or:[
                          {
                             categoryId: { $nin: categories },
                          },
                          ...preferenceFilters     
                    ]
                   
                }).countDocuments()
               

                //---------- news pagination ------------//
                let page = Number(req.query.page) || 1;
                let limit = Number(req.query.limit) || 5;
  
                let skip = (page - 1) * limit;

                let hasPage=true;

                if(lengthPurpus<=page*limit) {
                    hasPage = false
                }


                // Fetch news articles based on the user's preferences
                const newsArticles  = await News.find({
                    $or:[
                          {
                             categoryId: { $nin: categories },
                          },
                          ...preferenceFilters     
                    ]
                   
                }).sort({ createdAt: -1 }).populate({
                    path:'categoryId',
                    select: "category -_id ",
                }).skip(skip).limit(limit);


                res.status(200).json({status:true, hasPage : hasPage, totalNews:lengthPurpus,data:newsArticles});
        
       } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}   


//++++++++++++++++++++++++++++++++ User Preference of news ++++++++++++++++++++++++++++++++++++++++//

// export const userPreference = async (req, res) => {
//     try {
//         const userId = req.userId; // Assuming you have implemented user authentication and obtained the user ID from the request
  
//         // Retrieve the user's preferences from the database
//         const user = await User.findById(userId).select('preference');
    
//         // Extract the preferred categories and types from the user's preferences
//         const preferredCategories = user.preferences
//             .filter(preference => preference.type !== 'no news')
//             .map(preference => preference.category);
//         const preferredTypes = user.preferences
//             .filter(preference => preference.type !== 'no news')
//             .reduce((types, preference) => {
//                 if (preference.type === 'all news') {
//                     types.push('all news');
//                 } else if (preference.type === 'major news') {
//                     types.push('major');
//                 }
//                 return types;
//             }, []);
  
//         // Fetch news articles based on the user's preferences
//         const newsArticles = await News.find({
//             categoryId: { $in: preferredCategories },
//             type: { $in: preferredTypes }
//         }).sort({ createdAt: -1 });
  
//         res.json(newsArticles);
//     } catch (error) {
//         console.error('Error fetching news articles:', error);
//         res.status(500).json({ error: 'Failed to fetch news articles' });
//     }
//   };


  // export const upreference = async (req, res) => {
  //   try {
  //     const userId = req.userId; // Assuming you have implemented user authentication and obtained the user ID from the request
  
  //     // Retrieve the user's preferences from the database
  //     const user = await User.findById(userId).select('preference');
  
  //     // Extract the preferred category names and types from the user's preferences
  //     const preferredCategories = user.preference.map(preference => preference.category);
  //   //   console.log("preferredCategories",preferredCategories);
  
  //     // Fetch news articles based on the user's preferences
  //     const newsArticles = await News.find({
  //       categoryId: { $in: preferredCategories },
  //     }).sort({ createdAt: -1 }) .populate({
  //       path: "categoryId",
  //       select: "category -_id ",
  //     });
  
  //     res.status(200).json({status:true,data:newsArticles});
  //   } catch (error) {
  //       res.status(500).json({ status: false, message: error.message });
  //   }
  // };