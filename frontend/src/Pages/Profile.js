import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaTimes, FaUpload } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ImImages } from 'react-icons/im';
import { getUserById, updateUser } from '../Redux/Slice/user.slice';
import { IMAGE_URL } from '../Utils/baseUrl';

const Profile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const userId = sessionStorage.getItem('userId')
    const singleUser = useSelector((state) => state.user.currUser);

    useEffect(() => {
        dispatch(getUserById(userId))
    }, [userId])

    useEffect(() => {
        if (singleUser) {
            setValues({
                userName: singleUser.userName || '',
                email: singleUser.email || '',
                photo: singleUser.photo || '',
                phone: singleUser.phone || '',
                dob: singleUser.dob || ''
            });
        }
    }, [singleUser]);

    const validationSchema = Yup.object({
        userName: Yup.string()
            .required('Username is required'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        phone: Yup.string()
            .matches(/^[0-9]{10}$/g, 'Phone number must be 10 digits')
            .required('Phone number is required'),
        dob: Yup.date()
            .required('Date of birth is required'),
    });

    const formik = useFormik({
        initialValues: {
            userName: '',
            email: '',
            photo: '',
            phone: '',
            dob: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values);
            dispatch(updateUser({
                id: userId,
                values: values,
                file: selectedFile
            }));
        }
    })

    const { handleSubmit, setFieldValue, handleChange, setValues, values, errors, touched } = formik

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setFieldValue('photo', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            ?.map(word => word.charAt(0).toUpperCase())
            ?.join('')
            ?.slice(0, 2); // Take only first 2 initials
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setFieldValue('photo', 'null');
    };

    return (
        <div className="">
            {/* Header */}
            <div className="mb-3 md:mb-8">
                <h1 className="text-xl md:text-2xl font-semibold text-primary-dark mb-2">
                    Edit Your Profile
                </h1>
                <p className="text-sm md:text-base font-medium text-black">
                    {/* max-w-4xl */}
                    From your My Account Dashboard you have the ability to view a snapshot of your recent account activity and update your account information. Select a link below to view or edit information.
                </p>
            </div>

            {/* Profile Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-xl p-4">
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">

                    {/* Upload Image */}
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-400 to-orange-400 rounded-full bg-transparent shadow-2xl">
                                {previewUrl ? (
                                    <>
                                        <img
                                            src={previewUrl}
                                            alt="Profile Preview"
                                            className="cursor-pointer object-cover w-full h-full rounded-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage()}
                                            className="absolute h-6 w-6 top-1 right-0 bg-black/50 hover:bg-black/60 bg-opacity-70 hover:bg-opacity-90 text-primary rounded-full opacity-0 group-hover:opacity-100 p-1 transition-opacity flex items-center justify-center"
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                    </>
                                ) : singleUser?.photo && singleUser?.photo !== "null" ? (
                                    <>
                                        <img
                                            src={`${IMAGE_URL}${singleUser?.photo}`}
                                            alt="Profile"
                                            className="cursor-pointer object-cover w-full h-full rounded-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage()}
                                            className="absolute h-6 w-6 top-1 right-0 bg-black/50 hover:bg-black/60 bg-opacity-70 hover:bg-opacity-90 text-primary rounded-full opacity-0 group-hover:opacity-100 p-1 transition-opacity flex items-center justify-center"
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-black text-lg font-bold flex w-24 h-24 justify-center items-center">
                                        <span className="text-black font-bold text-3xl">
                                            {getInitials(singleUser?.userName)}
                                        </span>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    id="profileImageInput"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <div
                                    onClick={() => document.getElementById("profileImageInput").click()}
                                    className="cursor-pointer absolute bottom-0 right-0 z-50 dark:text-white text-white flex items-center justify-center bg-black/50 hover:bg-black/60 w-8 h-8 rounded-full transition-opacity duration-300"
                                >
                                    <svg
                                        width="17"
                                        height="17"
                                        viewBox="0 0 17 17"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clip-path="url(#clip0_62_16)">
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M12.8511 2.66699V5.33366C12.8511 5.46627 12.9038 5.59344 12.9975 5.68721C13.0913 5.78098 13.2185 5.83366 13.3511 5.83366C13.4837 5.83366 13.6109 5.78098 13.7046 5.68721C13.7984 5.59344 13.8511 5.46627 13.8511 5.33366V2.66699C13.8511 2.53438 13.7984 2.40721 13.7046 2.31344C13.6109 2.21967 13.4837 2.16699 13.3511 2.16699C13.2185 2.16699 13.0913 2.21967 12.9975 2.31344C12.9038 2.40721 12.8511 2.53438 12.8511 2.66699Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M12.0176 4.5H14.6842C14.8169 4.5 14.944 4.44732 15.0378 4.35355C15.1316 4.25979 15.1842 4.13261 15.1842 4C15.1842 3.86739 15.1316 3.74021 15.0378 3.64645C14.944 3.55268 14.8169 3.5 14.6842 3.5H12.0176C11.885 3.5 11.7578 3.55268 11.664 3.64645C11.5703 3.74021 11.5176 3.86739 11.5176 4C11.5176 4.13261 11.5703 4.25979 11.664 4.35355C11.7578 4.44732 11.885 4.5 12.0176 4.5Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M9.35107 2.5H6.09641C5.8798 2.50001 5.66747 2.56032 5.4832 2.67418C5.29893 2.78804 5.14999 2.95095 5.05307 3.14467L4.42174 4.408C4.40774 4.4356 4.38639 4.4588 4.36003 4.47504C4.33368 4.49127 4.30336 4.49991 4.27241 4.5H2.68441C2.19818 4.5 1.73186 4.69315 1.38805 5.03697C1.04423 5.38079 0.851074 5.8471 0.851074 6.33333V13C0.851074 13.486 1.04441 13.9527 1.38774 14.2967C1.73189 14.6401 2.19819 14.8331 2.68441 14.8333H13.3511C13.8371 14.8333 14.3037 14.64 14.6477 14.2967C14.9912 13.9525 15.1842 13.4862 15.1844 13V7.33333C15.1844 7.20073 15.1317 7.07355 15.038 6.97978C14.9442 6.88601 14.817 6.83333 14.6844 6.83333C14.5518 6.83333 14.4246 6.88601 14.3309 6.97978C14.2371 7.07355 14.1844 7.20073 14.1844 7.33333V13C14.1841 13.2209 14.0961 13.4327 13.9399 13.5889C13.7837 13.7451 13.572 13.833 13.3511 13.8333H2.68441C2.4635 13.833 2.25175 13.7451 2.09554 13.5889C1.93934 13.4327 1.85143 13.2209 1.85107 13V6.33333C1.85107 5.87333 2.22441 5.5 2.68441 5.5H4.27241C4.48902 5.49999 4.70135 5.43968 4.88562 5.32582C5.06989 5.21196 5.21882 5.04905 5.31574 4.85533L5.94707 3.592C5.96108 3.5644 5.98243 3.5412 6.00878 3.52496C6.03513 3.50873 6.06546 3.50009 6.09641 3.5H9.35107C9.48368 3.5 9.61086 3.44732 9.70463 3.35355C9.7984 3.25979 9.85107 3.13261 9.85107 3C9.85107 2.86739 9.7984 2.74021 9.70463 2.64645C9.61086 2.55268 9.48368 2.5 9.35107 2.5Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M8.01774 6.16699C6.26974 6.16699 4.85107 7.58566 4.85107 9.33366C4.85107 11.0817 6.26974 12.5003 8.01774 12.5003C9.76574 12.5003 11.1844 11.0817 11.1844 9.33366C11.1844 7.58566 9.76574 6.16699 8.01774 6.16699ZM8.01774 7.16699C8.58307 7.18102 9.12053 7.41545 9.51541 7.82025C9.91029 8.22505 10.1313 8.76815 10.1313 9.33366C10.1313 9.89916 9.91029 10.4423 9.51541 10.8471C9.12053 11.2519 8.58307 11.4863 8.01774 11.5003C7.45241 11.4863 6.91495 11.2519 6.52007 10.8471C6.12519 10.4423 5.90416 9.89916 5.90416 9.33366C5.90416 8.76815 6.12519 8.22505 6.52007 7.82025C6.91495 7.41545 7.45241 7.18102 8.01774 7.16699Z"
                                                fill="currentColor"
                                            />
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="profileImageInput"
                                onChange={handleImageUpload}
                            />
                            {errors.photo && touched.photo && (
                                <div className="mt-2 text-red-600 text-sm">
                                    {errors.photo}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Full Name and email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <input
                                type="text"
                                id='userName'
                                name='userName'
                                placeholder="Enter Your Full Name"
                                value={values?.userName}
                                onChange={handleChange}
                                className="w-full font-medium px-3 md:px-4 py-2 md:py-3 bg-primary-dark/60 text-black placeholder:text-black rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-sm md:text-base"
                            />
                            {errors.userName && touched.userName && (
                                <div className="mt-2 text-red-600 text-sm">
                                    {errors.userName}
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                type="email"
                                id='email'
                                name='email'
                                placeholder="Enter Your Email Address"
                                value={values?.email}
                                disabled
                                className="w-full font-medium px-3 md:px-4 py-2 md:py-3 bg-primary-dark/60 text-black placeholder:text-black rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-sm md:text-base"
                            />
                        </div>
                    </div>

                    {/* Contact Number and Date of Birth */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <input
                                type="tel"
                                id='phone'
                                name='phone'
                                placeholder="Enter Your Contact Number"
                                value={values?.phone}
                                onChange={handleChange}
                                className="w-full font-medium px-3 md:px-4 py-2 md:py-3 bg-primary-dark/60 text-black placeholder:text-black rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-sm md:text-base"
                            />
                            {errors.phone && touched.phone && (
                                <div className="mt-2 text-red-600 text-sm">
                                    {errors.phone}
                                </div>
                            )}
                        </div>
                        <div>
                            <input
                                type="date"
                                id='dob'
                                name='dob'
                                placeholder="Date of Birth"
                                value={values?.dob}
                                onChange={handleChange}
                                className="w-full font-medium px-3 md:px-4 py-2 md:py-3 bg-primary-dark/60 text-black placeholder:text-black rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-sm md:text-base [&::-webkit-calendar-picker-indicator]:filter"
                            />
                            {errors.dob && touched.dob && (
                                <div className="mt-2 text-red-600 text-sm">
                                    {errors.dob}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* City and State */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="relative">
                            <select className="w-full px-3 md:px-4 py-2 md:py-3 bg-primary-dark/60 text-white placeholder:text-white rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all appearance-none text-sm md:text-base">
                                <option>City</option>
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-primary-dark/50" />
                        </div>
                        <div className="relative">
                            <select className="w-full px-3 md:px-4 py-2 md:py-3 bg-primary-dark/60 text-white placeholder:text-white rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all appearance-none text-sm md:text-base">
                                <option>State</option>
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-primary-dark/60" />
                        </div>
                    </div> */}

                    {/* Zip Code and Country */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <input
                                type="text"
                                placeholder="Zip Code"
                                className="w-full px-3 md:px-4 py-2 md:py-3 bg-primary-dark/60 text-white placeholder:text-white rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-sm md:text-base"
                            />
                        </div>
                        <div className="relative">
                            <select className="w-full px-3 md:px-4 py-2 md:py-3 bg-primary-dark/60 text-white placeholder:text-white rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all appearance-none text-sm md:text-base">
                                <option>Country</option>
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-primary-dark/60" />
                        </div>
                    </div> */}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                        <button
                            type="button"
                            className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-primary-dark/50 text-black rounded-full hover:bg-primary-dark/60 transition-colors font-medium text-sm md:text-base"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-primary-dark/50 text-black rounded-full hover:bg-primary-dark/60 transition-colors font-medium text-sm md:text-base"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;