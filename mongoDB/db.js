import mongoose from "mongoose";

const connectDB = async () => {
    try {

        const db = process.env.MONGO_URI;  // it is import from .env filem MONGO_URI means mongoDB conncection link 

        const conn = await mongoose.connect(`${db}`, {
            useUnifiedTopology: true, //False by default. Set to true to opt in to using the MongoDB driver's new connection management engine. 
            useNewUrlParser: true,  //The underlying MongoDB driver has deprecated their current connection string parser. Because this is a major change, they added the useNewUrlParser flag to allow users to fall back to the old parser if they find a bug in the new parser.
        })
        console.log(`MongoDB conncected : ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.error(`Error :${error.message}`.red.underline.bold)
    }

}

export default connectDB