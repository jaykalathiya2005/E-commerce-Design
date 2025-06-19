import React, { useEffect, useState } from 'react'
import { FaBookmark, FaChevronDown, FaFilter, FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getUserWishList } from '../Redux/Slice/user.slice';
import { IMAGE_URL } from '../Utils/baseUrl';
import { useNavigate } from 'react-router-dom';
import { getAlldesign } from '../Redux/Slice/design.slice';

const Wishlist = () => {
    const [activeTab, setActiveTab] = useState('wishlist');
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userId = sessionStorage.getItem('userId');

    const wishlist = useSelector((state) => state?.user?.userWishList?.user?.wishlist);

    const likedData = useSelector((state) => state?.design.allDesign)?.filter((design) => design.likes?.includes(userId));

    useEffect(() => {
        dispatch(getUserWishList())
        dispatch(getAlldesign())
    }, [])

    // Function to open single design view
    const openSingleView = (design) => {
        navigate(`/design/${design._id}`, { state: design });
    };

    return (
        <>
            {/* Navigation Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-primary-light/50 rounded-xl p-2 shadow-lg">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('wishlist')}
                            className={`px-3 md:px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'wishlist'
                                ? 'bg-primary-dark/50 text-black shadow-md'
                                : 'text-black hover:bg-primary-dark/40'
                                }`}
                        >
                            <FaBookmark className="w-4 h-4" />
                            <span>Wishlist</span>
                            <span className="bg-primary-dark text-white text-xs px-2 py-1 rounded-full ml-1">
                                {wishlist?.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('liked')}
                            className={`px-3 md:px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'liked'
                                ? 'bg-primary-dark/50 text-black shadow-md'
                                : 'text-black hover:bg-primary-dark/40'
                                }`}
                        >
                            <FaHeart className="w-4 h-4" />
                            <span>Liked</span>
                            <span className="bg-primary-dark text-white text-xs px-2 py-1 rounded-full ml-1">
                                {likedData?.length}
                            </span>
                        </button>
                    </div>
                </div>
            </div>


            {/* wishlist Content */}
            {activeTab === 'wishlist' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
                    {wishlist?.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-primary-dark/80 rounded-full flex items-center justify-center">
                                <FaBookmark className="w-12 h-12 text-primary-light/80" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-2">
                                No wishlist designs found
                            </h3>
                            <p className="text-black font-medium">
                                Start adding designs you love!
                            </p>
                        </div>
                    ) : (
                        <div
                            className="masonry-container"
                            style={{
                                columnCount: 'auto',
                                columnWidth: '300px',
                                columnGap: '20px',
                                columnFill: 'balance'
                            }}
                        >
                            {wishlist?.map((cardItem, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden w-full rounded-xl cursor-pointer mb-4 break-inside-avoid transition-transform duration-300 hover:scale-[1.02]"
                                        style={{
                                            width: '100%'
                                        }}
                                        onClick={() => openSingleView(cardItem)}
                                    >
                                        <img
                                            src={`${IMAGE_URL}${cardItem.images[0]}`}
                                            alt={cardItem.title}
                                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                        />

                                        {/* Black Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></div>

                                        {/* Text Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transform translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
                                            <div className="flex justify-between items-end">
                                                <div className="flex-1 mr-4">
                                                    <div className="text-[15px] font-medium mb-1 line-clamp-2">{cardItem.title}</div>
                                                    <div className="text-[13px] opacity-80 line-clamp-1">{cardItem.description}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover effect indicator */}
                                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>

                                        {/* Image count indicator */}
                                        {cardItem.images && cardItem.images.length > 1 && (
                                            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                                                +{cardItem.images.length - 1}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* liked content */}
            {activeTab === 'liked' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Liked Designs</h2>
                    {likedData?.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-primary-dark/80 rounded-full flex items-center justify-center">
                                <FaHeart className="w-12 h-12 text-primary-light/80" />
                            </div>
                            <h3 className="text-xl font-bold text-black mb-2">
                                No liked designs yet
                            </h3>
                            <p className="text-black font-medium">
                                Heart the designs you love to see them here!
                            </p>
                        </div>
                    ) : (
                        <div
                            className="masonry-container"
                            style={{
                                columnCount: 'auto',
                                columnWidth: '300px',
                                columnGap: '20px',
                                columnFill: 'balance'
                            }}
                        >
                            {likedData?.map((cardItem, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden w-full rounded-xl cursor-pointer mb-4 break-inside-avoid transition-transform duration-300 hover:scale-[1.02]"
                                        style={{
                                            width: '100%'
                                        }}
                                        onClick={() => openSingleView(cardItem)}
                                    >
                                        <img
                                            src={`${IMAGE_URL}${cardItem.images[0]}`}
                                            alt={cardItem.title}
                                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                        />

                                        {/* Black Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></div>

                                        {/* Text Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transform translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
                                            <div className="flex justify-between items-end">
                                                <div className="flex-1 mr-4">
                                                    <div className="text-[15px] font-medium mb-1 line-clamp-2">{cardItem.title}</div>
                                                    <div className="text-[13px] opacity-80 line-clamp-1">{cardItem.description}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover effect indicator */}
                                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>

                                        {/* Image count indicator */}
                                        {cardItem.images && cardItem.images.length > 1 && (
                                            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                                                +{cardItem.images.length - 1}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default Wishlist