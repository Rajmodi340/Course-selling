import jwt from "jsonwebtoken"
import config from "../config.js";
function adminmiddleware(req,res,next){
    const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
    try{
const decoded=jwt.verify(token,config.JWT_ADMIN_PASSWORD)
req.adminId=decoded.id
next()
    }
    catch(error){
        return res.status(401).json({errors:"invalid token or expired"})
        
        console.log("invalid token or expire token"+error)
    }
}
export default adminmiddleware