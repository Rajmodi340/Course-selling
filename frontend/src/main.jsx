import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './index.css'
import App from './App.jsx'
const stripePromise = loadStripe("pk_test_51SxaZEGlDMmk6lMSNXeQ1RxMmErkXVEaBim36zEYnItl0Hsbdy206vXWFfCW2VkK1pn7c92h9ml4qmdemIefELMj00BXEXk93e");
createRoot(document.getElementById('root')).render(
 
  <Elements stripe={stripePromise}>
           <BrowserRouter>
    <App />
 </BrowserRouter>
          </Elements>
)
