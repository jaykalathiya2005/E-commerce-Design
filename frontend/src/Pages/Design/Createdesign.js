import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { createDesign, editDesign, getdesignById } from '../../Redux/Slice/design.slice';
import { Formik, useFormik } from 'formik';
import { FaTimes, FaUpload } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { IMAGE_URL } from '../../Utils/baseUrl';

const Createdesign = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userId = sessionStorage.getItem('userId');
    const { state } = useLocation()

    const id = state?._id;

    const validationSchema = Yup.object({
        images: Yup.array()
            .test('fileType', 'Only image files are allowed', (files) => {
                if (!files) return true;
                return files.every(file => {
                    // If it's a string (existing image URL), allow it
                    if (typeof file === 'string') return true;
                    // If it's a File object (new upload), check the type
                    if (file instanceof File) return file.type?.startsWith('image/');
                    // For any other type, reject
                    return false;
                });
            }),
        title: Yup.string()
            .required('Title is required'),
        description: Yup.string()
            .required('Description is required'),
        price: Yup.string()
            .required('Price is required')
            .matches(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number')
            .test('positive', 'Price must be greater than 0', value => {
                if (!value) return true;
                return parseFloat(value) > 0;
            })
    });

    const formik = useFormik({
        initialValues: {
            userId: userId,
            images: [],
            title: '',
            description: '',
            price: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            if (id) {
                dispatch(editDesign({
                    _id: id,
                    userId: userId,
                    images: values.images,
                    title: values.title,
                    description: values.description,
                    price: values.price
                }))
            } else {
                dispatch(createDesign(values))
            }
            navigate('/design');
            resetForm();
        }
    })

    useEffect(() => {
        if (id) {
            setValues(state)
        }
    }, [id])

    const handleDeleteImage = (index) => {
        const updatedImages = values.images.filter((_, i) => i !== index);
        setFieldValue('images', updatedImages);
    };

    const handleFileInput = () => {
        document.getElementById('fileInput').click();
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFieldValue('images', [...values.images, ...files]);
    };

    const { handleSubmit, setFieldValue, handleChange, setValues, values, errors, touched } = formik

    return (
        <div>
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-semibold text-primary-dark mb-4">
                    {id ? 'Edit Your Design' : 'Create Your Design'}
                </h1>
            </div>


            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="mx-auto">
                    <div className="mx-auto rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-12 gap-4">
                            {values?.images?.map((img, index) => (
                                <div key={index} className="relative group col-span-1">
                                    <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                        <img
                                            src={(img instanceof File) ? URL.createObjectURL(img) : `${IMAGE_URL}${img}`}
                                            alt={`Design ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(index)}
                                            className="absolute top-2 right-2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Add Image Button */}
                            <div
                                className="aspect-square bg-primary-dark/60 rounded-lg border-2 border-dashed border-primary-dark hover:border-primary-dark transition-colors cursor-pointer flex flex-col items-center justify-center group hover:bg-bg-primary-dark/80"
                                onClick={handleFileInput}
                            >
                                <div className="flex flex-col items-center group-hover:text-bg-primary-dark/60 text-primary">
                                    <div className="bg-primary-dark rounded-full p-3 mb-2">
                                        <FaUpload size={20} />
                                    </div>
                                    <span className="text-sm font-medium">Add Image</span>
                                </div>
                            </div>
                        </div>

                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageChange}
                        />

                    </div>
                </div>
                {/* Images Error Message */}
                {errors.images && touched.images && (
                    <div className="mt-2 text-red-600 text-sm">
                        {errors.images}
                    </div>
                )}

                {/* Design Title and Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={values.title}
                            onChange={handleChange}
                            placeholder="Enter Your Design Title"
                            className={`w-full px-3 md:px-4 py-2 bg-primary-light text-white placeholder:text-white md:py-3 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-sm md:text-base ${errors.title && touched.title
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {errors.title && touched.title && (
                            <div className="mt-1 text-red-600 text-sm">
                                {errors.title}
                            </div>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            value={values.description}
                            onChange={handleChange}
                            placeholder="Enter Your Design Description"
                            className={`w-full px-3 md:px-4 py-2 md:py-3 bg-primary-light text-white placeholder:text-white rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-sm md:text-base ${errors.description && touched.description
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {errors.description && touched.description && (
                            <div className="mt-1 text-red-600 text-sm">
                                {errors.description}
                            </div>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            name="price"
                            id="price"
                            value={values.price}
                            onChange={handleChange}
                            placeholder="Enter Your Design price"
                            className={`w-full px-3 md:px-4 py-2 bg-primary-light text-white placeholder:text-white md:py-3 rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-sm md:text-base ${errors.price && touched.price
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {errors.price && touched.price && (
                            <div className="mt-1 text-red-600 text-sm">
                                {errors.price}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                    <button
                        type="button"
                        // onClick={() => handleSectionChange('createPost')}
                        className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-primary-dark/50 text-white rounded-full hover:bg-primary-dark/60 transition-colors font-medium text-sm md:text-base"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-primary-light/90 text-white rounded-full hover:bg-primary-light transition-colors font-medium text-sm md:text-base"
                    >
                        {id ? "update" : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Createdesign