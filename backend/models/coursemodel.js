import mongoose from "mongoose"
const userschema=new mongoose.Schema({
   title:{
    type:String,
    required:true,
   },
   description:{
    type:String,
    required:true,
   },
   price:{
    type:Number,
    required:true,
   },
   image:{
    public_id:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
    }
}
})
const Course=mongoose.model("Course",userschema)
export default Course