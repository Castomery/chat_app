import mongoose from "mongoose";

export const connectToDB = async() =>{


    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected");
    });

    await mongoose.connect(process.env.MONGO_URI!, {
        dbName: "chat-app"
    });
}