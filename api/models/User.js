import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    mobile:{
        type: String
    },
    password:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    bookingDetails:
        [
            {
                hotel :{ type: mongoose.Schema.ObjectId},
                roomNumber: [{roomNumber: {type: Number},
                              roomId: {type: mongoose.Schema.ObjectId}    
                            }],
                checkin: {type: Date},
                checkout: {type: Date},
                price: {type: Number},
                person: {type: Number}
            }
        ]
    
},
{timestamps: true});

export default mongoose.model('User',UserSchema);