import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAllUsers } from '../Redux/Slice/user.slice'
import { FaBars, FaSearch, FaTimes } from 'react-icons/fa'
import { IconButton } from '@mui/material'
import { FaCartShopping } from 'react-icons/fa6'
import { addToCart, getCart } from '../Redux/Slice/design.slice'
import { enqueueSnackbar } from 'notistack'

const Header = ({ setSearchTerm, handleDrawerToggle }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const token = sessionStorage.getItem('token')
    const userId = sessionStorage.getItem('userId')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const allUsers = useSelector((state) => state.user.allusers)

    const singleuser = allUsers.find((user) => user._id == userId)

    useEffect(() => {
        dispatch(getAllUsers())
        if (token && userId) {
            dispatch(getCart())
        }
    }, [])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleprofileshow = () => {
        navigate('/dashboard')
    };

    const handlecart = () => {
        if (userId && token) {
            navigate('/cart')
        } else {
            enqueueSnackbar('Please login to go cart.', {
                variant: 'warning', autoHideDuration: 3000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
    };

    const location = useLocation()

    const cartItems = useSelector((state) => state?.design.cartitems?.cart)

    return (
        // <header className="sticky top-0 z-50 bg-primary h-[65px]" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
        <header className="bg-gradient-to-r from-purple-400 via-pink-200 to-indigo-400 h-[65px]" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => { navigate('/') }}>
                        <h1 className="text-2xl font-bold text-primary-dark italic">Logo</h1>
                    </div>

                    {/* Search Bar - Desktop */}
                    {location?.pathname === '/' && (
                        <div className="hidden lg:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <input
                                    onChange={handleSearchChange}
                                    type="text"
                                    placeholder="What are you looking for?"
                                    className="w-full pl-4 pr-10 py-2 bg-[#000]/50 text-primary rounded-full focus:outline-none placeholder-white"
                                />
                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary p-1.5 rounded-full">
                                    <FaSearch className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Right Side - Desktop */}
                    <div className="hidden lg:flex items-center space-x-2">
                        {/* <div className="w-8 h-8 bg-primary-dark cursor-pointer rounded-full flex items-center justify-center text-white font-medium" onClick={handlecart}>
                            <FaCartShopping className="h-4 w-4" />
                        </div> */}
                        <div className="relative" onClick={handlecart}>
                            <div className="w-8 h-8 bg-primary-dark/60 cursor-pointer rounded-full flex items-center justify-center text-white font-medium">
                                <FaCartShopping className="h-4 w-4" />
                            </div>
                            {cartItems?.length > 0 && (
                                <div className="w-5 h-5 absolute -top-1 -right-1 bg-red-600 rounded-full flex justify-center items-center">
                                    <span className="text-white text-sm font-medium">
                                        {cartItems?.length}
                                    </span>
                                </div>
                            )}
                        </div>
                        {userId && token ? (
                            <div className="w-8 h-8 bg-primary-dark/60 cursor-pointer rounded-full flex items-center justify-center text-white font-medium" onClick={handleprofileshow}>
                                {singleuser?.userName?.charAt(0).toUpperCase()}{singleuser?.userName?.split(' ')[1] ? singleuser?.userName?.split(' ')[1]?.charAt(0).toUpperCase() : ''}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                {/* Sign up button */}
                                <div onClick={() => navigate('/login', { state: { isSignUp: true } })}>
                                    <button className="text-gray-700 hover:text-white font-medium px-4 py-2 rounded-full hover:bg-primary-dark/60 transition-all duration-300">
                                        Sign up
                                    </button>
                                </div>

                                {/* Log in button */}
                                <div onClick={() => navigate('/login')}>
                                    <button className="bg-primary-dark/60 text-white font-medium px-4 py-2 rounded-full transition-colors">
                                        Log In
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Search Input - shows between logo and close icon when search is open */}
                    <div className={`lg:hidden flex-1 mx-4 transition-all duration-300 ease-in-out ${isSearchOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                        <div className="relative">
                            <input
                                onChange={handleSearchChange}
                                type="text"
                                placeholder={`${isSearchOpen ? "looking for?" : "What are you looking for?"}`}
                                className="w-full pl-4 pr-10 py-2 bg-primary-dark/50 text-primary rounded-full focus:outline-none placeholder-primary"
                                autoFocus={isSearchOpen}
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary p-1.5 rounded-full">
                                <FaSearch className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile/Tablet Navigation (sm and below) */}
                    <div className="lg:hidden flex items-center space-x-2">
                        {/* Search Icon - always visible */}
                        {location?.pathname === '/' && (
                            <IconButton
                                onClick={toggleSearch}
                                className="text-black"
                                sx={{ color: 'black' }}
                            >
                                {isSearchOpen ? <FaTimes /> : <FaSearch />}
                            </IconButton>
                        )}

                        {/* Other icons - hidden when search is open */}
                        <div className={`flex items-center space-x-2 transition-all duration-300 ${isSearchOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                            {/* Menu Button */}
                            {location?.pathname !== '/' && location?.pathname !== '/cart' && !location?.pathname.startsWith('/design/') && (
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ color: 'black' }}
                                >
                                    <FaBars />
                                </IconButton>
                            )}

                            <div className="relative" onClick={handlecart}>
                                <div className="w-8 h-8 bg-primary-dark/60 cursor-pointer rounded-full flex items-center justify-center text-white font-medium">
                                    <FaCartShopping className="h-4 w-4" />
                                </div>
                                {cartItems?.length > 0 && (
                                    <div className="w-5 h-5 absolute -top-1 -right-1 bg-red-600 rounded-full flex justify-center items-center">
                                        <span className="text-white text-sm font-medium">
                                            {cartItems?.length}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* User Profile/Auth buttons */}
                            {userId && token ? (
                                <div className="w-8 h-8 bg-primary-dark/60 cursor-pointer rounded-full flex items-center justify-center text-white font-medium" onClick={handleprofileshow}>
                                    {singleuser?.userName?.charAt(0).toUpperCase()}{singleuser?.userName?.split(' ')[1] ? singleuser?.userName?.split(' ')[1]?.charAt(0).toUpperCase() : ''}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    {/* Sign up button */}
                                    <div onClick={() => navigate('/login', { state: { isSignUp: true } })}>
                                        <button className="text-gray-700 hover:text-white font-medium px-2 py-1 rounded-full hover:bg-primary-dark transition-colors text-sm whitespace-nowrap">
                                            Sign up
                                        </button>
                                    </div>

                                    {/* Log in button */}
                                    <div onClick={() => navigate('/login')}>
                                        <button className="bg-primary-dark/60 text-white font-medium px-2 py-1 rounded-full transition-colors text-sm whitespace-nowrap">
                                            Log In
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar - shows below header when toggled */}
                {/* <div className={`md:hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'pb-4 opacity-100' : 'pb-0 opacity-0 h-0 overflow-hidden'}`}>
                    <div className="relative">
                        <input
                            onChange={handleSearchChange}
                            type="text"
                            placeholder="What are you looking for?"
                            className="w-full pl-4 pr-10 py-2 bg-[#000]/50 text-white rounded-full focus:outline-none placeholder-white"
                            autoFocus={isSearchOpen}
                        />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-1.5 rounded-full">
                            <FaSearch className="h-4 w-4" />
                        </button>
                    </div>
                </div> */}
            </div>
        </header>
    )
}

export default Header