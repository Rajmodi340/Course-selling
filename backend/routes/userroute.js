import express from "express"
import { Logout, Signup } from "../controller/usercontroller.js"
import { Login } from "../controller/usercontroller.js"
const userrouter=express.Router()
userrouter.post("/signup",Signup)
userrouter.post("/login",Login)
userrouter.get("/logout",Logout)
export default userrouter