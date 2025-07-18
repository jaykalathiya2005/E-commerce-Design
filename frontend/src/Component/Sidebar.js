import React, { useState } from 'react';
import { LuLayoutDashboard } from 'react-icons/lu'
import { FiPlusSquare, FiUser } from "react-icons/fi";
import { TbShoppingBagCheck } from "react-icons/tb";
import { IoMdLogOut } from "react-icons/io";
import { FaBars, FaTimes, FaBookmark, FaAngleUp } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../Redux/Slice/auth.slice';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';

const Sidebar = ({ children }) => {
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const userId = sessionStorage.getItem('userId');
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleSubmenuToggle = (title) => {
        setOpenSubmenu(openSubmenu === title ? null : title);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // const handleLogout = () => {
    //     try {
    //         if (userId) {
    //             dispatch(logoutUser(userId));
    //             navigate('/');
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const handleLogout = () => {
        setShowLogoutModal(true); // <-- Show modal instead of logging out immediately
    };

    const confirmLogout = () => {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            dispatch(logoutUser(userId));
            navigate('/');
        }
        setShowLogoutModal(false);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const pages = [
        { title: 'Dashboard', icon: <LuLayoutDashboard />, path: '/dashboard' },
        { title: 'My Profile', icon: <FiUser />, path: '/profile' },
        { title: 'Order', icon: <TbShoppingBagCheck />, path: '/order' },
        { title: 'Design', icon: <FiPlusSquare />, path: '/design' },
        { title: 'Wishlist', icon: <FaBookmark />, path: '/wishlist' },
        { title: 'Logout', icon: <IoMdLogOut />, onclick: handleLogout },
    ]

    return (
        <div>
            <div className="shadow z-10 sticky top-0" style={{ boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)' }}>
                <Header setSidebarOpen={setSidebarOpen} />
            </div>

            {/* scrollbar-hide overflow-y-scroll */}
            <div className="flex bg-primary-light/70 h-[calc(100vh-65px)]">
                {/* Mobile Menu Button */}
                {/* <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden fixed top-[12px] right-[100px] z-50 p-2 rounded-lg shadow-md"
                >
                    <FaBars className="w-5 h-5 text-white" />
                </button> */}

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={closeSidebar}
                    ></div>
                )}

                {/* Sidebar */}
                <div style={{ boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)' }} className={`
                fixed lg:relative
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                transition-transform duration-300 ease-in-out
                w-64 bg-primary-light lg:bg-transparent z-50 h-full lg:h-auto top-0
            `}>
                    {/* Mobile Close Button */}
                    <div className="lg:hidden flex justify-end p-4">
                        <button
                            onClick={closeSidebar}
                            className="p-2 text-black"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-4">
                        {/* Navigation Menu */}
                        <nav className="space-y-2">
                            {pages.map((v) => (
                                <div key={v.title}>
                                    <div
                                        className={`
                                            flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors
                                            ${v.title === 'Design' && (location.pathname.includes('/design') || location.pathname.includes('/add-design'))
                                                ? 'bg-primary-dark/80 text-black'
                                                : v.path && location.pathname.includes(v.path)
                                                    ? 'bg-primary-dark/80 text-black'
                                                    : 'text-primary-dark hover:bg-primary-dark/50 hover:text-black'
                                            }
                                        `}
                                        onClick={() => {
                                            if (v.subItems) {
                                                handleSubmenuToggle(v.title);
                                            } else if (v.onclick) {
                                                v.onclick();
                                                if (window && window.innerWidth < 900) setSidebarOpen(false);
                                            } else if (v.path) {
                                                navigate(v.path);
                                                if (window && window.innerWidth < 900) setSidebarOpen(false);
                                            }
                                        }}
                                    >
                                        <span className="mr-3">{v.icon}</span>
                                        <span className="font-medium">{v.title}</span>
                                        {v.dot && <span className="text-red-500 ml-2">•</span>}
                                        {v.subItems && (
                                            <FaAngleUp className={`ml-auto transition-transform ${openSubmenu === v.title ? 'rotate-180' : ''}`} />
                                        )}
                                    </div>
                                    {v.subItems && openSubmenu === v.title && (
                                        <div className="ml-8">
                                            {v.subItems.map(subItem => (
                                                <div
                                                    key={subItem.title}
                                                    className="flex items-center px-4 py-2 rounded-lg cursor-pointer text-black hover:bg-primary hover:text-black transition-colors"
                                                    onClick={() => {
                                                        navigate(subItem.path);
                                                        if (window && window.innerWidth < 900) setSidebarOpen(false);
                                                    }}
                                                >
                                                    <span className="mr-2 text-primary-dark">•</span>
                                                    <span>{subItem.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>

                {showLogoutModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-primary-light rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                            <h2 className="text-base sm:text-lg text-center font-semibold mb-1 sm:mb-4">Confirm Logout</h2>
                            <p className="mb-4 sm:mb-6 font-medium text-[15px] sm:text-base text-center">Are you sure you want to log out?</p>
                            {/* Modal Actions */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={cancelLogout}
                                    // text-white bg-primary-dark/90 hover:bg-primary-dark
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="flex-1 px-4 py-2 text-white bg-primary-dark/90 hover:bg-primary-dark rounded-lg font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                {/* pt-8 */}
                <div className="flex-1 p-4 md:p-6 lg:p-8 sp_css overflow-y-auto scrollbar-hide h-full">
                    {children}
                </div>

            </div>
        </div>
    );
};

export default Sidebar;