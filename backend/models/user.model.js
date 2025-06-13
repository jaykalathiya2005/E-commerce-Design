const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    otp: {
        type: Number,
    },
    photo: {
        type: String,
    },
    phone: {
        type: String,
    },
    dob: {
        type: Date,
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "design"
    }],
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('user', userSchema)