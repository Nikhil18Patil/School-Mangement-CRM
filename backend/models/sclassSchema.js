const mongoose = require("mongoose");

const sclassSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    limit: {
        type: Number,
        required: true,
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher'
    }],
    fees: {
        type: Number,
        required: true,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher'
    }],
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
}, { timestamps: true });

module.exports = mongoose.model("class", sclassSchema);

