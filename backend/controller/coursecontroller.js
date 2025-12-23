import Course from "../models/coursemodel.js"
// import Course from "../models/coursemodel.js"
import {v2 as cloudinary} from "cloudinary"
 export const createcourse=async(req,res)=>{
    try{
        const {title,description,price}=req.body || {}
        if(!title || !description || !price ){
            return res.status(400).json({message:"All fields are required"})
        }
        if(!req.files || Object.keys(req.files).length===0){
            return res.status(400).json({message:"Image is required"})
        }
        const image=req.files.image
const allowedtypes=["image/jpeg","image/jpg","image/png"]
if(!allowedtypes.includes(image.mimetype)){
    return res.status(400).json({message:"Invalid image type"})
}
// cloudinary code
const cloud =await cloudinary.uploader.upload(image.tempFilePath)

if(!cloud||cloud.error){
    return res.status(500).json({message:"Image upload failed"})
}


const courseData={
    title,
    description,
    price,
    image:{
        public_id:cloud.public_id,
        url:cloud.url
    }
}
  const course=await Course.create(courseData)
  res.json({message:"Course created successfully",course})
    }

    catch(error){
        console.error("Error in creating course",error);
        return res.status(500).json({message:"Server error"})
}
 }
 export const updatecourse=async(req,res)=>{
    const {id}=req.params
    const {title,description,price,image}=req.body || {}
    try{
        const updatedCourse=await Course.updateOne({
            _id:id
        },{
            title,
            description,
            price,
            image:{
                public_id:image?.public_id,
                url:image?.url
            }
        })
        res.json({message:"Course updated successfully",updatedCourse})
    }
    catch(error){
        console.error("Error in updating course",error);
        return res.status(500).json({message:"Server error"})
    }
 }
 export const deletecourse=async(req,res)=>{
    const {id}=req.params
    try{
const deletecourse=await Course.deleteOne({
    _id:id

})
if(!deletecourse){
    return res.status(404).json({message:"Course not found"})
}
res.json({message:"Course deleted successfully"})
    }
    catch(error){
        res.status(500).json({message:"Server error"})
    }
 }