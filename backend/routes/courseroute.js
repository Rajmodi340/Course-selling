import express from "express"
const router=express.Router()
import { createcourse } from "../controller/coursecontroller.js"
import { updatecourse } from "../controller/coursecontroller.js"
import { deletecourse } from "../controller/coursecontroller.js"
import { getcourses } from "../controller/coursecontroller.js"
import { getcourseDEtails } from "../controller/coursecontroller.js"
import { buycourses } from "../controller/coursecontroller.js"
import usermiddleware from "../middleware/middleware.js"
import adminmiddleware from "../middleware/adminmiddleware.js"
router.post("/createcourse",adminmiddleware,createcourse)
router.put("/updatecourse/:id",adminmiddleware,updatecourse)
router.delete("/deletecourse/:id",adminmiddleware,deletecourse)
router.get("/getcourses",getcourses)
router.get("/:id",getcourseDEtails)
router.post("/buy/:courseId",usermiddleware,buycourses)
export default router