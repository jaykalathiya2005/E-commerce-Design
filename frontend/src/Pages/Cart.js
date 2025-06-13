import React, { useEffect, useState } from 'react'
import Header from '../Component/Header'
import { FaChevronDown, FaChevronLeft, FaMinus, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, removeCart, updateCart } from '../Redux/Slice/design.slice';
import { IMAGE_URL } from '../Utils/baseUrl';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const cartItems = useSelector((state) => state?.design.cartitems?.cart);

    const handleHome = () => {
        navigate('/');
    }

    useEffect(() => {
        if (token) {
            dispatch(getCart());
        }
    }, [])

    const updateQuantity = (id, newQuantity) => {
        dispatch(updateCart({ cartItemId: id, newQuantity }));
    };

    const removeItem = (id) => {
        dispatch(removeCart(id));
    };

    const subtotal = cartItems?.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const shipping = 5.00;
    const totalCost = subtotal + shipping;

    return (
        <div className="">
            <div className="shadow z-10 sticky top-0" style={{ boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)' }}>
                <Header />
            </div>
            <div className="bg-gradient-to-r from-purple-400 via-pink-200 to-indigo-400 p-4 min-h-[calc(100vh-65px)] h-full">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white/50 rounded-lg shadow-sm p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                            {/* Left Section - Cart Items */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center justify-between mb-8">
                                    <h1 className="text-2xl font-bold text-primary-dark">Shopping Cart</h1>
                                    <span className="text-lg text-primary-dark font-bold">{cartItems?.length} Items</span>
                                </div>

                                {/* Table Headers */}
                                {/* <div className="grid grid-cols-12 gap-4 pb-4 border-b border-primary-dark text-sm font-medium text-primary-light uppercase tracking-wide">
                                    <div className="col-span-6">Product Details</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-2 text-center">Price</div>
                                    <div className="col-span-2 text-center">Total</div>
                                </div> */}
                                <div className="hidden lg:grid grid-cols-12 gap-4 pb-4 border-b border-primary-light text-sm font-medium text-primary-light uppercase tracking-wide">
                                    <div className="col-span-6">Product Details</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-2 text-center">Price</div>
                                    <div className="col-span-2 text-center">Total</div>
                                </div>
                                {/* Cart Items */}
                                {/* <div className="space-y-6 mt-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-4">
                                            <div className="col-span-6 flex items-center space-x-4">
                                                <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center">
                                                    <div className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center">
                                                        <span className="text-white font-bold text-xs">{item.platform}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-primary-dark">{item.name}</h3>
                                                    <p className="text-sm text-gray-500">{item.platform}</p>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="col-span-2 flex items-center justify-center">
                                                <div className="flex items-center border border-gray-300 rounded">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="p-2"
                                                    >
                                                        <FaMinus size={16} />
                                                    </button>
                                                    <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[60px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="p-2"
                                                    >
                                                        <FaPlus size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="col-span-2 text-center">
                                                <span className="font-semibold">₹{item.price.toFixed(2)}</span>
                                            </div>

                                            <div className="col-span-2 text-center">
                                                <span className="font-semibold">₹{item.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div> */}

                                <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                                    {cartItems?.map((item, index) => (
                                        <div key={index} className="border-b border-primary-light pb-4 lg:pb-0 lg:border-b-0">
                                            {/* Mobile Layout */}
                                            <div className="block lg:hidden">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center">
                                                        <img src={`${IMAGE_URL}${item?.designData?.images?.[0]}`} alt={item?.designData?.title} className='h-16' />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-primary-dark text-sm sm:text-base line-clamp-1">{item?.designData?.title}</h3>
                                                        <p className="text-xs sm:text-sm text-primary-light line-clamp-1">{item?.designData?.description}</p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="font-semibold text-sm">₹{item.price?.toFixed(2)}</span>
                                                            <span className="font-bold text-sm">₹{(item.quantity * item.price)?.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-3">
                                                            <div className="flex items-center border border-primary-dark rounded">
                                                                <button
                                                                    onClick={() => updateQuantity(item._id, -1)}
                                                                    className="p-1.5"
                                                                >
                                                                    <FaMinus size={14} />
                                                                </button>
                                                                <span className="px-3 py-1.5 border-l border-r border-primary-dark min-w-[50px] text-center text-sm">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item._id, 1)}
                                                                    className="p-1.5"
                                                                >
                                                                    <FaPlus size={14} />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => removeItem(item._id)}
                                                                className="text-xs text-red-500 hover:text-red-500"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Desktop Layout */}
                                            <div className="hidden lg:grid grid-cols-12 gap-4 items-center py-4">
                                                {/* Product Details */}
                                                <div className="col-span-6 flex items-center space-x-4">
                                                    <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center">
                                                        {/* <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-600 rounded"></div> */}
                                                        <img src={`${IMAGE_URL}${item?.designData?.images?.[0]}`} alt={item?.designData?.title} className='h-16' />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-primary-dark line-clamp-1">{item?.designData?.title}</h3>
                                                        <p className="text-sm text-primary-light line-clamp-1">{item?.designData?.description}</p>
                                                        <button
                                                            onClick={() => removeItem(item._id)}
                                                            className="text-sm text-red-500 hover:text-red-500 mt-1"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Quantity */}
                                                <div className="col-span-2 flex items-center justify-center">
                                                    <div className="flex items-center border border-primary-dark rounded">
                                                        <button
                                                            onClick={() => updateQuantity(item._id, -1)}
                                                            className="p-2"
                                                        >
                                                            <FaMinus size={16} />
                                                        </button>
                                                        <span className="px-4 py-2 border-l border-r border-primary-dark min-w-[60px] text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item._id, 1)}
                                                            className="p-2"
                                                        >
                                                            <FaPlus size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="col-span-2 text-center">
                                                    <span className="font-semibold">₹{item.price?.toFixed(2)}</span>
                                                </div>

                                                {/* Total */}
                                                <div className="col-span-2 text-center">
                                                    <span className="font-semibold">₹{(item.quantity * item.price)?.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Continue Shopping */}
                                <div className="mt-2 lg:mt-8 pt-2 lg:pt-6 border-0 lg:border-t border-primary-light">
                                    <button className="flex items-center text-primary-dark font-semibold" onClick={handleHome}>
                                        <FaChevronLeft size={20} className="mr-2" />
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>

                            {/* Right Section - Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                                    {/* Items Summary */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-primary-light font-semibold">ITEMS {cartItems?.length}</span>
                                            <span className="font-semibold">₹{subtotal?.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Total Cost */}
                                    <div className="border-t border-gray-200 pt-4 mb-6">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-base">shipping</span>
                                            <span className="font-bold text-base">₹{shipping.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-base">Total Cost</span>
                                            <span className="font-bold text-base">₹{totalCost.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                        CHECKOUT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart