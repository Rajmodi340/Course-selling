import Admin from "../models/adminmodel.js"
import config from "../config.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
export const Signup=async(req,res)=>{
const {firstname,lastname,email,password}=req.body
try{
const existinginUser=await Admin.findOne({email})
if(existinginUser){
    return res.status(400).json({message:"Admin already exists"})
}
const hashedPassword=await bcrypt.hash(password,10)
const newAdmin=new Admin({
    firstname,
    lastname,
    email,
    password:hashedPassword
})
await newAdmin.save()
res.status(201).json({message:"Admin created successfully",newAdmin})
}
catch(error){
    console.error("Error in admin signup",error);
    return res.status(500).json({message:"Server error"});
}
}
export const Login=async(req,res)=>{
    const{email,password}=req.body
    try{
const admin=await Admin.findOne({email})
    if(!admin){
        return res.status(403).json({message:"admin does not exist"})
    }
    const userpassword = await bcrypt.compare(password, admin.password)
    if(!userpassword){
         return res.status(403).json({message:"Invalid credentials"})
    }
    const token = jwt.sign({ id: admin._id }, config.JWT_ADMIN_PASSWORD,{expiresIn:"1d"})
const cookieoption={
    expires:new Date(Date.now()+24*60*60*1000),
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"Strict"
}
    res.cookie("jwt",token,cookieoption)
res.status(201).json({message:"admin login successfully",admin,token})

    }
    catch(error){
        console.error("Error in admin login",error);
        return res.status(500).json({message:"Server error"})
    }
}
export const Logout = async (req, res) => {
  try {
    if(!req.cookies.jwt){
        return res.status(401).json({errors:"kindly login first"})
    }
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,      // true in production (HTTPS)
      sameSite: "strict"
    });

    res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};