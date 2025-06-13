const mongoose = require('mongoose')

const DesignSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    images: [{
        type: String,
        required: true
    }],
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('design', DesignSchema)