const user = require('../models/user.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

exports.createNewUser = async (req, res) => {
    try {
        let { userName, email, password } = req.body;

        let checkExistUser = await user.findOne({ email });

        if (checkExistUser) {
            return res
                .status(409)
                .json({ status: 409, message: "User Already Exist..." });
        }

        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(password, salt);

        checkExistUser = await user.create({
            userName,
            email,
            password: hashPassword,
        });
        let token = await jwt.sign(
            { _id: checkExistUser._id },
            process.env.SECRET_KEY,
            { expiresIn: "1D" }
        );
        return res.status(201).json({
            status: 201,
            message: "User Created SuccessFully...",
            user: checkExistUser,
            token: token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        let page = parseInt(req.query.page);
        let pageSize = parseInt(req.query.pageSize);

        if (page < 1 || pageSize < 1) {
            return res.status(401).json({
                status: 401,
                message: "Page And PageSize Cann't Be Less Than 1",
            });
        }

        let paginatedUser;

        paginatedUser = await user.find();

        let count = paginatedUser.length;

        if (count === 0) {
            return res.status(404).json({ status: 404, message: "User Not Found" });
        }

        if (page && pageSize) {
            let startIndex = (page - 1) * pageSize;
            let lastIndex = startIndex + pageSize;
            paginatedUser = await paginatedUser.slice(startIndex, lastIndex);
        }

        return res.status(200).json({
            status: 200,
            totalUsers: count,
            message: "All Users Found SuccessFully...",
            user: paginatedUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const users = await user.findById(req.params.id);
        if (!users) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: "User found successfully",
                users,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        // Include the photo field in the update
        if (req.file) {
            req.body.photo = req.file.path
        }
        const updatedUser = await user.findByIdAndUpdate(
            req.params.id,
            { ...req.body, photo: req.body.photo ? req.body.photo : undefined }, // Ensure photo is included if provided
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

exports.removeUser = async (req, res) => {
    try {
        let id = req.params.id

        let removeUser = await user.findById(id);

        if (!removeUser) {
            return res.json({ status: 400, message: "User Not Found" })
        }

        await user.findByIdAndDelete(id);

        return res.json({ status: 200, message: "User Deleted SuccessFully" })

    } catch (error) {
        res.json({ status: 500, message: error.message });
        console.log(error);
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        const users = await user.findOne({ email });
        if (!users) {
            return res.status(400).json({ message: "User Not Found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, users.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        users.password = await bcrypt.hash(newPassword, salt);
        await users.save();

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};

exports.addToWishlist = async (req, res) => {
    const { _id } = req.user;
    const { designId } = req.body;
    try {
        // console.log(prodId);
        const userdata = await user.findById(_id);
        const alreadyadded = userdata.wishlist.find((id) => id.toString() === designId);
        if (alreadyadded) {
            let userdata = await user.findByIdAndUpdate(_id, {
                $pull: { wishlist: designId },
            }, { new: true });
            res.status(200).json({
                status: 200,
                message: "Remove SuccessFully...",
                user: userdata,
            });
        } else {
            let userdata = await user.findByIdAndUpdate(_id, {
                $push: { wishlist: designId },
            }, { new: true });
            res.status(200).json({
                status: 200,
                message: "Added SuccessFully...",
                user: userdata,
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};

exports.getWishList = async (req, res) => {
    const { _id } = req.user;
    try {
        const findUser = await user.findById(_id).populate('wishlist');
        // res.json(findUser);
        return res.status(200).json({
            status: 200,
            user: findUser,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};
