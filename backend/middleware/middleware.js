import jwt from "jsonwebtoken"
import config from "../config.js";
function usermiddleware(req,res,next){
    const authHeader=req.headers.authorization
    if(!authHeader||!authHeader.startWith("Bearer")){
        return res.status(401).json({errors:"NO token provided"});
    }
    const token=authHeader.split("")[1];
    try{
const decoded=jwt.verify(token,config.JWT_SECRET)
req.userId=decoded.id
next()
    }
    catch(error){
        return res.status(401).json({errors:"invalid token or expired"})
        console.log("invalid token or expire token"+error)
    }
}
export default usermiddleware