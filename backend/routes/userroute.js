import express from "express"
import { Logout, Purchases, Signup } from "../controller/usercontroller.js"
import { Login } from "../controller/usercontroller.js"
import usermiddleware from "../middleware/middleware.js"
const userrouter=express.Router()
userrouter.post("/signup",Signup)
userrouter.post("/login",Login)
userrouter.get("/logout",Logout)
userrouter.get("/purchase",usermiddleware,Purchases)
export default userrouter