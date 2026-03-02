import React, { useEffect, useState } from 'react'
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

function Purchase() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = localStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;
  const location = useLocation();

  useEffect(() => {
    // show success toast if redirected here after purchase
    if (location?.state?.message) {
      toast.success(location.state.message);
      // remove the state so toast doesn't show again on refresh/navigation
      try { window.history.replaceState({}, document.title); } catch (e) {}
    }

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchPurchases = async () => {
      try {
        const response = await axios.get('http://localhost:6767/api/v1/user/purchase', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setPurchases(response.data.courseData || []);
      } catch (error) {
        console.error('Failed to fetch purchases:', error);
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [token, navigate, logout]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!token) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}>
        <nav>
          <ul className="mt-16 md:mt-0">
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/purchase" className="flex items-center text-blue-500">
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>
            <li className="mb-4">
              <Link to="#" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center">
                <IoLogOut className="mr-2" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 bg-gray-50 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        } md:ml-64`}>
        <h2 className="text-xl font-semibold mt-6 md:mt-0 mb-6">My Purchases</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading purchases...</p>
        ) : purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((purchase) => (
              <div key={purchase._id} className="bg-white rounded-lg shadow-md p-6">
                <img
                  className="rounded-lg w-full h-48 object-cover mb-4"
                  src={purchase.image?.url || 'https://via.placeholder.com/200'}
                  alt={purchase.title}
                />
                <h3 className="text-lg font-bold mb-2">{purchase.title}</h3>
                <p className="text-gray-500 text-sm mb-3">
                  {purchase.description?.length > 100
                    ? `${purchase.description.slice(0, 100)}...`
                    : purchase.description}
                </p>
                <span className="text-green-700 font-semibold">₹{purchase.price}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no purchases yet.</p>
        )}
      </div>
    </div>
  );
}

export default Purchase
