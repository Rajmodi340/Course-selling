 import User from "../models/usermodel.js";
 import jwt from "jsonwebtoken"
 import bcrypt from "bcryptjs"
 import config from "../config.js"
 export const Signup=async(req,res)=>{
const {firstname,lastname,email,password}=req.body
try{
const existinginUser=await User.findOne({email})
if(existinginUser){
    return res.status(400).json({message:"User already exists"})
}
const hashedPassword=await bcrypt.hash(password,10)
const newUser=new User({
    firstname,
    lastname,
    email,
    password:hashedPassword
})
await newUser.save()
res.status(201).json({message:"User created successfully"})
}
catch(error){
    console.error("Error in user signup",error);
    return res.status(500).json({message:"Server error"});
}
}
export const Login=async(req,res)=>{
    const{email,password}=req.body
    try{
const user=await User.findOne({email})
    if(!user){
        return res.status(403).json({message:"user does not exist"})
    }
    const userpassword = await bcrypt.compare(password, user.password)
    if(!userpassword){
         return res.status(403).json({message:"Invalid credentials"})
    }
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET)
    res.cookie("jwt",token)
res.status(201).json({message:"user login successfully",user,token})

    }
    catch(error){
        console.error("Error in user login",error);
        return res.status(500).json({message:"Server error"})
    }
}
export const Logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,      // true in production (HTTPS)
      sameSite: "strict"
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
