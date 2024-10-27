import User from "../models/User.js";
import createError from "../utils/error.js";


export const updateUser = async (req, res, next)=>{
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { $set : req.body},
            { new: true}
        );
        res.status(200).json(updatedUser)
    } catch (error) {
        return next(createError(500, 'Not Updated!'))
    }
}
export const deleteUser = async (req, res, next)=>{
    try {
        const deletedUser = await User.findByIdAndDelete(
            req.params.id
        );
        res.status(200).json('User deleted')
    } catch (error) {
        return next(createError(500, 'Not Deleted!'))
    }
}
export const getUser = async (req, res, next)=>{
    try {
        const user = await User.findById(
            req.params.id
        );
        res.status(200).json(user)
    } catch (error) {
        return next(createError(500, 'No User Found!'))
    }
}

export const getAllUser = async (req, res, next)=>{

    try {
        const allUsers = await User.find();
        res.status(200).json(allUsers)
    } catch (error) {
        return next(createError(500, 'No Users Found!'))
    }
}