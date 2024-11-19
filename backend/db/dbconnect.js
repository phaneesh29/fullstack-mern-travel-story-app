import mongoose from "mongoose";
import "dotenv/config"

function connectDB(){
    if (!process.env.MONGO_URI) {
        console.log("MONGO_URI is not defined in the environment variables.");
        return;
    }
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Connected To DB")
    }).catch((err)=>{
        console.log("Not Connected ",err.message)
    })
}

export default connectDB