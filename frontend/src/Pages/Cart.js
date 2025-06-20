import React, { useEffect, useState } from 'react'
import Header from '../Component/Header'
import { FaChevronLeft, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, removeCart, updateCart } from '../Redux/Slice/design.slice';
import { IMAGE_URL } from '../Utils/baseUrl';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const Cart = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId');
    const cartItems = useSelector((state) => state?.design.cartitems?.cart);

    const handleHome = () => {
        navigate('/');
    }

    useEffect(() => {
        if (token && userId) {
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

    //  FOR PDF ............
    // const downloadPDF = async () => {
    //     const doc = new jsPDF();
    //     let y = 10;

    //     for (let i = 0; i < cartItems.length; i++) {
    //         const item = cartItems[i];

    //         // Draw image
    //         const imgUrl = `${IMAGE_URL}${item?.designData?.images?.[0]}`;
    //         // Load image as base64
    //         const img = new window.Image();
    //         img.crossOrigin = "Anonymous";
    //         img.src = imgUrl;

    //         // Wait for image to load
    //         await new Promise((resolve) => {
    //             img.onload = resolve;
    //         });

    //         // Draw image (resize if needed)
    //         doc.addImage(
    //             img,
    //             'JPEG',
    //             10,
    //             y,
    //             30,
    //             30
    //         );

    //         // Draw name
    //         doc.text(item?.designData?.title || '', 45, y + 10);
    //         doc.text(item?.designData?.description || '', 45, y + 18);

    //         y += 40;

    //         // Add new page if needed
    //         if (y > 250 && i !== cartItems.length - 1) {
    //             doc.addPage();
    //             y = 10;
    //         }
    //     }

    //     doc.save('Embroidery Design.pdf');
    // };

    // Helper function to convert image URL to base64
    const getImageBase64 = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/jpeg', 0.8);
                resolve(dataURL);
            };
            img.onerror = reject;
            img.src = url;
        });
    };

    // PDF Generation Function
    const downloadPDF = async () => {
        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            let yPosition = 20; // Start from top without main header

            // Function to get image dimensions and calculate size
            const getImageDimensions = (base64Image) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = function () {
                        resolve({
                            width: this.width,
                            height: this.height
                        });
                    };
                    img.src = base64Image;
                });
            };

            // Function to calculate PDF size maintaining aspect ratio
            const calculatePDFSize = (imgWidth, imgHeight, maxWidth = 80, maxHeight = 100) => {
                const aspectRatio = imgWidth / imgHeight;

                let pdfWidth = maxWidth;
                let pdfHeight = maxWidth / aspectRatio;

                if (pdfHeight > maxHeight) {
                    pdfHeight = maxHeight;
                    pdfWidth = maxHeight * aspectRatio;
                }

                return { width: pdfWidth, height: pdfHeight };
            };

            // Process each cart item
            for (let i = 0; i < cartItems.length; i++) {
                const item = cartItems[i];
                const images = item?.designData?.images || [];

                // Check if we need a new page (except for first item)
                if (i > 0) {
                    pdf.addPage();
                    yPosition = 20;
                }

                // Item title as header
                const title = item?.designData?.title || 'Untitled Item';
                const titleLines = pdf.splitTextToSize(title, pageWidth - 40);

                pdf.setFontSize(18);
                pdf.setFont('helvetica', 'bold');

                // Center the title
                for (let lineIndex = 0; lineIndex < titleLines.length; lineIndex++) {
                    const lineWidth = pdf.getTextWidth(titleLines[lineIndex]);
                    const titleX = (pageWidth - lineWidth) / 2;
                    pdf.text(titleLines[lineIndex], titleX, yPosition + (lineIndex * 7));
                }

                yPosition += titleLines.length * 7 + 20;

                // Handle images based on availability
                if (images.length === 0) {
                    // No images - show placeholder
                    const placeholderWidth = 60;
                    const placeholderHeight = 40;
                    const imgX = (pageWidth - placeholderWidth) / 2;
                    pdf.setDrawColor(200, 200, 200);
                    pdf.rect(imgX, yPosition, placeholderWidth, placeholderHeight);
                    pdf.setFontSize(8);
                    pdf.text('No images available', imgX + 5, yPosition + 20);
                    yPosition += placeholderHeight + 20;

                } else if (images.length === 1) {
                    // Single image - center it with actual dimensions
                    try {
                        const imageUrl = `${IMAGE_URL}${images[0]}`;
                        const base64Image = await getImageBase64(imageUrl);
                        const imageDims = await getImageDimensions(base64Image);
                        const pdfSize = calculatePDFSize(imageDims.width, imageDims.height);

                        const imgX = (pageWidth - pdfSize.width) / 2;
                        pdf.addImage(base64Image, 'JPEG', imgX, yPosition, pdfSize.width, pdfSize.height);
                        yPosition += pdfSize.height + 20;
                    } catch (error) {
                        console.error('Error loading image:', error);
                        const placeholderWidth = 60;
                        const placeholderHeight = 40;
                        const imgX = (pageWidth - placeholderWidth) / 2;
                        pdf.setDrawColor(200, 200, 200);
                        pdf.rect(imgX, yPosition, placeholderWidth, placeholderHeight);
                        pdf.setFontSize(8);
                        pdf.text('Image not available', imgX + 5, yPosition + 20);
                        yPosition += placeholderHeight + 20;
                    }

                } else {
                    // Multiple images - arrange vertically (one below another)
                    for (let j = 0; j < images.length; j++) {
                        try {
                            const imageUrl = `${IMAGE_URL}${images[j]}`;
                            const base64Image = await getImageBase64(imageUrl);
                            const imageDims = await getImageDimensions(base64Image);
                            const pdfSize = calculatePDFSize(imageDims.width, imageDims.height, 80, 80);

                            // Check if we need a new page
                            if (yPosition + pdfSize.height > pageHeight - 30) {
                                pdf.addPage();
                                yPosition = 20;
                            }

                            const imgX = (pageWidth - pdfSize.width) / 2;
                            pdf.addImage(base64Image, 'JPEG', imgX, yPosition, pdfSize.width, pdfSize.height);
                            yPosition += pdfSize.height + 15; // Space between images

                        } catch (error) {
                            console.error(`Error loading image ${j + 1}:`, error);

                            // Check if we need a new page for placeholder
                            const placeholderHeight = 40;
                            if (yPosition + placeholderHeight > pageHeight - 30) {
                                pdf.addPage();
                                yPosition = 20;
                            }

                            const placeholderWidth = 60;
                            const imgX = (pageWidth - placeholderWidth) / 2;
                            pdf.setDrawColor(200, 200, 200);
                            pdf.rect(imgX, yPosition, placeholderWidth, placeholderHeight);
                            pdf.setFontSize(8);
                            pdf.text(`Image ${j + 1} not available`, imgX + 5, yPosition + 20);
                            yPosition += placeholderHeight + 15;
                        }
                    }
                }
            }

            // Save the PDF
            pdf.save(`Embroidery Design.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    };

    return (
        <div className="">
            <div className="shadow z-10 sticky top-0" style={{ boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)' }}>
                <Header />
            </div>
            {/* <div className="bg-gradient-to-r from-purple-400 via-pink-200 to-indigo-400 p-4 h-[calc(100vh-65px)] overflow-y-scroll scrollbar-hide"> */}
            <div className="bg-primary-light/70 p-4 h-[calc(100vh-65px)] overflow-y-scroll scrollbar-hide">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white/30 backdrop-blur-lg rounded-lg shadow-sm p-6">

                        {cartItems?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
                                {/* Left Section - Cart Items */}
                                <div className="lg:col-span-2">
                                    <div className="flex items-center justify-between mb-8">
                                        <h1 className="text-2xl font-bold text-black">Shopping Cart</h1>
                                        {cartItems?.length > 0 && (
                                            <span className="text-lg text-black font-bold">{cartItems?.length} Items</span>
                                        )}
                                    </div>

                                    {/* Table Headers */}
                                    <div className="hidden lg:grid grid-cols-12 gap-4 pb-4 border-b border-black text-sm font-medium text-black uppercase tracking-wide">
                                        <div className="col-span-6">Product Details</div>
                                        <div className="col-span-2 text-center">Quantity</div>
                                        <div className="col-span-2 text-center">Price</div>
                                        <div className="col-span-2 text-center">Total</div>
                                    </div>
                                    {/* Cart Items */}
                                    <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                                        {cartItems?.map((item, index) => (
                                            <div key={index} className="border-b border-black pb-4 lg:pb-0 lg:border-b-0">
                                                {/* Mobile Layout */}
                                                <div className="block lg:hidden">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center">
                                                            <img src={`${IMAGE_URL}${item?.designData?.images?.[0]}`} alt={item?.designData?.title} className='h-16' />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-black text-sm sm:text-base line-clamp-1">{item?.designData?.title}</h3>
                                                            <p className="text-xs sm:text-sm text-black line-clamp-1">{item?.designData?.description}</p>
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
                                                    <div className="col-span-2 flex items-center space-x-4">
                                                        <div className="w-20 h-20 bg-primary/60 rounded-lg flex items-center justify-center">
                                                            {/* <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-600 rounded"></div> */}
                                                            <img src={`${IMAGE_URL}${item?.designData?.images?.[0]}`} alt={item?.designData?.title} className='h-16' />
                                                        </div>
                                                    </div>
                                                    <div className="col-span-4 flex items-center space-x-4">
                                                        <div>
                                                            <h3 className="font-semibold text-black line-clamp-1">{item?.designData?.title}</h3>
                                                            <p className="text-sm text-black line-clamp-1">{item?.designData?.description}</p>
                                                            <button
                                                                onClick={() => removeItem(item._id)}
                                                                className="text-sm text-red-500 hover:text-red-500 mt-1 font-semibold"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="col-span-2 flex items-center justify-center">
                                                        <div className="flex items-center border border-black rounded">
                                                            <button
                                                                onClick={() => updateQuantity(item._id, -1)}
                                                                className="p-2"
                                                            >
                                                                <FaMinus size={16} className='text-black' />
                                                            </button>
                                                            <span className="px-4 py-2 border-l border-r border-black min-w-[60px] text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item._id, 1)}
                                                                className="p-2"
                                                            >
                                                                <FaPlus size={16} className='text-black' />
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
                                    <div className="mt-2 lg:mt-8 pt-2 lg:pt-6 border-0 lg:border-t border-black">
                                        <button className="flex items-center text-black font-semibold" onClick={handleHome}>
                                            <FaChevronLeft size={20} className="mr-2" />
                                            Continue Shopping
                                        </button>
                                    </div>
                                </div>
                                <div className="lg:col-span-1">
                                    <div className="bg-primary-light/90 rounded-lg p-6">
                                        <h2 className="text-xl font-semibold text-black mb-6">Order Summary</h2>

                                        {/* Items Summary */}
                                        <div className="space-y-4 mb-6">
                                            <div className="flex justify-between">
                                                <span className="text-black font-semibold">ITEMS {cartItems?.length}</span>
                                                <span className="font-semibold text-black/70">₹{subtotal?.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {/* Total Cost */}
                                        <div className="border-t border-black pt-4 mb-6">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-semibold text-base text-black">shipping</span>
                                                <span className="font-bold text-base text-black/70">₹{shipping.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-base text-black">Total Cost</span>
                                                <span className="font-bold text-base text-black/70">₹{totalCost.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="block md:flex justify-between">
                                            {/* Checkout Button */}
                                            <button className="w-full md:w-32 mb-2 md:mb-0 bg-primary-dark/50 text-black py-3 rounded-lg font-medium hover:bg-primary-dark/60 transition-colors">
                                                CHECKOUT
                                            </button>
                                            {/* Print Button */}
                                            <button className="w-full md:w-32 bg-primary-dark/50 text-black py-3 rounded-lg font-medium hover:bg-primary-dark/60 transition-colors" onClick={downloadPDF}>
                                                PRINT
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="">
                                <h1 className="text-2xl font-bold text-primary-dark">Shopping Cart</h1>
                                <div className="text-2xl text-center font-bold flex flex-col items-center">
                                    <FaShoppingCart size={30} className="mb-4" />
                                    <p>Your Cart is Empty.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Cart