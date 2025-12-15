import jwt from "jsonwebtoken";
import createError from "./error.js";

export const verifyToken = (req, res, next) => {
  console.log("entered verify token");

  if (!req.cookies) {
    return next(createError(401, "Cookies not found"));
  }

  const token = req.cookies.access_token;

  if (!token) {
    return next(createError(402, "Not Authorized"));
  }

  jwt.verify(token, process.env.JWTKEY, (err, user) => {
    if (err) {
      return next(createError(403, "Invalid Token"));
    }

    req.user = user;
    next();
  });
};



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