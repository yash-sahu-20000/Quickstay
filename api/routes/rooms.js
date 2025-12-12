import express from 'express'
import { createRoom, deleteRoom, getAllRoom, getRoom, updateRoom } from '../controllers/room.js';
import { verifyAdmin, verifyToken } from '../utils/verification.js';
const router = express.Router();

//create
router.post('/:hotelId', verifyToken, verifyAdmin ,createRoom)

//update
router.put('/:id',verifyToken, updateRoom)

//delete
router.delete('/:id/:hotelId', verifyToken, verifyAdmin,deleteRoom)

//get
router.get('/:id', getRoom)

//get all
router.get('/', getAllRoom)


export default router;