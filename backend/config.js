import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD

if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not set. Please add JWT_SECRET to your .env file")
}

export default{
    JWT_SECRET,
    JWT_ADMIN_PASSWORD 
}
