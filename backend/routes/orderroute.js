import express from "express"
import { orderData } from "../controller/ordercontroller.js"
import userMiddleware from "../middleware/middleware.js"
const orderrouter=express.Router()
orderrouter.post("/", userMiddleware, orderData);
export default orderrouter