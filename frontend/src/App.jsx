
import './App.css'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import { Toaster } from 'react-hot-toast'
import Buy from './components/Buy'
import Purchase from './components/Purchase'
import Courses from './components/Courses'
import AdminLogin from './admin/adminlogin'
import AdminSignup from './admin/adminsignup'
import Dashboard from './admin/Dashboard'
import Update from './admin/Update'
import Ourcourses from './admin/Ourcourses'
import Coursecreate from './admin/Coursecreate'
import { AuthProvider } from './components/AuthContext'
import { Navigate } from 'react-router-dom'
function App() {
 const user = JSON.parse(localStorage.getItem("user") || null);
 const admin = JSON.parse(localStorage.getItem("admin") || null);

  return (
    <AuthProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/buy/:courseId" element={<Buy></Buy>}></Route>
        <Route path="/purchase" element={user?<Purchase></Purchase>:<Navigate to="/login" />}></Route>
        <Route path="/courses" element={<Courses></Courses>}></Route>
        <Route path="/admin/login" element={<AdminLogin></AdminLogin>}></Route>
        <Route path="/admin/signup" element={<AdminSignup></AdminSignup>}></Route>
        <Route path="/admin/dashboard" element={admin?<Dashboard></Dashboard>:<Navigate to="/admin/login" />}></Route>
        <Route path="/admin/update/:id" element={admin?<Update></Update>:<Navigate to="/admin/login" />}></Route>
        <Route path="/admin/create-course" element={admin?<Coursecreate></Coursecreate>:<Navigate to="/admin/login" />}></Route>
        <Route path="/admin/our-courses" element={admin?<Ourcourses></Ourcourses>:<Navigate to="/admin/login" />}></Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
