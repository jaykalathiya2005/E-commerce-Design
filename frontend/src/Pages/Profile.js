import React, { useEffect, useState } from 'react';
import { LuEye, LuEyeClosed, LuLayoutDashboard } from 'react-icons/lu'
import { FiEyeOff, FiPlusSquare, FiUser } from "react-icons/fi";
import { TbShoppingBagCheck } from "react-icons/tb";
import { IoMdLogOut } from "react-icons/io";
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaClock, FaEye, FaHeart, FaBars, FaTimes, FaPlus, FaUpload } from 'react-icons/fa';
import { getAllUsers } from '../Redux/Slice/user.slice';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../Redux/Slice/auth.slice';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createDesign } from '../Redux/Slice/design.slice';

const Profile = ({ setShowProfile }) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(4);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userId = sessionStorage.getItem('userId');
    const singleuser = useSelector((state) => state.user.allusers)?.find((user) => user._id === userId)

    useEffect(() => {
        dispatch(getAllUsers())
    }, [])

    const validationSchema = Yup.object({
        images: Yup.array()
            .test('fileType', 'Only image files are allowed', (files) => {
                if (!files) return true;
                return files.every(file => file.type.startsWith('image/'));
            }),
        title: Yup.string()
            .required('Title is required'),
        description: Yup.string()
            .required('Description is required')
    });

    // Sample order data
    const orders = [
        {
            id: '#4ce345c3e',
            image: '/api/placeholder/80/80',
            productName: 'Eau De Blue Perfume',
            price: '$40.00',
            status: 'Shipped',
            statusColor: 'text-blue-600'
        },
        {
            id: '#4ce3533e',
            image: '/api/placeholder/80/80',
            productName: 'Smooth Makeup Box',
            price: '$25.00',
            status: 'Pending',
            statusColor: 'text-red-600'
        },
        {
            id: '#8ce3533e',
            image: '/api/placeholder/80/80',
            productName: 'Modern Red Lipstick',
            price: '$32.00',
            status: 'Pending',
            statusColor: 'text-red-600'
        },
        {
            id: '#8ce3533e',
            image: '/api/placeholder/80/80',
            productName: 'New Botanical Shampoo',
            price: '$27.00',
            status: 'Shipped',
            statusColor: 'text-blue-600'
        },
        {
            id: '#9ce3533e',
            image: '/api/placeholder/80/80',
            productName: 'Premium Face Cream',
            price: '$45.00',
            status: 'Delivered',
            statusColor: 'text-green-600'
        },
        {
            id: '#1ce3533e',
            image: '/api/placeholder/80/80',
            productName: 'Organic Hair Oil',
            price: '$18.00',
            status: 'Processing',
            statusColor: 'text-yellow-600'
        }
    ];

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Close sidebar when clicking outside on mobile
    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // const handleSectionChange = (section) => {
    //     setActiveSection(section);
    //     setSidebarOpen(false); // Close sidebar on mobile after selection
    // };

    const handleSectionChange = (section) => {
        if (section === 'Logout') {
            setShowLogoutModal(true);
            setSidebarOpen(false);
        } else {
            setActiveSection(section);
            setSidebarOpen(false);
        }
    };

    const handleLogout = async () => {
        try {
            if (userId) {
                await dispatch(logoutUser(userId));
            }
            navigate("/")
            setShowLogoutModal(false)
            setShowProfile(false)
            sessionStorage.removeItem("userId");
            sessionStorage.removeItem("token");
        } catch (error) {
            console.log(error)
        }
    }

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const renderDashboard = () => (
        <>
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                    Hello, <span className="text-blue-600">{singleuser?.userName}</span> !
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                    {/* max-w-3xl */}
                    From your My Account Dashboard you have the ability to view a snapshot of your recent account activity and update your account information.
                    Select a link below to view or edit information.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Total Order Card */}
                <div className="bg-gray-800 text-white p-4 md:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2">Total Order</h3>
                            <p className="text-2xl md:text-3xl font-bold">3600</p>
                        </div>
                        <div className="bg-gray-700 p-2 md:p-3 rounded-lg">
                            <TbShoppingBagCheck className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                    </div>
                </div>

                {/* Pending Orders Card */}
                <div className="bg-gray-800 text-white p-4 md:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2">Pending Orders</h3>
                            <p className="text-2xl md:text-3xl font-bold">200</p>
                        </div>
                        <div className="bg-gray-700 p-2 md:p-3 rounded-lg">
                            <FaClock className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                    </div>
                </div>

                {/* Wishlist Card */}
                <div className="bg-gray-800 text-white p-4 md:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2">Wishlist</h3>
                            <p className="text-2xl md:text-3xl font-bold">36354</p>
                        </div>
                        <div className="bg-gray-700 p-2 md:p-3 rounded-lg">
                            <FaHeart className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const renderProfile = () => (
        <>
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                    Edit Your Profile
                </h1>
                <p className="text-sm md:text-base text-gray-600 ">
                    {/* max-w-4xl */}
                    From your My Account Dashboard you have the ability to view a snapshot of your recent account activity and update your account information. Select a link below to view or edit information.
                </p>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-8">
                <form className="space-y-4 md:space-y-6">
                    {/* First Name and Last Name */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"> */}
                    <div>
                        <input
                            type="text"
                            placeholder="Enter Your First Name*"
                            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm md:text-base"
                        />
                    </div>
                    {/* <div>
                            <input
                                type="text"
                                placeholder="Enter Your Last Name*"
                                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm md:text-base"
                            />
                        </div> */}
                    {/* </div> */}

                    {/* Contact Number and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <input
                                type="tel"
                                placeholder="Enter Your Contact Number"
                                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm md:text-base"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Enter Your Email Address*"
                                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm md:text-base"
                            />
                        </div>
                    </div>

                    {/* Present Address */}
                    <div>
                        <input
                            type="text"
                            placeholder="Enter Your Present Address"
                            className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm md:text-base"
                        />
                    </div>

                    {/* City and State */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="relative">
                            <select className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none bg-white text-gray-500 text-sm md:text-base">
                                <option>City</option>
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                        </div>
                        <div className="relative">
                            <select className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none bg-white text-gray-500 text-sm md:text-base">
                                <option>State</option>
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Zip Code and Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <input
                                type="text"
                                placeholder="Zip Code"
                                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm md:text-base"
                            />
                        </div>
                        <div className="relative">
                            <select className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all appearance-none bg-white text-gray-500 text-sm md:text-base">
                                <option>Country</option>
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Password */}
                    {/* <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full px-3 md:px-4 py-2 md:py-3 pr-10 md:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm md:text-base"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <LuEye className="w-4 h-4 md:w-5 md:h-5" /> : <LuEyeClosed className="w-4 h-4 md:w-5 md:h-5" />}
                        </button>
                    </div> */}

                    {/* Confirm Password */}
                    {/* <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="w-full px-3 md:px-4 py-2 md:py-3 pr-10 md:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm md:text-base"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <LuEye className="w-4 h-4 md:w-5 md:h-5" /> : <LuEyeClosed className="w-4 h-4 md:w-5 md:h-5" />}
                        </button>
                    </div> */}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                        <button
                            onClick={() => handleSectionChange('dashboard')}
                            type="submit"
                            className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors font-medium text-sm md:text-base"
                        >
                            Update Profile
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSectionChange('dashboard')}
                            className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );

    const renderOrders = () => (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8 gap-4">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                    My Order
                </h1>
                <div className="relative">
                    <select className="w-full sm:w-auto px-3 md:px-4 py-2 border border-gray-300 rounded-full appearance-none bg-white text-gray-700 pr-8 md:pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base">
                        <option>Show: Last 05 Order</option>
                        <option>Show: Last 10 Order</option>
                        <option>Show: Last 20 Order</option>
                        <option>Show: All Orders</option>
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                </div>
            </div>

            {/* Orders Table - Desktop */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 lg:px-6 py-4 text-left font-medium text-sm lg:text-base">Image</th>
                            <th className="px-4 lg:px-6 py-4 text-left font-medium text-sm lg:text-base">Order ID</th>
                            <th className="px-4 lg:px-6 py-4 text-left font-medium text-sm lg:text-base">Product Details</th>
                            <th className="px-4 lg:px-6 py-4 text-left font-medium text-sm lg:text-base">Price</th>
                            <th className="px-4 lg:px-6 py-4 text-left font-medium text-sm lg:text-base">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentOrders.map((order, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 lg:px-6 py-4">
                                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-600 rounded"></div>
                                    </div>
                                </td>
                                <td className="px-4 lg:px-6 py-4 text-gray-800 font-medium text-sm lg:text-base">
                                    {order.id}
                                </td>
                                <td className="px-4 lg:px-6 py-4 text-gray-800 text-sm lg:text-base">
                                    {order.productName}
                                </td>
                                <td className="px-4 lg:px-6 py-4 text-gray-800 font-medium text-sm lg:text-base">
                                    {order.price}
                                </td>
                                <td className="px-4 lg:px-6 py-4">
                                    <span className={`font-medium text-sm lg:text-base ${order.statusColor}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Orders Cards - Mobile */}
            <div className="md:hidden space-y-4">
                {currentOrders.map((order, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                        <div className="flex items-start space-x-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <div className="w-12 h-12 bg-blue-600 rounded"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex justify-between items-start flex-wrap">
                                        <h3 className="text-sm font-medium text-gray-800 truncate pr-2">
                                            {order.productName}
                                        </h3>
                                        <span className={`text-sm font-medium ${order.statusColor} whitespace-nowrap`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600">Order ID: {order.id}</p>
                                    <p className="text-sm font-medium text-gray-800">{order.price}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 gap-4">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                    Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orders.length)} of {orders.length} entries
                </div>

                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
                    </button>

                    {[...Array(Math.min(totalPages, 3))].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => paginate(index + 1)}
                            className={`px-3 py-2 rounded-lg text-sm ${currentPage === index + 1
                                ? 'bg-gray-800 text-white border border-gray-800'
                                : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    {totalPages > 3 && (
                        <>
                            <span className="px-1 text-gray-500 text-sm">...</span>
                            <button
                                onClick={() => paginate(totalPages)}
                                className={`px-3 py-2 rounded-lg text-sm ${currentPage === totalPages
                                    ? 'bg-gray-800 text-white border border-gray-800'
                                    : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                </div>
            </div>
        </>
    );

    const renderCreatepost = () => (
        <>
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                    Upload Your Design
                </h1>
            </div>

            <Formik
                initialValues={{
                    userId: userId,
                    images: [],
                    title: '',
                    description: ''
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    dispatch(createDesign(values)).then((response) => {
                        if (response.payload.success) {
                            resetForm()
                        }
                    })
                }}
            >
                {({ values, handleChange, handleSubmit, setFieldValue, errors, touched }) => {

                    const handleDeleteImage = (index) => {
                        const updatedImages = values.images.filter((_, i) => i !== index);
                        setFieldValue('images', updatedImages);
                    };

                    const handleFileInput = () => {
                        document.getElementById('fileInput').click();
                    };

                    const handleImageChange = (e) => {
                        const files = Array.from(e.target.files);
                        setFieldValue('images', [...values.images, ...files,]);
                    };

                    return (
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <div className="mx-auto bg-white">
                                <div className="mx-auto bg-gray-50 rounded-lg">
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-12 gap-4">
                                        {values.images.map((img, index) => (
                                            <div key={index} className="relative group col-span-1">
                                                <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                                    <img
                                                        src={URL.createObjectURL(img)}
                                                        alt={`Design ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteImage(index)}
                                                        className="absolute top-2 right-2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <FaTimes size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add Image Button */}
                                        <div
                                            className="aspect-square bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer flex flex-col items-center justify-center group hover:bg-gray-50"
                                            onClick={handleFileInput}
                                        >
                                            <div className="flex flex-col items-center text-gray-400 group-hover:text-gray-600">
                                                <div className="bg-gray-100 group-hover:bg-gray-200 rounded-full p-3 mb-2">
                                                    <FaUpload size={20} />
                                                </div>
                                                <span className="text-sm font-medium">Add Image</span>
                                            </div>
                                        </div>
                                    </div>

                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />

                                    {/* Images Error Message */}
                                    {errors.images && touched.images && (
                                        <div className="mt-2 text-red-600 text-sm">
                                            {errors.images}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Design Title and Description */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        value={values.title}
                                        onChange={handleChange}
                                        placeholder="Enter Your Design Title"
                                        className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm md:text-base ${errors.title && touched.title
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.title && touched.title && (
                                        <div className="mt-1 text-red-600 text-sm">
                                            {errors.title}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="description"
                                        id="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        placeholder="Enter Your Design Description"
                                        className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm md:text-base ${errors.description && touched.description
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.description && touched.description && (
                                        <div className="mt-1 text-red-600 text-sm">
                                            {errors.description}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                                <button
                                    type="button"
                                    // onClick={() => handleSectionChange('dashboard')}
                                    className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    // onClick={() => handleSectionChange('dashboard')}
                                    type="submit"
                                    className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors font-medium text-sm md:text-base"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    )
                }}
            </Formik>
        </>
    );

    // Logout Confirmation Modal
    const LogoutModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    {/* Modal Header */}
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-red-100 p-3 rounded-full">
                            <IoMdLogOut className="w-6 h-6 text-red-600" />
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Confirm Logout
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to logout ?
                        </p>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={cancelLogout}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                        >
                            Yes, Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );


    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden fixed top-[12px] right-[55px] z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
            >
                <FaBars className="w-5 h-5 text-gray-600" />
            </button>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:relative
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                transition-transform duration-300 ease-in-out
                w-64 bg-white shadow-lg  ${sidebarOpen ? 'z-50' : ''} h-full lg:h-auto
            `}>
                {/* Mobile Close Button */}
                <div className="md:hidden flex justify-end p-4">
                    <button
                        onClick={closeSidebar}
                        className="p-2 text-gray-600 hover:text-gray-800"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4">
                    {/* Navigation Menu */}
                    <nav className="space-y-2">
                        <div
                            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeSection === 'dashboard'
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            onClick={() => handleSectionChange('dashboard')}
                        >
                            <LuLayoutDashboard className="w-5 h-5 mr-3" />
                            <span className="font-medium">Dashboard</span>
                        </div>

                        <div
                            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeSection === 'profile'
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            onClick={() => handleSectionChange('profile')}
                        >
                            <FiUser className="w-5 h-5 mr-3" />
                            <span className="font-medium">My Profile</span>
                        </div>

                        <div className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeSection === 'Order'
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => handleSectionChange('Order')}>
                            <TbShoppingBagCheck className="w-5 h-5 mr-3" />
                            <span className="font-medium">Order</span>
                        </div>
                        <div className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeSection === 'createPost'
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => handleSectionChange('createPost')}>
                            <FiPlusSquare className="w-5 h-5 mr-3" />
                            <span className="font-medium">Create Design</span>
                        </div>

                        <div className="flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors text-gray-700 hover:bg-gray-100"
                            onClick={() => handleSectionChange('Logout')}>
                            <IoMdLogOut className="w-5 h-5 mr-3" />
                            <span className="font-medium">Logout</span>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
                {activeSection === 'dashboard' && renderDashboard()}
                {activeSection === 'profile' && renderProfile()}
                {activeSection === 'Order' && renderOrders()}
                {activeSection === 'createPost' && renderCreatepost()}
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && <LogoutModal />}
        </div>
    );
};

export default Profile;