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
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('design', DesignSchema)