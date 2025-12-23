import express from "express"
const router=express.Router()
import { createcourse } from "../controller/coursecontroller.js"
import { updatecourse } from "../controller/coursecontroller.js"
import { deletecourse } from "../controller/coursecontroller.js"
import { getcourses } from "../controller/coursecontroller.js"
import { getcourseDEtails } from "../controller/coursecontroller.js"
import { buycourses } from "../controller/coursecontroller.js"
import usermiddleware from "../middleware/middleware.js"
router.post("/createcourse",createcourse)
router.put("/updatecourse/:id",updatecourse)
router.delete("/deletecourse/:id",deletecourse)
router.get("/getcourses",getcourses)
router.get("/:id",getcourseDEtails)
router.post("/buy/:id",buycourses,usermiddleware)
export default router