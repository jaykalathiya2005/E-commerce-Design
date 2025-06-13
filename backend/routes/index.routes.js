const express = require('express');
const indexRoutes = express.Router()
const upload = require("../helper/uplodes");
const { removeUser, updateUser, getUserById, getAllUsers, createNewUser, resetPassword, addToWishlist, getWishList } = require('../controller/user.controller');
const { userLogin, googleLogin, forgotPassword, verifyOtp, changePassword, userLogout } = require('../auth/auth');
const { createDesign, getAlldesign, getdesignById, deleteDesign, updateDesign, likeDesign, addToCart, getCart, removedesignCart, updateQuentityFromCart } = require('../controller/design.controller');
const { auth } = require('../middleware/auth');

// auth Routes

indexRoutes.post("/userLogin", userLogin);
indexRoutes.post('/logout/:id', userLogout);
indexRoutes.post("/google-login", googleLogin);
indexRoutes.post('/forgotPassword', forgotPassword)
indexRoutes.post('/verifyOtp', verifyOtp)
indexRoutes.post('/changePassword', changePassword)

// user Routes 

indexRoutes.post('/createUser', createNewUser);
indexRoutes.get('/allUsers', getAllUsers);
indexRoutes.get('/getUserById/:id', getUserById);
indexRoutes.put('/userUpdate/:id', upload.single("photo"), updateUser);
indexRoutes.delete('/deleteUser/:id', removeUser);
indexRoutes.put('/resetPassword', resetPassword);
indexRoutes.put('/wishlist', auth, addToWishlist);
indexRoutes.get('/getwishlist', auth, getWishList);

// design Routes

indexRoutes.post('/createDesign', upload.array("images"), createDesign);
indexRoutes.get('/alldesigns', getAlldesign)
indexRoutes.get('/getdesignById/:id', getdesignById);
indexRoutes.put('/updatedesign/:id', upload.array("images"), updateDesign);
indexRoutes.delete('/designdelete/:id', deleteDesign);
indexRoutes.put('/like', auth, likeDesign);
indexRoutes.put('/getlikes', auth, likeDesign);
indexRoutes.post("/cart", auth, addToCart);
indexRoutes.get("/cart", auth, getCart);
indexRoutes.post("/delete-design-cart", auth, removedesignCart);
indexRoutes.post("/update-design-cart", auth, updateQuentityFromCart);

module.exports = indexRoutes