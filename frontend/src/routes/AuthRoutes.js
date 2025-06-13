import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '../Component/Layout'
import Dashboard from '../Pages/Dashboard'
import Profile from '../Pages/Profile'
import Order from '../Pages/Order'
import Design from '../Pages/Design/Design'
import Createdesign from '../Pages/Design/Createdesign'
import ProtectedRoute from './ProtectedRoute'
import Wishlist from '../Pages/Wishlist'

export default function AuthRoutes() {
    return (
        <div>
            <ProtectedRoute>
                <Layout>
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/Order" element={<Order />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/design" element={<Design />} />
                        <Route path="/add-design" element={<Createdesign />} />
                    </Routes>
                </Layout>
            </ProtectedRoute>
        </div>
    )
}
