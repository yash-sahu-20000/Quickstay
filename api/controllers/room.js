import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js'
import createError from '../utils/error.js';

export const createRoom = async (req, res, next)=>{
    try {

        const hotelId = req.params.hotelId
        const newRoom = new Room(req.body)
        

        const savedRoom = await newRoom.save();
        try {
            const updateHotel = await Hotel.findByIdAndUpdate(
                hotelId,
                {
                    $push: {
                        rooms: savedRoom._id
                    }
                },
                {
                    new: true
                }
            )
            const hotel = await Hotel.findById(
                hotelId
            )
            
            res.status(200).json({room:savedRoom, hotel: hotel.name});

        } catch (error) {
            return next(createError(500, 'Hotel not updated for the room.'))

        }

    } catch (error) {
        return next(createError(500, 'Not Created!'))
    }
}
export const updateRoom = async (req, res, next)=>{
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id, 
            { $set : req.body},
            { new: true}
        );
        res.status(200).json(updatedRoom)
    } catch (error) {
        return next(createError(500, 'Not Updated!'))
    }
}
export const deleteRoom = async (req, res, next)=>{
    const hotelId = req.params.hotelId
    const roomId = req.params.id
    try {
        try {
            const updateHotel = await Hotel.findByIdAndUpdate(
                hotelId,
                {
                    $pull: {
                        rooms: roomId
                    }
                },
                {
                    new: true
                }
            )
            
            const deletedRoom = await Room.findByIdAndDelete(
                roomId
            );

        } catch (error) {
            return next(createError(500, 'Hotel not updated for the room.'))

        }
        res.status(200).json('Room deleted')
    } catch (error) {
        return next(createError(500, 'Not Deleted!'))
    }
}
export const getRoom = async (req, res, next)=>{
    try {
        const room = await Room.findById(
            req.params.id
        );
        res.status(200).json(room)
    } catch (error) {
        return next(createError(500, 'No Room Found!'))
    }
}

export const getAllRoom = async (req, res, next)=>{

    try {
        const allRooms = await Room.find();
        res.status(200).json(allRooms)
    } catch (error) {
        return next(createError(500, 'No Rooms Found!'))
    }
}