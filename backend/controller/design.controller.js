const design = require('../models/Design.models');
const Cart = require('../models/cart.models');
const mongoose = require('mongoose');

exports.createDesign = async (req, res) => {
    try {
        let { userId, title, description, price } = req.body

        // let checkDesignNameIsExist = await design.findOne({ DesignName })

        // if (checkDesignNameIsExist) {
        //     return res.status(409).json({ status: 409, success: false, message: "DesignName already exist" })
        // }

        if (!req.files) {
            return res.status(403).json({ status: 403, success: false, message: "Image Filed Is required" })
        }
        const images = req.files
        let checkDesignNameIsExist = await design.create({
            userId,
            title,
            description,
            price,
            images: images.map(file => file.path)
        })

        return res.status(200).json({ status: 201, success: true, message: "Design Create successFully....", Design: checkDesignNameIsExist })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, success: false, message: error.message })
    }
}

exports.getAlldesign = async (req, res) => {
    try {
        let paginateddesign = await design.find();

        let count = paginateddesign.length;

        return res.json({ status: 200, TotalDesign: count, message: 'All Design Found Successfully..', Design: paginateddesign })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

// exports.getdesignById = async (req, res) => {
//     try {
//         const designbyId = await design.findById(req.params.id);
//         if (!designbyId) {
//             return res.status(404).json({
//                 status: 404,
//                 message: "design not found",
//             });
//         } else {
//             return res.status(200).json({
//                 status: 200,
//                 message: "design found successfully",
//                 Design: designbyId,
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: 500,
//             message: error.message,
//         });
//     }
// };

exports.getdesignById = async (req, res) => {
    try {
        const designWithUser = await design.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
            },
            {
                $lookup: {
                    from: "users", // Make sure this matches your actual MongoDB collection name for users
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $unwind: {
                    path: "$userData"
                }
            }
        ]);

        if (!designWithUser || designWithUser.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "design not found",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "design found successfully",
            Design: designWithUser[0],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};


exports.deleteDesign = async (req, res) => {
    try {
        let id = req.params.id;

        let checkDesign = design.findById(id);

        if (!checkDesign) {
            return res.json({ status: 404, message: "Design Not Found" })
        }

        checkDesign = await design.findByIdAndDelete(id);

        return res.json({ status: 200, message: "Design Removed Successfully.." })
    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

// exports.updateDesign = async (req, res) => {
//     try {
//         let id = req.params.id;

//         let checkDesign = design.findById(id);

//         if (!checkDesign) {
//             return res.json({ status: 404, message: "Design Not Found" })
//         }

//         checkDesign = await design.findByIdAndUpdate(id, { ...req.body }, { new: true });

//         return res.json({ status: 200, message: "Design Updated Successfully..", Design: checkDesign })

//     } catch (error) {
//         res.json({ status: 500, message: error.message });
//         console.log(error);
//     }
// };

exports.updateDesign = async (req, res) => {
    try {
        const id = req.params.id;
        let updateDesignId = await design.findById(id);

        if (!updateDesignId) {
            return res.status(404).json({ status: 404, success: false, message: "Design Not Found" });
        }
        let imagesToKeep = [];
        if (req.body.existingImages) {
            try {
                imagesToKeep = JSON.parse(req.body.existingImages);
            } catch (error) {
                console.error("Error parsing existingImages:", error);
                return res.status(400).json({ status: 400, success: false, message: "Invalid image data format" });
            }
        }

        let newImages = [];
        if (req.files) {
            const files = req.files;
            newImages = files.map(file => file.path);
        }

        const combinedImages = [...imagesToKeep, ...newImages];

        // Build update object
        const updateData = {
            userId: req.body.userId,
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            images: combinedImages,
        };

        const updatedDesign = await design.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Design Updated Successfully",
            data: updatedDesign
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

exports.likeDesign = async (req, res) => {
    const { designId } = req.body;
    console.log(designId)
    const Design = await design.findById(designId)

    if (!Design) {
        return res.status(404).json({ status: 404, success: false, message: "Not allow for like this Design." });
    }
    const loginUserId = req?.user?._id;

    // const isLiked = Design?.isLiked
    const alreadyadded = Design.likes.includes(loginUserId);
    console.log(alreadyadded);


    if (alreadyadded) {
        const Design = await design.findByIdAndUpdate(designId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, { new: true });
        res.status(200).json({
            status: 200,
            message: "Remove SuccessFully...",
            Design: Design,
        });
    } else {
        const Design = await design.findByIdAndUpdate(designId, {
            $push: { likes: loginUserId },
            isLiked: true
        }, { new: true });
        res.status(200).json({
            status: 200,
            message: "Added SuccessFully...",
            Design: Design,
        });
    }
};

exports.addToCart = async (req, res) => {
    const { designId, quantity, price } = req.body;
    const { _id } = req.user;
    try {
        let newCart = await new Cart({
            userId: _id,
            designId,
            quantity,
            price
        }).save();
        res.status(200).json({
            status: 200,
            success: true,
            message: "Item added to cart",
            newCart
        });
    } catch (error) {
        throw new Error(error);
    }
};

exports.getCart = async (req, res) => {
    const { _id } = req.user;
    try {
        // const cart = await Cart.find({ userId: _id }).populate("designId");
        const cart = await Cart.aggregate([
            {
                $match: { userId: _id }
            },
            {
                $lookup: {
                    from: "designs", // This should match your design collection name
                    localField: "designId",
                    foreignField: "_id",
                    as: "designData"
                }
            },
            {
                $unwind: "$designData"
            }
        ]);
        // res.json(cart);
        res.status(200).json({
            status: 200,
            success: true,
            cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

exports.removedesignCart = async (req, res) => {
    const { _id } = req.user;
    const { cartItemId } = req.body;
    try {

        const deleteProdFromCart = await Cart.deleteOne({ userId: _id, _id: cartItemId })
        // res.json(deleteProdFromCart);
        res.status(200).json({
            status: 200,
            success: true,
            message: 'cart item delete',
            deleteProdFromCart
        });
    } catch (error) {
        throw new Error(error);
    }
};

exports.updateQuentityFromCart = async (req, res) => {
    const { _id } = req.user;
    const { cartItemId, newQuantity } = req.body;
    try {
        const cartItem = await Cart.findOne({ userId: _id, _id: cartItemId })
        cartItem.quantity = Math.max(1, cartItem.quantity + newQuantity);
        cartItem.save();
        res.status(200).json({
            status: 200,
            success: true,
            message: 'cart item update',
            cartItem
        });
    } catch (error) {
        throw new Error(error);
    }
};