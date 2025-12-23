import express from "express"
const router=express.Router()
import { createcourse } from "../controller/coursecontroller.js"
import { updatecourse } from "../controller/coursecontroller.js"
import { deletecourse } from "../controller/coursecontroller.js"
router.post("/createcourse",createcourse)
router.put("/updatecourse/:id",updatecourse)
router.delete("/deletecourse/:id",deletecourse)
export default router