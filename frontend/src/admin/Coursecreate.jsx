import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
function Coursecreate() {
    const [title,settitle]=useState("")
    const [description,setdescription]=useState("")
    const [price,setprice]=useState("")
    const [image,setimage]=useState(null)
    const navigate=useNavigate()
    const [imagepreview,setimagepreview]=useState(null)
    const changePhotohandler=(e)=>{
        const file=e.target.files[0]
        if(!file)
          return;
        const reader=new FileReader()
        reader.readAsDataURL(file)
        reader.onload=()=>{
            setimagepreview(reader.result)
            setimage(file)
        }
    }
    const hadlecreatecourse=async(e)=>{
        e.preventDefault()
        const formData=new FormData()
        formData.append("title",title)
        formData.append("description",description)
        formData.append("price",price)
        formData.append("image",image )
        const admin=JSON.parse(localStorage.getItem("admin"))
        const token=admin.token;
        if(!token){
            alert("Please login first")
            navigate("/adminlogin")
            return;
        }
        try{
          const response=await axios.post("/api/v1/course/createcourse",formData,{
            headers:{
              Authorization:`Bearer ${token}`,
              "Content-Type":"multipart/form-data"
            },
            withCredentials:true
          })
          console.log(response.data)
          toast.success(response.data.message||"Course created successfully")
          settitle("")
          setdescription("")
          setprice("")
          setimage(null)
          setimagepreview(null)
        }
        catch(error){
          console.error("Error creating course:", error)
          toast.error(error.response?.data?.message || "Failed to create course")
        }
    }
    return(
  <div>
      <div className="min-h-screen  py-10">
        <div className="max-w-4xl mx-auto p-6 border  rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-8">Create Course</h3>

          <form onSubmit={hadlecreatecourse} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => settitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <input
                type="text"
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setprice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagepreview ? `${imagepreview}` : "/imgPL.webp"}
                  alt="Image"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                onChange={changePhotohandler}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              Create Course
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Coursecreate
