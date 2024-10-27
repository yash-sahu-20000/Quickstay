import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    maxPerson:{
        type: Number,
        required: true
    },
    description:{
        type: String
    },
    roomNumber:{
        type: [
                {
                    Number: {type: Number} , 
                    unavailableDate:[{type: Date}]
                } 
            ],
        required: true
    }
},
{timestamps: true});


export default mongoose.model('Room',RoomSchema);