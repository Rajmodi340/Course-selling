import express from "express";
import mongoose from "mongoose";
import {v2 as cloudinary} from "cloudinary"
const app=express()
import dotenv from "dotenv"
import courseRoute from "./routes/courseroute.js"
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
app.use(express.json())
app.use(cookieParser())
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp/"
    })
)
dotenv.config()
app.use("/api/v1/course",courseRoute)


try{
mongoose.connect(process.env.MONGO_URL)
console.log("DB connected successfully");
}
catch(error){
    console.log("Error in DB connection",error);
}
cloudinary.config({
cloud_name:process.env.CLOUD_NAME,
api_key:process.env.CLOUD_API_KEY,
api_secret:process.env.CLOUD_SECRET_KEY
})
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})