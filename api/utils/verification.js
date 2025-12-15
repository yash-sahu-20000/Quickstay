import jwt from "jsonwebtoken";
import createError from "./error.js";

export const verifyToken = (req, res, next) => {
    console.log('entered verify token')
    // const cookie = req.headers.cookie
    // console.log("cookie : "+cookie)

    if (!cookie){
        return next(createError(404, 'Not Authorized'))
    }
    
    const token = req.cookies.access_token;
    jwt.verify(token, process.env.JWTKEY, (err, userObtained)=>{
        if (err){
            return next(createError(400, 'Invalid Token'))
        }
        else{
            req.user = userObtained
            next()
        }
    })
}


export const verifyUser = (req, res, next)=>{
    console.log('entered verify user')
    if (req.params.id == req.user.id || req.user.isAdmin){
        next()
    }
    else{
        return next(createError(404, 'You are not original User')) 
    }
}

export const verifyAdmin = (req, res, next)=>{
    console.log('entered verify admin')
    if (req.user.isAdmin){
        next()
    }
    else{
        return next(createError(404, 'You are not Admin')) 
    }
}