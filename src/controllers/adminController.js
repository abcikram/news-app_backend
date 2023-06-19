import Admin from "../models/adminModel.js";
import bcrypt  from 'bcrypt'
import { validationResult, matchedData } from "express-validator";
import jwt from 'jsonwebtoken'
import { isValidObjectId } from "mongoose";


export const createAdmin = async(req,res) => {
    try{
 
        const error = validationResult(req);
 
        if (!error.isEmpty()) {
           return res.status(400).json({ errors: error.array()[0].msg });
        }

        const data = matchedData(req);

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(data.password, salt);
        req.body.password = newPassword;

        const adminCreate = await Admin.create(req.body);

        res.status(201).json({status:true, msg:"admin is created successfully", data:adminCreate})

    }catch(error){
        return res.status(500).json({ status: false, message: error.message });
    }
}


export const adminLogin = async(req,res) => {
    try{
  
        const error = validationResult(req)

        if(!error.isEmpty){
            return res.status(400).json({errors:error.array()[0].msg})
        }

        const data = matchedData(req);

        const finddata = await Admin.findOne({email:req.body.email})

        if(!finddata) return res.status(404).json({status:false,msg:"admin data is not found"})

        const passwordMatch =  await bcrypt.compare(req.body.password,finddata.password) 

       
        if (passwordMatch == false)
        return res.status(400).json({ status: false, message: "Please enter correct password" });
  
      const admin = await Admin.findOne({
        email: req.body.email,
        password: finddata.password,
      });

      if (!admin)
        return res.status(400).json({ status: false, message: "email or password are wrong" });

      const admintoken = process.env.JWT_TOKEN
  
      const token = jwt.sign(
        {
          adminId: admin._id.toString(),
          exp: Math.floor(Date.now() / 1000) + 120 * 60,
        },
        admintoken
      );
  
      res.status(200).json({
        status: true,
        message: "admin Login Successfully",
        adminId : admin._id,
        token: token,
      });

    }catch(error){
        return res.status(500).json({ status: false, message: error.message });
    }

}


export const getAllAdmin = async(req,res) => {
  try{
    const userIdByToken = req.userId;

    if (!isValidObjectId(userIdByToken)) {
      return res.status(400).send({ status: false, message: "token is not valid" });
    }

    const checkAdminroles = await Admin.findById(userIdByToken);
    if (!checkAdminroles)
      return res.status(404).send({ status: false, message: "Admin data not found" });

    const findAdmin = await Admin.find({});

    if(findAdmin.length == 0) return res.status(404).json({status:false,msg:"Admin data is not found"})

    res.status(200).json({status:true,message:"data found",data:findAdmin})

  }catch(error){
    return res.status(500).json({ status: false, message: error.message });
  }
   
}


export const getParticularAdmin = async(req,res) =>{
    try{

        const error = validationResult(req)
    
        if(!error.isEmpty){
            return res.status(400).json({errors:error.array()[0].msg})
        }
    
        const data = matchedData(req);

        const userIdByToken = req.userId;
        
        if (!isValidObjectId(userIdByToken)) {
          return res
            .status(400)
            .send({ status: false, message: "token is not valid" });
        }
    
        //authorization:-
        if (data.adminId !== userIdByToken) {
            return res.status(403).send({ status: false, message: "Unauthorize access" });
        }
          const adminAccess = await Admin.findById(data.adminId);
    
          if (!adminAccess)
            return res.status(404).send({ status: false, message: "Data not found" });
    
          res.status(200).send({ status: true, data: adminAccess });
    }catch(error){
        return res.status(500).json({ status: false, message: error.message });
    }

}


export const updateAdmin = async(req,res) => {
    try{
        const error = validationResult(req);
 
        if (!error.isEmpty()) {
           return res.status(400).json({ errors: error.array()[0].msg });
        }
    
        const data = matchedData(req);
        const adminAccess = await Admin.findById(data.adminId);
        
        if (!adminAccess)
          return res.status(404).send({ status: false, message: "Data not found" });
    
        const userIdByToken = req.userId;
            
        if (!isValidObjectId(userIdByToken)) {
          return res.status(400).send({ status: false, message: "token is not valid" });
        }
    
        if (data.adminId !== userIdByToken) {
            return res.status(403).send({ status: false, message: "Unauthorize access" });
        }
    
        const admin = await Admin.findByIdAndUpdate(data.adminId,{
            $set: data
        },{new:true})
    
        res.status(200).send({ status: true,msg:"Admin is updated successfully", data: admin });
    }catch(error){
        return res.status(500).json({ status: false, message: error.message });
    }
}



export const deleteAdmin = async(req,res) => {
    try{
        const error = validationResult(req);
 
        if (!error.isEmpty()) {
           return res.status(400).json({ errors: error.array()[0].msg });
        }
    
        const data = matchedData(req);
        const adminAccess = await Admin.findById(data.adminId);
        
        
        if (!adminAccess)
          return res.status(404).send({ status: false, message: "Data not found" });
    
        const userIdByToken = req.userId;
            
        if (!isValidObjectId(userIdByToken)) {
          return res.status(400).send({ status: false, message: "token is not valid" });
        }
    
        if (data.adminId !== userIdByToken) {
            return res.status(403).send({ status: false, message: "Unauthorize access" });
        }
    
        const admin = await Admin.deleteOne(data.adminId)
    
        res.status(200).send({ status: true,msg:"Admin is deleted successfully"});
    }catch(error){
        return res.status(500).json({ status: false, message: error.message });
    }
}