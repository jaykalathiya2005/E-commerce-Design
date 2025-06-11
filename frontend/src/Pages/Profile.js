import React from 'react';
import { FaChevronDown } from 'react-icons/fa';


const Profile = () => {

    return (
        <div className="">
            {/* Header */}
            <div className="mb-3 md:mb-8">
                <h1 className="text-xl md:text-2xl font-semibold text-primary-dark mb-2">
                    Edit Your Profile
                </h1>
                <p className="text-sm md:text-base text-gray-600 ">
                    {/* max-w-4xl */}
                    From your My Account Dashboard you have the ability to view a snapshot of your recent account activity and update your account information. Select a link below to view or edit information.
                </p>
            </div>

            {/* Profile Form */}
            <div className="bg-primary/50 rounded-lg shadow-sm p-4 md:p-8">
                <form className="space-y-4 md:space-y-6">
                    {/* First Name and Last Name */}
                    <div>
                        <input
                            type="text"
                            placeholder="Enter Your First Name"
                            className="w-full px-3 md:px-4 py-2 md:py-3 bg-primary-dark/60 text-white placeholder:text-white rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-sm md:text-base"
                        />
                    </div>

                    {/* Contact Number and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <input
                                type="tel"
                                placeholder="Enter Your Contact Number"
                                className="w-full px-3 md:px-4 py-2 md:py-3 bg-primary-dark/60 text-white placeholder:text-white rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-sm md:text-base"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Enter Your Email Address"
                                className="w-full px-3 md:px-4 py-2 md:py-3 bg-primary-dark/60 text-white placeholder:text-white rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all text-sm md:text-base"
                            />
                        </div>
                    </div>

                    {/* City and State */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="relative">
                            <select className="w-full px-3 md:px-4 py-2 md:py-3 bg-primary-dark/60 text-white placeholder:text-white rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all appearance-none text-sm md:text-base">
                                <option>City</option>
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-primary-dark" />
                        </div>
                        <div className="relative">
                            <select className="w-full px-3 md:px-4 py-2 md:py-3 bg-primary-dark/60 text-white placeholder:text-white rounded-lg focus:ring-2 focus:ring-primary-dark focus:border-transparent outline-none transition-all appearance-none text-sm md:text-base">
                                <option>State</option>
                            </select>
                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-primary-dark" />
                        </div>
                    </div>

                    {/* Zip Code and Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-primary-dark" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                        <button
                            // onClick={() => handleSectionChange('dashboard')}
                            type="submit"
                            className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-primary-dark text-white rounded-full hover:bg-primary-dark/90 transition-colors font-medium text-sm md:text-base"
                        >
                            Update Profile
                        </button>
                        <button
                            type="button"
                            // onClick={() => handleSectionChange('dashboard')}
                            className="w-full sm:w-auto px-6 md:px-8 py-2 md:py-3 bg-primary-dark/50 text-white rounded-full hover:bg-primary-dark/60 transition-colors font-medium text-sm md:text-base"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;