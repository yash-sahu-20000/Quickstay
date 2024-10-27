import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    distance:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    photos:{
        type: [String]
    },
    description:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        min: 0,
        max: 5
    },
    rooms:{
        type: [mongoose.Schema.ObjectId],
        ref: 'Room'
    },
    featured:{
        type: Boolean,
        default: false
    },
    cheapestPrice:{
        type: Number,
        default: 0
    }
});

export default mongoose.model('Hotel',HotelSchema);