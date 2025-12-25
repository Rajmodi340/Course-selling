import express from "express"
import { Login, Logout, Signup } from "../controller/admincontroller.js"
const adminrouter=express.Router()
adminrouter.post("/signup",Signup)
adminrouter.post("/signin",Login)
adminrouter.get("/logout",Logout)
export default adminrouter