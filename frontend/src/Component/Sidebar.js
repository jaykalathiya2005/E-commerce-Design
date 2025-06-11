import React, { useEffect, useState } from 'react';
import { LuEye, LuEyeClosed, LuLayoutDashboard } from 'react-icons/lu'
import { FiEyeOff, FiPlusSquare, FiUser } from "react-icons/fi";
import { TbShoppingBagCheck } from "react-icons/tb";
import { IoMdLogOut } from "react-icons/io";
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaClock, FaEye, FaHeart, FaBars, FaTimes, FaPlus, FaUpload } from 'react-icons/fa';
import { MdDelete, MdDeleteForever, MdEdit } from "react-icons/md";
import { getAllUsers } from '../Redux/Slice/user.slice';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../Redux/Slice/auth.slice';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createDesign, deleteDesign, editDesign, getAlldesign } from '../Redux/Slice/design.slice';
import { IMAGE_URL } from '../Utils/baseUrl';
import Dashboard from '../Pages/Dashboard';
import Order from '../Pages/Order';
import Design from '../Pages/Design/Design';
import Createdesign from '../Pages/Design/Createdesign';
import Header from './Header';
import Profile from '../Pages/Profile';

const Sidebar = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageDesign, setCurrentPageDesign] = useState(1);
    const [ordersPerPage] = useState(10);
    const [designsPerPage] = useState(10);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [DeleteDesign, setDeleteDesign] = useState(null);
    const [editDesignId, setEditDesign] = useState(null);

    const handleEdit = (design) => {
        setEditDesign(design._id);
        handleSectionChange('addDesign')
    }

    const handleShowDelete = (id) => {
        setDeleteDesign(id);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (DeleteDesign) {
            dispatch(deleteDesign(DeleteDesign));
            setDeleteModal(false);
            setDeleteDesign(null);
        }
    };

    const cancelDelete = () => {
        setDeleteModal(false);
        setDeleteDesign(null);
    };

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userId = sessionStorage.getItem('userId');

    const validationSchema = Yup.object({
        images: Yup.array()
            .test('fileType', 'Only image files are allowed', (files) => {
                if (!files) return true;
                return files.every(file => file.type.startsWith('image/'));
            }),
        title: Yup.string()
            .required('Title is required'),
        description: Yup.string()
            .required('Description is required'),
        price: Yup.string()
            .required('Price is required')
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

    const alldesign = useSelector((state) => state.design.allDesign).filter((design) => design.userId == userId);

    useEffect(() => {
        dispatch(getAlldesign())
    }, [])

    // Pagination logic of order
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalOrdersPages = Math.ceil(orders.length / ordersPerPage);

    // Pagination logic of design
    const indexOfLastDesign = currentPageDesign * designsPerPage;
    const indexOfFirstDesign = indexOfLastDesign - designsPerPage;
    const currentDesigns = alldesign.slice(indexOfFirstDesign, indexOfLastDesign);
    const totalDesignPages = Math.ceil(alldesign.length / designsPerPage);

    const paginateorder = (pageNumber) => setCurrentPage(pageNumber);
    const paginateDesign = (pageNumber) => setCurrentPageDesign(pageNumber);

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
            sessionStorage.removeItem("userId");
            sessionStorage.removeItem("token");
        } catch (error) {
            console.log(error)
        }
    }

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

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
        <div className="">
            <Header />

            <div className="flex bg-primary-light/70 min-h-[calc(100vh-125px)] md:h-[calc(100vh-65px)]">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden fixed top-[12px] right-[55px] z-50 p-2 bg-primary-dark rounded-lg shadow-md"
                >
                    <FaBars className="w-5 h-5 text-white" />
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
                w-64 bg-primary-light md:bg-primary-light/70  shadow-lg  ${sidebarOpen ? 'z-50' : ''} h-full lg:h-auto
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
                                    ? 'bg-primary-dark text-white'
                                    : 'text-primary-dark hover:bg-primary hover:text-white'
                                    }`}
                                onClick={() => handleSectionChange('dashboard')}
                            >
                                <LuLayoutDashboard className="w-5 h-5 mr-3" />
                                <span className="font-medium">Dashboard</span>
                            </div>

                            <div
                                className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeSection === 'profile'
                                    ? 'bg-primary-dark text-white'
                                    : 'text-primary-dark hover:bg-primary hover:text-white'
                                    }`}
                                onClick={() => handleSectionChange('profile')}
                            >
                                <FiUser className="w-5 h-5 mr-3" />
                                <span className="font-medium">My Profile</span>
                            </div>

                            <div className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeSection === 'Order'
                                ? 'bg-primary-dark text-white'
                                : 'text-primary-dark hover:bg-primary hover:text-white'
                                }`}
                                onClick={() => handleSectionChange('Order')}>
                                <TbShoppingBagCheck className="w-5 h-5 mr-3" />
                                <span className="font-medium">Order</span>
                            </div>
                            <div className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors ${(activeSection === 'createPost' || activeSection === 'addDesign')
                                ? 'bg-primary-dark text-white'
                                : 'text-primary-dark hover:bg-primary hover:text-white'
                                }`}
                                onClick={() => handleSectionChange('createPost')}>
                                <FiPlusSquare className="w-5 h-5 mr-3" />
                                <span className="font-medium">Create Design</span>
                            </div>

                            <div className="flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors text-primary-dark hover:text-white hover:bg-primary"
                                onClick={() => handleSectionChange('Logout')}>
                                <IoMdLogOut className="w-5 h-5 mr-3" />
                                <span className="font-medium">Logout</span>
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                {/* pt-8 */}
                <div className="flex-1 p-4 md:p-6 lg:p-8">
                    {activeSection === 'dashboard' && <Dashboard />}
                    {activeSection === 'profile' && <Profile />}
                    {/* {activeSection === 'Order' && <Order />} */}
                    {activeSection === 'Order' && <Order />}
                    {activeSection === 'createPost' && <Design />}
                    {activeSection === 'addDesign' && <Createdesign />}
                </div>

                {/* Logout Confirmation Modal */}
                {showLogoutModal && <LogoutModal />}
                {/* {showDeleteModal && <DeleteModal />} */}
            </div>
        </div>
    );
};

export default Sidebar;