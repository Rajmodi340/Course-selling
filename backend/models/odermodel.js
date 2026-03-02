import mongoose from "mongoose";
const orderschema=new mongoose.Schema({
email: String,
  userId: String,
  courseId: String,
  paymentId: String,
  amount: Number,
  status: String,


})
const Order =mongoose.model("Order",orderschema);
export default Order;