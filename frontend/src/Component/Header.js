import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllUsers } from '../Redux/Slice/user.slice'
import { FaSearch } from 'react-icons/fa'

const Header = ({ setSearchTerm, setShowProfile }) => {
    const token = sessionStorage.getItem('token')
    const userId = sessionStorage.getItem('userId')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const allUsers = useSelector((state) => state.user.allusers)

    const singleuser = allUsers.find((user) => user._id == userId)

    useEffect(() => {
        dispatch(getAllUsers())
    }, [])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleprofileshow = () => {
        setShowProfile(true); // Set to show profile when user clicks
    };

    return (
        <header className="border-b border-gray-200 sticky top-0 z-50 bg-white">
            {/* max-w-7xl */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => { setShowProfile(false) }}>
                        <h1 className="text-2xl font-bold text-black italic">Logo</h1>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                onChange={handleSearchChange}
                                type="text"
                                placeholder="What are you looking for?"
                                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-black text-white p-1.5 rounded-full">
                                <FaSearch className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {userId && token ? (
                            <div className="w-8 h-8 bg-black cursor-pointer rounded-full flex items-center justify-center text-white font-medium" onClick={handleprofileshow}>
                                {singleuser?.userName?.charAt(0).toUpperCase()}{singleuser?.userName?.split(' ')[1] ? singleuser?.userName?.split(' ')[1]?.charAt(0).toUpperCase() : ''}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                {/* Sign up button */}
                                <div onClick={() => navigate('/login', { state: { isSignUp: true } })}>
                                    <button className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                                        Sign up
                                    </button>
                                </div>

                                {/* Log in button */}
                                <div onClick={() => navigate('/login')}>
                                    <button className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-full transition-colors">
                                        Log In
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-2">
                        {userId && token ? (
                            <div className="w-8 h-8 bg-black cursor-pointer rounded-full flex items-center justify-center text-white font-medium" onClick={handleprofileshow}>
                                {singleuser?.userName?.charAt(0).toUpperCase()}{singleuser?.userName?.split(' ')[1] ? singleuser?.userName?.split(' ')[1]?.charAt(0).toUpperCase() : ''}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                {/* Sign up button */}
                                <div onClick={() => navigate('/login', { state: { isSignUp: true } })}>
                                    <button className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                                        Sign up
                                    </button>
                                </div>

                                {/* Log in button */}
                                <div onClick={() => navigate('/login')}>
                                    <button className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-full transition-colors">
                                        Log In
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="md:hidden pb-4">
                    <div className="relative">
                        <input
                            type="text"
                            onChange={handleSearchChange}
                            placeholder="What are you looking for?"
                            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                        />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-black text-white p-1.5 rounded-full">
                            <FaSearch className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </header >
    )
}

export default Header