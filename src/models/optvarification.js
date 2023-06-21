import mongoose from "mongoose";

const userOtpVarificationSchema = new mongoose.Schema(
    {
        userId: String,
        otp: String,
        email : String,
        token : String,
    }, {
    timestamps: true,
  }
)

userOtpVarificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 324000 });

const UserOtpVarification = mongoose.model("otp", userOtpVarificationSchema)

export default UserOtpVarification;




// The code you provided is a MongoDB index creation statement using the index() method. It creates an index on the createdAt field of the userOtpVarificationSchema collection and specifies an expiration time of 60 seconds for the documents in that collection.

// The { createdAt: 1 } part indicates that the index is created on the createdAt field in ascending order (1 represents ascending order, while -1 represents descending order).

// The { expireAfterSeconds: 60 } part sets the expiration time for the documents. It means that any document in the userOtpVarificationSchema collection that has a createdAt field will automatically be deleted from the collection after 60 seconds from the time it was created.

// This type of index is commonly used for creating time-based indexes that automatically remove data after a certain period, such as temporary verification codes or session tokens.