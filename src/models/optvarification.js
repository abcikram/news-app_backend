import mongoose from "mongoose";

const UserOtpVarificationSchema = new mongoose.Schema(
    {
        userId: String,
        otp: String,
        createdAt: Date,
        expireAt: Date,
    }, {
    timestamps: true,
  }
)

//  UserOtpVerificationSchema.index({ expireAt: 1 }, { expireAfterSeconds: 3000 });

const UserOtpVarification = mongoose.model("otp", UserOtpVarificationSchema)

export default UserOtpVarification;