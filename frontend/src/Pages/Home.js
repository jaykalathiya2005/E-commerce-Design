import React, { useEffect, useState } from 'react'
import Header from '../Component/Header';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import { getAlldesign, likeDesign } from '../Redux/Slice/design.slice';
import { FaBookmark, FaHeart, FaRegBookmark } from 'react-icons/fa';
import { IMAGE_URL } from '../Utils/baseUrl';
import { useLocation, useNavigate } from 'react-router-dom';
import { addToWishList, getUserWishList } from '../Redux/Slice/user.slice';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const userIdDesign = location.state?.userIdDesign;

    const userId = sessionStorage.getItem('userId')
    const token = sessionStorage.getItem('token')

    const alldesign = useSelector((state) => userIdDesign ? state.design.allDesign.filter((user) => user?.userId == userIdDesign) : state.design.allDesign);
    const userWishlist = useSelector((state) => state?.user?.userWishList?.user?.wishlist);

    useEffect(() => {
        dispatch(getAlldesign())
        if (token) {
            dispatch(getUserWishList())
        }
    }, [])

    // Function to toggle heart state for specific card
    const toggleHeart = (likeId) => {
        if (token && userId) {
            dispatch(likeDesign(likeId));
        } else {
            enqueueSnackbar('Please login to like this design.', {
                variant: 'warning', autoHideDuration: 3000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    // Function to toggle bookmark state for specific card
    const toggleBookmark = (wishlistId) => {
        if (token && userId) {
            dispatch(addToWishList(wishlistId));
        } else {
            enqueueSnackbar('Please login to wishlist this design.', {
                variant: 'warning', autoHideDuration: 3000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    // Function to open single design view
    const openSingleView = (design) => {
        navigate(`/design/${design._id}`, { state: design });
    };

    const filteredCards = alldesign?.filter(card =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="shadow z-10 sticky top-0" style={{ boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)' }}>
                <Header setSearchTerm={setSearchTerm} />
            </div>
            {/* {showProfile ? <Profile setShowProfile={setShowProfile} /> : <Cards searchTerm={searchTerm} />} */}
            {/* <Cards searchTerm={searchTerm} /> */}
            <div className="p-8 overflow-y-scroll bg-primary-light/70 h-[calc(100vh-65px)] scrollbar-hide">
                {/* <div className="p-8 overflow-y-scroll bg-gradient-to-r from-purple-400 via-pink-200 to-indigo-400 h-[calc(100vh-65px)] scrollbar-hide"> */}
                {filteredCards?.length === 0 ? (
                    <div className='flex justify-center items-center min-h-[400px]'>
                        <div className='text-center'>
                            <div className="text-primary-dark font-bold text-[20px]">No results found. 😀</div>
                            <p className="text-primary-dark/50 font-medium text-[15px] mt-2">It seems we can't find any results based on your search.</p>
                        </div>
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
                        {filteredCards?.map((cardItem, index) => {
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
                                            <div className="flex gap-3 text-lg flex-shrink-0">
                                                <FaHeart
                                                    className={`hover:scale-110 transition-all duration-200 cursor-pointer ${cardItem.likes.includes(userId) ? 'text-red-600' : 'hover:text-red-600'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleHeart(cardItem._id);
                                                    }}
                                                />
                                                <FaBookmark
                                                    className={`hover:scale-110 transition-all duration-200 cursor-pointer ${userWishlist?.find((design) => design._id === cardItem._id) ? 'text-blue-600' : 'hover:text-blue-600'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleBookmark(cardItem._id);
                                                    }}
                                                />
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
        </div>
    )
}

export default Home