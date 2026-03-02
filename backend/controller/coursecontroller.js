import Course from "../models/coursemodel.js"
import { Purchase } from "../models/purchasemodel.js"
import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"
dotenv.config()
 export const createcourse=async(req,res)=>{
    const adminId=req.adminId
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
    },
    createrId:adminId
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
    const adminId=req.adminId
    const {id}=req.params
    try{
        const courseSearch=await Course.findById(id)
        if(!courseSearch){
            return res.status(400).json({errors:"Course not found"})
        }

        // Prepare update payload
        const updates = {}
        if(req.body.title) updates.title = req.body.title
        if(req.body.description) updates.description = req.body.description
        if(req.body.price) updates.price = req.body.price

        // If a new image file was uploaded, handle cloudinary upload
        if(req.files && req.files.image){
            const imageFile = req.files.image
            const allowedtypes=["image/jpeg","image/jpg","image/png"]
            if(!allowedtypes.includes(imageFile.mimetype)){
                return res.status(400).json({message:"Invalid image type"})
            }
            const cloud = await cloudinary.uploader.upload(imageFile.tempFilePath)
            if(!cloud || cloud.error){
                return res.status(500).json({message:"Image upload failed"})
            }
            updates.image = {
                public_id: cloud.public_id,
                url: cloud.url
            }
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, updates, { new: true })
        return res.json({message:"Course updated successfully", course: updatedCourse})
    }
    catch(error){
        console.error("Error in updating course",error);
        return res.status(500).json({message:"Server error"})
    }
 }
 export const deletecourse=async(req,res)=>{
    const adminId=req.adminId
    const {id}=req.params
    try{
        console.log(`Delete request by adminId=${adminId} for courseId=${id}`)
        const course = await Course.findById(id)
        console.log('Course found for deletion:', course)
        if(!course){
            return res.status(404).json({message:"Course not found"})
        }

        // Allow admin to delete any course (remove restriction on createrId)
        const deleteResult = await Course.deleteOne({ _id: id })
        console.log('deleteOne result:', deleteResult)
        if(!deleteResult || deleteResult.deletedCount === 0){
            return res.status(500).json({message:"Failed to delete course"})
        }
        return res.json({message:"Course deleted successfully"})
    }
    catch(error){
        console.error("Error in deleting course", error)
        return res.status(500).json({message:"Server error"})
    }
 }
 export const getcourses=async(req,res)=>{
    try{
        const courses=await Course.find({})
        res.json({message:"Courses fetched successfully",courses})
    }
    catch(error){
        res.status(500).json({message:"Server error"})
    }
 }
 export const getcourseDEtails=async(req,res)=>{
    const {id}=req.params
    try{
const course=await Course.findById(id)
        res.json({message:"Course details fetched successfully",course})
    
    if(!course){
        return res.status(404).json({message:"Course not found"})
    }
}
    catch(error){
        res.status(500).json({message:"Server error"})
    }
 }
 import Stripe from "stripe"
 const stripe=new Stripe(process.env.STRIPE_KEY)
 console.log("stripe key",process.env.STRIPE_KEY)
export const buycourses=async(req,res)=>{
    const userId = req.userId
    // here we take course id
    const {courseId}=req.params
    try{
console.log('buycourses called', { userId, courseId })
console.log('buycourses req.body:', req.body)
const course=await Course.findById(courseId)
if(!course){
    console.log('course not found for id', courseId)
    return res.status(400).json({error:"Course not found"})
}
const existingPurchase=await Purchase.findOne({userId,courseId})
if(existingPurchase){
    console.log('existing purchase found', { existingPurchase })
    // Return error with a flag so the client can handle it gracefully
    return res.status(400).json({
        message: "User has already purchased this course",
        alreadyPurchased: true,
        existingPurchase,
        course
    })
}
// stripe payment code here
const amount = Math.round(Number(course.price) * 100)
const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });


res.status(201).json({message:"Course purchased succesfully",
    course,
    clientSecret: paymentIntent.client_secret,

})
    }
    catch(error){
        res.status(500).json({message:"error in course buying"})
console.log("error in course buying",error)
    }
 }