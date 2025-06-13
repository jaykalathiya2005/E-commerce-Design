const mongoose = require('mongoose')

const CartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    designId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'design', // Assuming you have a Design model
        required: true,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number,
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('cart', CartSchema)