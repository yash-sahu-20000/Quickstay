import createError from '../utils/error.js'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const registerUser = async (req, res, next) => {
    
    try {
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)

        const newUser = new User({
            username :  req.body.username,
            email    :  req.body.email,
            password :  hashedPassword
        });
        const registeredUser = await newUser.save();
        res.status(200).json(
            'User registered.'
        )

    } catch (error) {
        next(createError(500, 'User not registered'))
    }

}

export const login = async (req, res, next) => {
    
    try {

        const user = await User.findOne({username: req.body.username})
        if (!user){
            return next(createError(404, 'User not Found.'))
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if(!isPasswordCorrect){
            return next(createError(400, 'Wrong username or password'))
        }

        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWTKEY)

        const {password, isAdmin, ...otherDetails} = user._doc;
        res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "none", 
        maxAge: 24 * 60 * 60 * 1000 
      })
      .status(200)
      .json(otherDetails);

    } catch (error) {
        return next(createError(500, 'User not registered'))
    }

}

export const registerAdmin = async(req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)

        const newUser = new User({
            username :  req.body.username,
            email    :  req.body.email,
            password :  hashedPassword,
            isAdmin : true
        });
        const registeredAdmin = await newUser.save();
        res.status(200).json(
            'Admin registered.'
        )

    } catch (error) {
        next(createError(500, 'User not registered'))
    }
}