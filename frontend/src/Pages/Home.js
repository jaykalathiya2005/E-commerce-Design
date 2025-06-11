import React, { useEffect, useState } from 'react'
import Header from '../Component/Header';
import Cards from '../Component/Cards';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { getAlldesign } from '../Redux/Slice/design.slice';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaRegBookmark, FaRegHeart, FaShare } from 'react-icons/fa';
import { IMAGE_URL } from '../Utils/baseUrl';
import { FaCartShopping } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState("");
    // Use objects to track state for each card by ID
    const [heartStates, setHeartStates] = useState({});
    const [bookmarkStates, setBookmarkStates] = useState({});
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'single'
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userId = sessionStorage.getItem('userId')
    const token = sessionStorage.getItem('token')

    const alldesign = useSelector((state) => state.design.allDesign);

    useEffect(() => {
        dispatch(getAlldesign())
    }, [])

    // Function to toggle heart state for specific card
    const toggleHeart = (cardId) => {
        if (userId && token) {
            setHeartStates(prev => ({
                ...prev,
                [cardId]: !prev[cardId]
            }));
            const action = heartStates[cardId] ? 'Removed from favorites' : 'Added to favorites';
            enqueueSnackbar(action, {
                variant: 'success', autoHideDuration: 3000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        } else {
            enqueueSnackbar('Please login to like this.', {
                variant: 'warning', autoHideDuration: 3000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            return;
        }
    };

    // Function to toggle bookmark state for specific card
    const toggleBookmark = (cardId) => {
        if (userId && token) {
            setBookmarkStates(prev => ({
                ...prev,
                [cardId]: !prev[cardId]
            }));
            const action = bookmarkStates[cardId] ? 'Removed from wishlist' : 'Added to wishlist';
            enqueueSnackbar(action, {
                variant: 'success', autoHideDuration: 3000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        } else {
            enqueueSnackbar('Please login to add in wishlist.', {
                variant: 'warning', autoHideDuration: 3000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            return;
        }
    };

    // Function to open single design view
    const openSingleView = (design) => {
        navigate(`/design/${design._id}`, { state: design });
        // setSelectedDesign(design);
        // setCurrentImageIndex(0);
        // setViewMode('single');
    };

    // Function to go back to grid view
    const backToGrid = () => {
        setViewMode('grid');
        setSelectedDesign(null);
        setCurrentImageIndex(0);
    };

    // Function to navigate images
    const nextImage = () => {
        if (selectedDesign && selectedDesign.images) {
            setCurrentImageIndex((prev) =>
                prev === selectedDesign.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (selectedDesign && selectedDesign.images) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedDesign.images.length - 1 : prev - 1
            );
        }
    };

    // Handle Add to cart
    const handleAddtocart = () => {
    };

    // Handle share
    const handleShare = () => {
        if (navigator.share && selectedDesign) {
            navigator.share({
                title: selectedDesign.title,
                text: selectedDesign.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            enqueueSnackbar('Link copied to clipboard!', {
                variant: 'success', autoHideDuration: 3000, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (viewMode === 'single') {
                if (e.key === 'ArrowLeft') {
                    prevImage();
                } else if (e.key === 'ArrowRight') {
                    nextImage();
                } else if (e.key === 'Escape') {
                    backToGrid();
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [viewMode, selectedDesign]);

    const filteredCards = alldesign?.filter(card =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Render single design view
    if (viewMode === 'single' && selectedDesign) {
        return (
            <div className="">
                <Header />
                <div className="h-[calc(100vh-125px)] md:h-[calc(100vh-65px)] bg-primary-light/70">
                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <button
                                onClick={backToGrid}
                                className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
                            >
                                <FaArrowLeft />
                                <span>Back to Gallery</span>
                            </button>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleHeart(selectedDesign._id)}
                                    className={`p-2 rounded-full transition-all ${heartStates[selectedDesign._id]
                                        ? 'bg-red-50 text-red-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                                        }`}
                                >
                                    <FaRegHeart className="text-lg" />
                                </button>

                                <button
                                    onClick={() => toggleBookmark(selectedDesign._id)}
                                    className={`p-2 rounded-full transition-all ${bookmarkStates[selectedDesign._id]
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                >
                                    <FaRegBookmark className="text-lg" />
                                </button>

                                <button
                                    onClick={handleShare}
                                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                    <FaShare className="text-lg" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Image Section */}
                            <div className="lg:col-span-2">
                                <div className="bg-primary/70 rounded-2xl shadow-sm overflow-hidden">
                                    {/* Image Display */}
                                    <div className="relative flex items-center justify-center w-full h-[500px]">
                                        {/* flex items-center justify-center */}
                                        {selectedDesign.images && selectedDesign.images.length > 0 && (
                                            <>
                                                <img
                                                    src={`${IMAGE_URL}${selectedDesign.images[currentImageIndex]}`}
                                                    alt={`${selectedDesign.title} - Image ${currentImageIndex + 1}`}
                                                    className="max-w-full max-h-full object-contain"
                                                />

                                                {/* Navigation Arrows */}
                                                {selectedDesign.images.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={prevImage}
                                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all"
                                                        >
                                                            <FaChevronLeft className="text-gray-700" />
                                                        </button>
                                                        <button
                                                            onClick={nextImage}
                                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all"
                                                        >
                                                            <FaChevronRight className="text-gray-700" />
                                                        </button>
                                                    </>
                                                )}

                                                {/* Image Counter */}
                                                {selectedDesign.images.length > 1 && (
                                                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                                        {currentImageIndex + 1} / {selectedDesign.images.length}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-2xl overflow-hidden">
                                    {/* Image Thumbnails */}
                                    {selectedDesign.images && selectedDesign.images.length > 1 && (
                                        <div className="py-4">
                                            <div className="flex gap-2 overflow-x-auto">
                                                {selectedDesign.images.map((image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                                            ? 'border-primary-dark'
                                                            : 'border-primary hover:border-light/70'
                                                            }`}
                                                    >
                                                        <img
                                                            src={`${IMAGE_URL}${image}`}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="space-y-6">
                                {/* Title and Description */}
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedDesign.title}</h1>
                                    <p className="text-gray-600 text-md leading-relaxed">{selectedDesign.description}</p>
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={handleAddtocart}
                                    className="w-full bg-primary-dark text-white py-3 rounded-xl font-semibold text-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-3"
                                >
                                    <FaCartShopping />
                                    Add To Cart
                                </button>

                                {/* Design Details */}
                                {/* <div className="bg-white rounded-2xl shadow-sm p-6">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Details</h3>
                              <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                      <span className="text-gray-600">Images</span>
                                      <span className="font-medium">{selectedDesign.images?.length || 0}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                      <span className="text-gray-600">Category</span>
                                      <span className="font-medium">{selectedDesign.category || 'Design'}</span>
                                  </div>
                                  {selectedDesign.createdAt && (
                                      <div className="flex items-center justify-between">
                                          <span className="text-gray-600">Created</span>
                                          <span className="font-medium">
                                              {new Date(selectedDesign.createdAt).toLocaleDateString()}
                                          </span>
                                      </div>
                                  )}
                              </div>
                          </div> */}

                                {/* Tags */}
                                {selectedDesign.tags && selectedDesign.tags.length > 0 && (
                                    <div className="bg-white rounded-2xl shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDesign.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        );
    }

    return (
        <div>
            <Header setSearchTerm={setSearchTerm} />
            {/* {showProfile ? <Profile setShowProfile={setShowProfile} /> : <Cards searchTerm={searchTerm} />} */}
            {/* <Cards searchTerm={searchTerm} /> */}
            <div className="p-8 overflow-y-scroll bg-primary-light/70 h-[calc(100vh-65px)] scrollbar-hide">
                {filteredCards.length === 0 ? (
                    <div className='flex justify-center items-center min-h-[400px]'>
                        <div className='text-center'>
                            <div className="text-black font-bold text-[20px]">No results found. 😀</div>
                            <p className="text-gray-400 text-[15px] mt-2">It seems we can't find any results based on your search.</p>
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
                        {filteredCards.map((cardItem, index) => {
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
                                                <FaRegHeart
                                                    className={`hover:scale-110 transition-all duration-200 cursor-pointer ${heartStates[cardItem._id] ? 'text-red-400' : 'hover:text-red-400'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleHeart(cardItem._id);
                                                    }}
                                                />
                                                <FaRegBookmark
                                                    className={`hover:scale-110 transition-all duration-200 cursor-pointer ${bookmarkStates[cardItem._id] ? 'text-blue-400' : 'hover:text-blue-400'
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