import React, { useState } from 'react'
import { FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Order = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);

    // Sample order data
    const orders = [
        {
            id: '#4ce345c3e',
            image: '/api/placeholder/80/80',
            productName: 'Eau De Blue Perfume',
            price: '$40.00',
            status: 'Shipped',
            statusColor: 'text-blue-600'
        },
        {
            id: '#4ce3533e',
            image: '/api/placeholder/80/80',
            productName: 'Smooth Makeup Box',
            price: '$25.00',
            status: 'Pending',
            statusColor: 'text-red-600'
        },
        {
            id: '#8ce3533e',
            image: '/api/placeholder/80/80',
            productName: 'Modern Red Lipstick',
            price: '$32.00',
            status: 'Pending',
            statusColor: 'text-red-600'
        },
        {
            id: '#8ce3533e',
            image: '/api/placeholder/80/80',
            productName: 'New Botanical Shampoo',
            price: '$27.00',
            status: 'Shipped',
            statusColor: 'text-blue-600'
        },
        {
            id: '#9ce3533e',
            image: '/api/placeholder/80/80',
            productName: 'Premium Face Cream',
            price: '$45.00',
            status: 'Delivered',
            statusColor: 'text-green-600'
        },
        {
            id: '#1ce3533e',
            image: '/api/placeholder/80/80',
            productName: 'Organic Hair Oil',
            price: '$18.00',
            status: 'Processing',
            statusColor: 'text-yellow-600'
        }
    ];

    // Pagination logic of order
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalOrdersPages = Math.ceil(orders.length / ordersPerPage);

    const paginateorder = (pageNumber) => setCurrentPage(pageNumber);
    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8 gap-4">
                <h1 className="text-xl md:text-2xl font-semibold text-primary-dark">
                    My Order
                </h1>
            </div>

            {/* Orders Table - Desktop */}
            <div className="bg-transparent rounded-lg shadow-sm relative overflow-x-auto scrollbar-hide">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-primary-dark/60 text-black">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-sm lg:text-base">Image</th>
                            <th className="px-4 py-2 text-left font-medium text-sm lg:text-base">Order ID</th>
                            <th className="px-4 py-2 text-left font-medium text-sm lg:text-base">Product Details</th>
                            <th className="px-4 py-2 text-left font-medium text-sm lg:text-base">Price</th>
                            <th className="px-4 py-2 text-left font-medium text-sm lg:text-base">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-dark">
                        {currentOrders.map((order, index) => (
                            <tr key={index} className="bg-primary-dark/10 text-black">
                                <td className="px-4 py-2">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-600 rounded"></div>
                                    </div>
                                </td>
                                <td className="px-4 py-2 font-medium text-sm lg:text-base">
                                    {order.id}
                                </td>
                                <td className="px-4 py-2 text-sm lg:text-base">
                                    {order.productName}
                                </td>
                                <td className="px-4 py-2 font-medium text-sm lg:text-base">
                                    {order.price}
                                </td>
                                <td className="px-4 py-2">
                                    <span className={`font-medium text-sm lg:text-base ${order.statusColor}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Orders Cards - Mobile */}
            {/* <div className="md:hidden space-y-4">
                {currentOrders.map((order, index) => (
                    <div key={index} className="bg-primary-dark/10 rounded-lg shadow-sm p-4 border border-primary-dark">
                        <div className="flex items-start space-x-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <div className="w-12 h-12 bg-blue-600 rounded"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex justify-between items-start flex-wrap">
                                        <h3 className="text-sm font-medium text-primary-dark truncate pr-2">
                                            {order.productName}
                                        </h3>
                                        <span className={`text-sm font-medium ${order.statusColor} whitespace-nowrap`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium hover:text-white text-primary-dark">Order ID: {order.id}</p>
                                    <p className="text-xs hover:text-white text-primary">{order.price}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div> */}

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 gap-4">
                <div className="text-sm text-primary-dark font-medium text-center sm:text-left">
                    Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orders.length)} of {orders.length} entries
                </div>

                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <button
                        onClick={() => paginateorder(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-primary-dark hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-primary-dark" />
                    </button>

                    {[...Array(Math.min(totalOrdersPages, 3))].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => paginateorder(index + 1)}
                            className={`px-3 py-2 rounded-lg text-sm ${currentPage === index + 1
                                ? 'bg-primary-dark/60 text-white border border-primary-dark'
                                : 'border border-primary-dark/60 hover:bg-primary-dark/70 text-primary-dark hover:text-white transition-all duration-300'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    {totalOrdersPages > 3 && (
                        <>
                            <span className="px-1 text-sm">...</span>
                            <button
                                onClick={() => paginateorder(totalOrdersPages)}
                                className={`px-3 py-2 rounded-lg text-sm ${currentPage === totalOrdersPages
                                    ? 'bg-primary-dark/60 text-white border border-primary-dark'
                                    : 'border border-primary-dark/60 hover:bg-primary-dark/70 text-primary-dark hover:text-white transition-all duration-300'
                                    }`}
                            >
                                {totalOrdersPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => paginateorder(currentPage + 1)}
                        disabled={currentPage === totalOrdersPages}
                        className="p-2 rounded-lg border border-primary-dark hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaChevronRight className="w-3 h-3 md:w-4 md:h-4 text-primary-dark" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Order