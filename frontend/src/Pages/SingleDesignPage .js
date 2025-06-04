import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaRegBookmark, FaRegHeart, FaArrowLeft, FaChevronLeft, FaChevronRight, FaDownload, FaShare, FaUser, FaCalendar } from 'react-icons/fa'
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { getAlldesign } from '../Redux/Slice/design.slice';
import { IMAGE_URL } from '../Utils/baseUrl';

const SingleDesignPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [design, setDesign] = useState(null);
    const [loading, setLoading] = useState(true);

    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');

    const alldesign = useSelector((state) => state.design.allDesign);

    useEffect(() => {
        if (alldesign.length === 0) {
            dispatch(getAlldesign());
        }
    }, [dispatch, alldesign.length]);

    useEffect(() => {
        if (alldesign.length > 0) {
            const foundDesign = alldesign.find(design => design._id === id);
            if (foundDesign) {
                setDesign(foundDesign);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
    }, [alldesign, id]);

    // Function to toggle heart state
    const toggleHeart = () => {
        if (userId && token) {
            setIsLiked(!isLiked);
            enqueueSnackbar(isLiked ? 'Removed from favorites' : 'Added to favorites', {
                variant: 'success',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        } else {
            enqueueSnackbar('Please login to like this design.', {
                variant: 'warning',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    // Function to toggle bookmark state
    const toggleBookmark = () => {
        if (userId && token) {
            setIsBookmarked(!isBookmarked);
            enqueueSnackbar(isBookmarked ? 'Removed from wishlist' : 'Added to wishlist', {
                variant: 'success',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        } else {
            enqueueSnackbar('Please login to add to wishlist.', {
                variant: 'warning',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    // Function to navigate images
    const nextImage = () => {
        if (design && design.images) {
            setCurrentImageIndex((prev) =>
                prev === design.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (design && design.images) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? design.images.length - 1 : prev - 1
            );
        }
    };

    // Handle download
    const handleDownload = () => {
        if (userId && token) {
            // Add your download logic here
            enqueueSnackbar('Download started!', {
                variant: 'success',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        } else {
            enqueueSnackbar('Please login to download.', {
                variant: 'warning',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    // Handle share
    const handleShare = () => {
        if (navigator.share && design) {
            navigator.share({
                title: design.title,
                text: design.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            enqueueSnackbar('Link copied to clipboard!', {
                variant: 'success',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
        }
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [design]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading design...</p>
                </div>
            </div>
        );
    }

    if (!design) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Design Not Found</h1>
                    <p className="text-gray-600 mb-6">The design you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <FaArrowLeft />
                            <span>Back</span>
                        </button>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleHeart}
                                className={`p-2 rounded-full transition-all ${isLiked
                                    ? 'bg-red-50 text-red-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                                    }`}
                            >
                                <FaRegHeart className="text-lg" />
                            </button>

                            <button
                                onClick={toggleBookmark}
                                className={`p-2 rounded-full transition-all ${isBookmarked
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
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Image Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            {/* Image Display */}
                            <div className="relative bg-gray-100 aspect-video flex items-center justify-center">
                                {design.images && design.images.length > 0 && (
                                    <>
                                        <img
                                            src={`${IMAGE_URL}${design.images[currentImageIndex]}`}
                                            alt={`${design.title} - Image ${currentImageIndex + 1}`}
                                            className="max-w-full max-h-full object-contain"
                                        />

                                        {/* Navigation Arrows */}
                                        {design.images.length > 1 && (
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
                                    </>
                                )}
                            </div>

                            {/* Image Thumbnails */}
                            {design.images && design.images.length > 1 && (
                                <div className="p-4 border-t">
                                    <div className="flex gap-2 overflow-x-auto">
                                        {design.images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                                    ? 'border-blue-500'
                                                    : 'border-gray-200 hover:border-gray-300'
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{design.title}</h1>
                            <p className="text-gray-600 text-lg leading-relaxed">{design.description}</p>
                        </div>

                        {/* Download Button */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <button
                                onClick={handleDownload}
                                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3"
                            >
                                <FaDownload />
                                Download Design
                            </button>
                        </div>

                        {/* Design Details */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Images</span>
                                    <span className="font-medium">{design.images?.length || 0}</span>
                                </div>
                                {/* <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Category</span>
                                    <span className="font-medium">{design.category || 'Design'}</span>
                                </div> */}
                                {design.createdAt && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Created</span>
                                        <span className="font-medium">
                                            {new Date(design.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        {design.tags && design.tags.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {design.tags.map((tag, index) => (
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
        </div>
    );
};

export default SingleDesignPage;