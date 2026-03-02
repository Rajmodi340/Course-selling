import React from 'react'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';
import axios from "axios";
import { useStripe } from '@stripe/react-stripe-js';
import { useElements } from '@stripe/react-stripe-js';
import { CardElement } from '@stripe/react-stripe-js';
function Buy() {
  const { loggedin } = useAuth();
    const { courseId } = useParams();
    const [loading, setLoading] = useState(false);
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;
    const navigate=useNavigate();
    const [course,setCourse]=useState({})
    const [clientSecret,setClientSecret]=useState("")
    const [error,setError]=useState("")
    
    console.log('Buy render - current state:', { clientSecret, course, error, loading })
const stripe = useStripe();
const elements = useElements();
const [carderror,setcarderror]=useState("")
  const parsedUser = user ? JSON.parse(user) : null;
  const [inputEmail, setInputEmail] = useState(parsedUser?.email || "");
    useEffect(()=>{
console.log('Buy mounted', { courseId, token })
const fetchbuycoursedata=async()=>{
   if(!token){
        console.log('No token found, cannot fetch')
        toast.error("please login to purchase the courses")
        return;
      }
      try{
        console.log('Fetching buy course data...')
        const response=await axios.post(`http://localhost:6767/api/v1/course/buy/${courseId}`,{},{
          headers:{
            Authorization:`Bearer ${token}`
          },
          withCredentials:true
        })
       console.log('Full response data:', response.data)
       console.log('Extracted clientSecret:', response.data.clientSecret)
       console.log('Extracted course:', response.data.course)
       setCourse(response.data.course)
       setClientSecret(response.data.clientSecret)
        setLoading(false);
      }
      catch(error){
        console.log('fetchbuycoursedata error - full error:', error)
        console.log('error.response?.status:', error.response?.status)
        console.log('error.response?.data:', error.response?.data)
        setLoading(false);
        
        if(error.response?.status===401){
          console.log('Unauthorized - token invalid or expired')
          toast.error("Session expired. Please login again.")
          navigate("/login")
        }
        else if(error.response?.status===400){
          console.log('Got 400 - checking if alreadyPurchased')
          if(error.response?.data?.alreadyPurchased){
            console.log('User already purchased - showing popup and navigating')
            toast.error("You have already purchased this course!")
           
              navigate("/purchase")
    
          }
          else{
            setError("you already purchased this course")
            navigate("/purchase")
          }
        }
        else{
          setError(error.response?.data?.message || "something went wrong")
          console.log("Error details:", error.response?.data)
        }
      }
}
fetchbuycoursedata()
    },[courseId, token])
    const handlepurchase=async(event)=>{
    event.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe.js has not loaded yet.')
      return;
    }
setLoading(true)
    
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log('CardElement not found.')
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('Stripepayment error:', error);
      setcarderror(error.message)
      setLoading(false)
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }
    if(!clientSecret){
      console.log('No client secret available, cannot confirm payment')
      setLoading(false)
      return;
    }
      // Determine billing email (prefer manually-entered inputEmail, fall back to stored)
      const savedEmail = inputEmail || parsedUser?.email;
      console.log('Saved billing email:', savedEmail);
      const isValidEmail = (email) => {
        if (!email) return false;
        // simple RFC-5322-ish validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      };
      const billingEmailForStripe = isValidEmail(savedEmail) ? savedEmail : undefined;
      if (savedEmail && !billingEmailForStripe) {
        console.warn('Stored email is invalid, omitting from Stripe billing details')
      
      }

      const {paymentIntent, error:confirmerror} = await stripe.confirmCardPayment(
   clientSecret,
  {
    payment_method: {
      card: card,
        billing_details: {
        name: parsedUser?.firstName || undefined,
        email: billingEmailForStripe,
      },
    },
  },
);

if(confirmerror){
  console.error('Card payment error:', confirmerror);
  setcarderror(confirmerror.message)
  setLoading(false)
}
else if(paymentIntent && paymentIntent.status === 'succeeded'){
  console.log('Payment succeeded:', paymentIntent);
  toast.success("Payment successful! Course purchased.")
  setcarderror("your payment id is "+paymentIntent.id)
  
  try {
    const parsedUser = JSON.parse(user);
    const paymentinfo={
      email: parsedUser?.email || "",
      userId: parsedUser?.userId || "",
      courseId: courseId,
      paymentId: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
    }
    console.log('Sending payment info to backend:', paymentinfo)
    
    await axios.post("http://localhost:6767/api/v1/order", paymentinfo, {
      headers: { Authorization: `Bearer ${token}` }
    })
    toast.success("Order recorded successfully!")
    // navigate("/purchase")
    
  } catch (err) {
    console.error("Error processing payment info:", err)
    toast.error("Error processing payment. Please contact support.")
navigate("/purchase") 
  }
}
setLoading(false)
    }
  return (
     <>
      {error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-sm">Total Price</h2>
              <p className="text-red-500 font-bold">${course.price}</p>
            </div>
            <div className="flex items-center text-center space-x-2">
              <h1 className="text-gray-600 text-sm">Course name</h1>
              <p className="text-red-500 font-bold">{course.title}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Process your Payment!
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2"
                  htmlFor="card-number"
                >
                  Credit/Debit Card
                </label>
                <form onSubmit={handlepurchase}>
                  <label className="block text-gray-700 text-sm mb-2">Billing email (receipt)</label>
                  <input
                    type="email"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full p-2 border rounded mb-3"
                  />
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!stripe || loading} // Disable button when loading
                    className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {carderror && (
                  <p className="text-red-500 font-semibold text-xs">
                    {carderror}
                  </p>
                )}
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                <span className="mr-2">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Buy
