import mongoose from "mongoose";

export const connectToDB = async() =>{

    const {MONGO_URI} = process.env;
    if (!MONGO_URI) {
        throw new Error('MONGO_URI is not defined in environment variables');
    }
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected");
    });

    await mongoose.connect(MONGO_URI, {
        dbName: "chat-app"
    });
}