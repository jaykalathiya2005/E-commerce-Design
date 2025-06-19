import React, { useState } from 'react';
import { FaChevronLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCreditCard, FaCheck, FaTruck, FaShoppingCart } from 'react-icons/fa';

const OrderPlacementFlow = ({ cartItems = [], cartTotal = 0, onBack }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [orderData, setOrderData] = useState({
        shippingInfo: {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
        },
        shippingMethod: 'standard',
        paymentMethod: 'card',
        cardDetails: {
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            cardholderName: ''
        },
        billingAddress: {
            sameAsShipping: true,
            address: '',
            city: '',
            state: '',
            pincode: ''
        }
    });

    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');

    const shippingOptions = [
        { value: 'standard', label: 'Standard Delivery (5-7 days)', price: 5.00 },
        { value: 'express', label: 'Express Delivery (2-3 days)', price: 15.00 },
        { value: 'overnight', label: 'Overnight Delivery (1 day)', price: 35.00 }
    ];

    const paymentMethods = [
        { value: 'card', label: 'Credit/Debit Card', icon: FaCreditCard },
        { value: 'upi', label: 'UPI Payment', icon: FaPhone },
        { value: 'cod', label: 'Cash on Delivery', icon: FaTruck }
    ];

    const calculateTotal = () => {
        const shippingCost = shippingOptions.find(option => option.value === orderData.shippingMethod)?.price || 0;
        const codFee = orderData.paymentMethod === 'cod' ? 20 : 0;
        return cartTotal + shippingCost + codFee;
    };

    const updateOrderData = (field, value) => {
        const keys = field.split('.');
        if (keys.length === 2) {
            setOrderData(prev => ({
                ...prev,
                [keys[0]]: { ...prev[keys[0]], [keys[1]]: value }
            }));
        } else {
            setOrderData(prev => ({ ...prev, [field]: value }));
        }
    };

    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const placeOrder = () => {
        // Generate order ID
        const newOrderId = `ORD${Date.now().toString().slice(-8)}`;
        setOrderId(newOrderId);
        setOrderPlaced(true);
        setCurrentStep(4);
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${currentStep >= step ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}>
                        {step}
                    </div>
                    {step < 3 && (
                        <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-indigo-600' : 'bg-gray-300'
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );

    const ShippingStep = () => (
        <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Shipping Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                            <FaUser className="mr-3 text-indigo-600" />
                            Shipping Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    value={orderData.shippingInfo.fullName}
                                    onChange={(e) => updateOrderData('shippingInfo.fullName', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={orderData.shippingInfo.email}
                                    onChange={(e) => updateOrderData('shippingInfo.email', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={orderData.shippingInfo.phone}
                                    onChange={(e) => updateOrderData('shippingInfo.phone', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your phone"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Country</label>
                                <select
                                    value={orderData.shippingInfo.country}
                                    onChange={(e) => updateOrderData('shippingInfo.country', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="UK">UK</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2">Street Address *</label>
                                <textarea
                                    value={orderData.shippingInfo.address}
                                    onChange={(e) => updateOrderData('shippingInfo.address', e.target.value)}
                                    rows="3"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your complete address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">City *</label>
                                <input
                                    type="text"
                                    value={orderData.shippingInfo.city}
                                    onChange={(e) => updateOrderData('shippingInfo.city', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter city"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">State *</label>
                                <input
                                    type="text"
                                    value={orderData.shippingInfo.state}
                                    onChange={(e) => updateOrderData('shippingInfo.state', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter state"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">PIN Code *</label>
                                <input
                                    type="text"
                                    value={orderData.shippingInfo.pincode}
                                    onChange={(e) => updateOrderData('shippingInfo.pincode', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter PIN code"
                                />
                            </div>
                        </div>

                        {/* Shipping Options */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
                            <div className="space-y-3">
                                {shippingOptions.map((option) => (
                                    <label key={option.value} className="flex items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value={option.value}
                                                checked={orderData.shippingMethod === option.value}
                                                onChange={(e) => updateOrderData('shippingMethod', e.target.value)}
                                                className="mr-3"
                                            />
                                            <span className="font-medium">{option.label}</span>
                                        </div>
                                        <span className="font-bold text-indigo-600">₹{option.price.toFixed(2)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                        {/* Mock cart items display */}
                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                            {cartItems.length > 0 ? cartItems.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="truncate">{item.name || `Design ${index + 1}`}</span>
                                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            )) : (
                                <div className="text-sm text-gray-500">
                                    <div className="flex justify-between"><span>Embroidery Design 1</span><span>₹150</span></div>
                                    <div className="flex justify-between"><span>Custom Logo</span><span>₹200</span></div>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{shippingOptions.find(option => option.value === orderData.shippingMethod)?.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total</span>
                                <span className="text-indigo-600">₹{calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between max-w-4xl mx-auto mt-8">
                <button
                    onClick={onBack}
                    className="flex items-center bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    <FaChevronLeft className="mr-2" />
                    Back to Cart
                </button>
                <button
                    onClick={nextStep}
                    disabled={!orderData.shippingInfo.fullName || !orderData.shippingInfo.email || !orderData.shippingInfo.phone || !orderData.shippingInfo.address}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Continue to Payment
                </button>
            </div>
        </div>
    );

    const PaymentStep = () => (
        <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Payment Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center">
                            <FaCreditCard className="mr-3 text-indigo-600" />
                            Payment Method
                        </h2>

                        {/* Payment Method Selection */}
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            {paymentMethods.map((method) => (
                                <label key={method.value} className="flex flex-col items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={method.value}
                                        checked={orderData.paymentMethod === method.value}
                                        onChange={(e) => updateOrderData('paymentMethod', e.target.value)}
                                        className="mb-2"
                                    />
                                    <method.icon className="text-2xl mb-2" />
                                    <span className="text-sm font-medium">{method.label}</span>
                                </label>
                            ))}
                        </div>

                        {/* Card Details */}
                        {orderData.paymentMethod === 'card' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Cardholder Name</label>
                                    <input
                                        type="text"
                                        value={orderData.cardDetails.cardholderName}
                                        onChange={(e) => updateOrderData('cardDetails.cardholderName', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Name on card"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Card Number</label>
                                    <input
                                        type="text"
                                        value={orderData.cardDetails.cardNumber}
                                        onChange={(e) => updateOrderData('cardDetails.cardNumber', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                                        <input
                                            type="text"
                                            value={orderData.cardDetails.expiryDate}
                                            onChange={(e) => updateOrderData('cardDetails.expiryDate', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="MM/YY"
                                            maxLength="5"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">CVV</label>
                                        <input
                                            type="text"
                                            value={orderData.cardDetails.cvv}
                                            onChange={(e) => updateOrderData('cardDetails.cvv', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="123"
                                            maxLength="4"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* UPI Payment */}
                        {orderData.paymentMethod === 'upi' && (
                            <div className="text-center p-8 bg-gray-50 rounded-lg">
                                <div className="w-48 h-48 bg-white mx-auto mb-4 rounded-lg flex items-center justify-center">
                                    <div className="text-4xl">📱</div>
                                </div>
                                <p className="text-lg font-semibold mb-2">Scan QR Code to Pay</p>
                                <p className="text-gray-600">Use any UPI app to scan and pay</p>
                                <p className="text-2xl font-bold text-indigo-600 mt-4">₹{calculateTotal().toFixed(2)}</p>
                            </div>
                        )}

                        {/* COD Info */}
                        {orderData.paymentMethod === 'cod' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h4 className="font-semibold text-yellow-800 mb-2">Cash on Delivery</h4>
                                <p className="text-yellow-700 text-sm">
                                    You will pay ₹{calculateTotal().toFixed(2)} (including ₹20 COD fee) when your order is delivered.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Final Order Summary</h3>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping ({shippingOptions.find(option => option.value === orderData.shippingMethod)?.label})</span>
                                <span>₹{shippingOptions.find(option => option.value === orderData.shippingMethod)?.price.toFixed(2)}</span>
                            </div>
                            {orderData.paymentMethod === 'cod' && (
                                <div className="flex justify-between">
                                    <span>COD Fee</span>
                                    <span>₹20.00</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total</span>
                                <span className="text-indigo-600">₹{calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center text-green-700">
                                <FaCheck className="mr-2" />
                                <span className="text-sm">Secure payment processing</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between max-w-4xl mx-auto mt-8">
                <button
                    onClick={prevStep}
                    className="flex items-center bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    <FaChevronLeft className="mr-2" />
                    Back
                </button>
                <button
                    onClick={nextStep}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                    Review Order
                </button>
            </div>
        </div>
    );

    const ReviewStep = () => (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Shipping Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold">{orderData.shippingInfo.fullName}</p>
                            <p>{orderData.shippingInfo.address}</p>
                            <p>{orderData.shippingInfo.city}, {orderData.shippingInfo.state} - {orderData.shippingInfo.pincode}</p>
                            <p>{orderData.shippingInfo.country}</p>
                            <p className="mt-2">
                                <span className="text-sm text-gray-600">Email: </span>
                                {orderData.shippingInfo.email}
                            </p>
                            <p>
                                <span className="text-sm text-gray-600">Phone: </span>
                                {orderData.shippingInfo.phone}
                            </p>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold capitalize">{paymentMethods.find(method => method.value === orderData.paymentMethod)?.label}</p>
                            {orderData.paymentMethod === 'card' && (
                                <p className="text-sm text-gray-600">**** **** **** {orderData.cardDetails.cardNumber.slice(-4)}</p>
                            )}
                            <p className="text-sm text-gray-600 mt-2">
                                Shipping: {shippingOptions.find(option => option.value === orderData.shippingMethod)?.label}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹{shippingOptions.find(option => option.value === orderData.shippingMethod)?.price.toFixed(2)}</span>
                        </div>
                        {orderData.paymentMethod === 'cod' && (
                            <div className="flex justify-between">
                                <span>COD Fee</span>
                                <span>₹20.00</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-xl border-t pt-2">
                            <span>Total</span>
                            <span className="text-indigo-600">₹{calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={prevStep}
                    className="flex items-center bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    <FaChevronLeft className="mr-2" />
                    Back
                </button>
                <button
                    onClick={placeOrder}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
                >
                    <FaCheck className="mr-2" />
                    Place Order - ₹{calculateTotal().toFixed(2)}
                </button>
            </div>
        </div>
    );

    const OrderSuccess = () => (
        <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheck className="text-green-600 text-3xl" />
                </div>

                <h2 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-6">
                    Thank you for your order! We've received your payment and will start processing your embroidery designs.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="font-bold mb-4">Order Details</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Order ID:</span>
                            <span className="font-bold">{orderId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Amount:</span>
                            <span className="font-bold">₹{calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Payment Method:</span>
                            <span className="font-bold capitalize">{orderData.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Estimated Delivery:</span>
                            <span className="font-bold">
                                {orderData.shippingMethod === 'standard' ? '5-7 days' :
                                    orderData.shippingMethod === 'express' ? '2-3 days' : '1 day'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                        <FaEnvelope className="mr-2" />
                        <span>Confirmation email sent</span>
                    </div>
                    <div className="flex items-center">
                        <FaTruck className="mr-2" />
                        <span>Tracking info will follow</span>
                    </div>
                </div>

                <div className="flex space-x-4 justify-center">
                    <button
                        onClick={() => window.location.href = '/orders'}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        View Order Details
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-200 to-indigo-400 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Complete Your Order
                    </h1>
                    <p className="text-white/80">Fast and secure checkout process</p>
                </div>

                {!orderPlaced && <StepIndicator />}

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    {currentStep === 1 && <ShippingStep />}
                    {currentStep === 2 && <PaymentStep />}
                    {currentStep === 3 && <ReviewStep />}
                    {currentStep === 4 && <OrderSuccess />}
                </div>
            </div>
        </div>
    );
};

export default OrderPlacementFlow;