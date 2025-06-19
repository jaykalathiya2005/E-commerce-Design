import React, { useEffect } from 'react'
import { getAllUsers, getUserWishList } from '../Redux/Slice/user.slice';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegClock, FaRegHeart } from 'react-icons/fa';
import { TbShoppingBagCheck } from "react-icons/tb";

const Dashboard = () => {
    const userId = sessionStorage.getItem('userId');
    const singleuser = useSelector((state) => state.user.allusers)?.find((user) => user._id === userId)
    const wishlist = useSelector((state) => state?.user?.userWishList?.user?.wishlist);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllUsers());
        dispatch(getUserWishList());
    }, [])
    return (
        <div>
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-semibold text-primary-dark mb-2">
                    Hello, <span className="text-primary-dark/70 capitalize">{singleuser?.userName}</span> !
                </h1>
                <p className="text-sm md:text-base font-medium text-black">
                    {/* max-w-3xl */}
                    From your My Account Dashboard you have the ability to view a snapshot of your recent account activity and update your account information.
                    Select a link below to view or edit information.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Total Order Card */}
                <div className="bg-primary-dark/40 backdrop-blur-md text-black p-4 md:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs md:text-base font-medium mb-1 md:mb-2">Total Order</h3>
                            <p className="text-2xl md:text-3xl font-bold">3600</p>
                        </div>
                        <div className="bg-primary-dark/50 p-2 md:p-3 rounded-lg">
                            <TbShoppingBagCheck className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                    </div>
                </div>

                {/* Pending Orders Card */}
                <div className="bg-primary-dark/40 backdrop-blur-md text-black p-4 md:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs md:text-base font-medium mb-1 md:mb-2">Pending Orders</h3>
                            <p className="text-2xl md:text-3xl font-bold">200</p>
                        </div>
                        <div className="bg-primary-dark/50 p-2 md:p-3 rounded-lg">
                            <FaRegClock className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                    </div>
                </div>

                {/* Wishlist Card */}
                <div className="bg-primary-dark/40 backdrop-blur-md text-black p-4 md:p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs md:text-base font-medium mb-1 md:mb-2">Wishlist</h3>
                            <p className="text-2xl md:text-3xl font-bold">{wishlist?.length}</p>
                        </div>
                        <div className="bg-primary-dark/50 p-2 md:p-3 rounded-lg">
                            <FaRegHeart className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard