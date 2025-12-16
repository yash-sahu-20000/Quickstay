import Hotel from '../models/Hotel.js'
import createError from '../utils/error.js';

export const createHotel = async (req, res, next)=>{
    try {
        const newHotel = new Hotel(req.body)
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    } catch (error) {
        return next(createError(500, 'Not Created!'))
    }
}
export const updateHotel = async (req, res, next)=>{
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id, 
            { $set : req.body},
            { new: true}
        );
        res.status(200).json(updatedHotel)
    } catch (error) {
        return next(createError(500, 'Not Updated!'))
    }
}
export const deleteHotel = async (req, res, next)=>{
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(
            req.params.id
        );
        res.status(200).json('Hotel deleted')
    } catch (error) {
        return next(createError(500, 'Not Deleted!'))
    }
}
export const getHotel = async (req, res, next)=>{
    try {
        const hotel = await Hotel.findById(
            req.params.id
        );
        res.status(200).json(hotel)
    } catch (error) {
        return next(createError(500, 'No Hotel Found!'))
    }
}

export const getAllHotel = async (req, res, next)=>{

    const {min = 0, max = 10000, ...otherFilter} = req.query
    try {
        const allHotels = await Hotel.find({
            ...otherFilter,
            cheapestPrice : { $gte: Number(min) , $lte: Number(max)}
        });
        res.status(200).json(allHotels)
    } catch (error) {
        return next(createError(500, 'No Hotels Found!'))
    }
}
export const getCountCities = async (req, res, next)=>{
    try {
        const cities = req.query.cities.split(',');
        const list = []
        for (const city of cities) {
            const count = await Hotel.countDocuments({city: city})
            list.push({[city]: count})
            console.log([city], count)
        };
        res.status(200).json(list)
        
    } catch (error) {
        return next(createError(500, 'No Hotels Found!'))
    }
}
export const getCountType = async (req, res, next)=>{
    try {
        const types = req.query.types.split(',');
        const list = []
        for (const type of types) {
            const count = await Hotel.countDocuments({type: type})
            list.push({[type]: count})
            console.log([type], count)
        };
        res.status(200).json(list)
        
    } catch (error) {
        return next(createError(500, 'No Hotels Found!'))
    }
}



export const postall = async (req, res, next) => {
  try {

    const hotels = await Hotel.insertMany(req.body)

    return res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    })
  } catch (error) {
    return next(createError(500, 'unable to post hotels'))
  }
}


export const getAllCityNames = async (req, res, next) => {
    try {
        const response = await Hotel.distinct('city')
        res.status(200).json(response)
    } catch (error) {
        return next(createError(500, 'Unable to find disticnt cities'))
    }
}