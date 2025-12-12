import express from 'express'
import { createHotel, deleteHotel, getAllHotel, getCountCities, getCountType, getHotel, postall, updateHotel, getAllCityNames } from '../controllers/hotel.js';
import { verifyAdmin, verifyToken } from '../utils/verification.js';
const router = express.Router();

//create
router.post('/', verifyToken, verifyAdmin ,createHotel)

//update
router.put('/:id',verifyToken, verifyAdmin, updateHotel)

//delete
router.delete('/:id', verifyToken, verifyAdmin,deleteHotel)

//get
router.get('/find/:id', getHotel)

//get all
router.get('/', getAllHotel)

//get countByCity
router.get('/countByCities', getCountCities)

//get countByType
router.get('/countByType', getCountType)

router.get('/post', postall)

router.get('/getAllCityNames', getAllCityNames)

export default router;