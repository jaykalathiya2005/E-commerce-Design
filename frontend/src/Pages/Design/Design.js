import React, { useEffect, useState } from 'react'
import { deleteDesign, getAlldesign } from '../../Redux/Slice/design.slice';
import { useDispatch, useSelector } from 'react-redux';
import { IMAGE_URL } from '../../Utils/baseUrl';
import { MdDelete, MdDeleteForever, MdEdit } from 'react-icons/md';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Design = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [currentPageDesign, setCurrentPageDesign] = useState(1);
    const [designsPerPage] = useState(10);
    const userId = sessionStorage.getItem('userId');
    const alldesign = useSelector((state) => state.design.allDesign).filter((design) => design.userId == userId);
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [DeleteDesign, setDeleteDesign] = useState(null);

    useEffect(() => {
        dispatch(getAlldesign())
    }, [])

    // Pagination logic of design
    const indexOfLastDesign = currentPageDesign * designsPerPage;
    const indexOfFirstDesign = indexOfLastDesign - designsPerPage;
    const currentDesigns = alldesign.slice(indexOfFirstDesign, indexOfLastDesign);
    const totalDesignPages = Math.ceil(alldesign.length / designsPerPage);

    const paginateDesign = (pageNumber) => setCurrentPageDesign(pageNumber);

    const handleEdit = (design) => {
        navigate('/add-design', { state: design });
    }

    const handleShowDelete = (id) => {
        setDeleteDesign(id);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        if (DeleteDesign) {
            dispatch(deleteDesign(DeleteDesign));
            setDeleteModal(false);
            setDeleteDesign(null);
        }
    };

    const cancelDelete = () => {
        setDeleteModal(false);
        setDeleteDesign(null);
    };

    const DeleteModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    {/* Modal Header */}
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-red-100 p-3 rounded-full">
                            <MdDeleteForever className="w-6 h-6 text-red-600" />
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Delete Design ?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this design ?
                        </p>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={cancelDelete}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="flex-1 px-4 py-2 text-white bg-primary-dark hover:bg-primary-dark/90 rounded-lg font-medium transition-colors"
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleAddDesign = () => {
        navigate('/add-design')
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                {/* <div className="flex justify-between items-center mb-6 gap-4"> */}
                <h1 className="text-xl md:text-2xl font-semibold text-primary-dark">
                    Manage Your Design
                </h1>
                <button
                    onClick={handleAddDesign}
                    className="px-4 py-2 bg-primary-dark/60 text-black rounded-lg hover:bg-primary-dark/70 transition-all duration-300 font-medium"
                >
                    Add Design
                </button>
            </div>

            {/* Design Table - Desktop */}
            {/* <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden"> */}
            <div className="bg-transparent rounded-lg shadow-sm relative overflow-x-auto scrollbar-hide">
                {/* <table className="w-full">   */}
                <table className="w-full min-w-[900px]">
                    <thead className="bg-primary-dark/60 text-black">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-sm lg:text-base">Image</th>
                            <th className="px-4 py-2 text-left font-medium text-sm lg:text-base">Title</th>
                            <th className="px-4 py-2 text-left font-medium text-sm lg:text-base">Description</th>
                            <th className="px-4 py-2 text-left font-medium text-sm lg:text-base">Price</th>
                            <th className="px-4 py-2 text-left font-medium text-sm lg:text-base">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-dark">
                        {currentDesigns.map((design, index) => (
                            <tr key={index} className="bg-primary-dark/10 text-black">
                                <td className="px-4 py-2">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <img src={`${IMAGE_URL}${design?.images?.[0]}`} alt={design.title} className='h-12' />
                                    </div>
                                </td>
                                <td className="px-4 py-2 font-medium text-sm lg:text-base">
                                    {design.title}
                                </td>
                                <td className="px-4 py-2 text-sm lg:text-base">
                                    {design.description}
                                </td>
                                <td className="px-4 py-2 text-sm lg:text-base">
                                    ₹{design.price}
                                </td>
                                <td>
                                    <div className="text-sm lg:text-base">
                                        <button className="text-black bg-primary-dark/50 p-2 rounded-md" onClick={() => handleEdit(design)}>
                                            <MdEdit />
                                        </button>
                                        <button className="text-red-500 bg-primary-dark/50 p-2 rounded-md ml-2" onClick={() => { handleShowDelete(design._id) }}>
                                            <MdDelete />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 gap-4">
                <div className="text-sm text-primary-dark font-medium text-center sm:text-left">
                    Showing {indexOfFirstDesign + 1} to {Math.min(indexOfLastDesign, alldesign.length)} of {alldesign.length} entries
                </div>

                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <button
                        onClick={() => paginateDesign(currentPageDesign - 1)}
                        disabled={currentPageDesign === 1}
                        className="p-2 rounded-lg border border-primary-dark hover:bg-primary-dark/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-primary-dark" />
                    </button>

                    {[...Array(Math.min(totalDesignPages, 3))].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => paginateDesign(index + 1)}
                            className={`px-3 py-2 rounded-lg text-sm ${currentPageDesign === index + 1
                                ? 'bg-primary-dark/60 text-white border border-primary-dark'
                                : 'border border-primary-dark/60 hover:bg-primary-dark/70 text-primary-dark hover:text-white transition-all duration-300'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    {totalDesignPages > 3 && (
                        <>
                            <span className="px-1 text-sm">...</span>
                            <button
                                onClick={() => paginateDesign(totalDesignPages)}
                                className={`px-3 py-2 rounded-lg text-sm ${currentPageDesign === totalDesignPages
                                    ? 'bg-primary-dark/60 text-white border border-primary-dark'
                                    : 'border border-primary-dark/60 hover:bg-primary-dark/70 text-primary-dark hover:text-white transition-all duration-300'
                                    }`}
                            >
                                {totalDesignPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => paginateDesign(currentPageDesign + 1)}
                        disabled={currentPageDesign === totalDesignPages}
                        className="p-2 rounded-lg border border-primary-dark hover:bg-primary-dark/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaChevronRight className="w-3 h-3 md:w-4 md:h-4 text-primary-dark" />
                    </button>
                </div>
            </div>


            {showDeleteModal && <DeleteModal />}
        </div>
    )
}

export default Design