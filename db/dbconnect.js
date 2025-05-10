import mongoose from "mongoose";

const connectDB = async () => {
    try {

        if(!process.env.MONGODB_URI){
           
           console.log("MONGODB_URI not found");
           process.exit(1);
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error: ", error);
        process.exit(1);
    }
};

export default connectDB;