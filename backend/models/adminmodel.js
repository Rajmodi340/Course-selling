import mongoose from "mongoose"
const adminschema=new mongoose.Schema({
   firstname:{
       type:String,
       required:true,
   },
   lastname:{
       type:String,
       required:true,
   },
   email:{
       type:String,
       required:true,
       unique:true,
   },
   password:{
       type:String,
       required:true,
   }
   
   })
   const Admin =mongoose.model("Admin",adminschema);
   export default Admin; 