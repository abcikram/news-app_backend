import User from "../models/userModel.js";
import nodemailer from 'nodemailer';
import config from "../config/data.js";

//db.sessions.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 })
import { validationResult, matchedData } from "express-validator";
import bcrypt from 'bcrypt';
import UserOtpVarification from "../models/optvarification.js";

export const createUser = async(req,res) =>{
    try {
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array()[0].msg });
        }

        const data = matchedData(req);

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(data.password, salt);
        req.body.password = newPassword;

        const userCreate = await User.create(req.body);

        // await sendOtpvarificationEmail(data.email,res)

        res.status(201).json({ status: true, msg: "user is created successfully", data: userCreate })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

export const loginUser = async(req,res) =>{
    try {

        const error = validationResult(req)

        if (!error.isEmpty) {
            return res.status(400).json({ errors: error.array()[0].msg })
        }

        const data = matchedData(req);

        const finddata = await User.findOne({ email: req.body.email })

        if (!finddata) return res.status(404).json({ status: false, msg: "user data is not found" })

        const passwordMatch = await bcrypt.compare(req.body.password, finddata.password)


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
                adminId: admin._id.toString(),
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


export const sendOtpvarificationEmail = async (email, res) => {
    try {
        console.log(email);
        const userData = await User.findOne({ email: email });
        console.log("userData",userData);

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
                `<p>Enter ${otp}  and verify your email address , this opt will expire in 10 minute only </a>`,
        };

        //hash the otp :-
        const saltRound = 10;
        const hashOTP = await bcrypt.hash(otp, saltRound);

        const newOtpVarification = await new UserOtpVarification({
            adminId: userData._id,
            otp: hashOTP,
            createdAt: Date.now(),
            expireAt: Date.now() + 600000,
        })

        await newOtpVarification.save();

        await transporter.sendMail(mailOptions);

        res.status(200).send({ status: true, message: "varification OTP  mail is sent", data: email });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message })
    }

}

export const updateUserProfile = async(req,res) =>{

}

export const updateUserBookmarks = async(req,res) =>{

} 