import express from 'express'
import { deleteUser, getAllUser, getUser, updateUser } from '../controllers/user.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verification.js';

const router = express.Router();

//update
router.put('/:id',verifyToken, verifyUser ,updateUser)

//delete
router.delete('/:id',verifyToken, verifyUser, deleteUser)

//get
router.get('/:id',verifyToken, verifyUser ,getUser)

//get all
router.get('/',verifyToken,verifyAdmin, getAllUser)

export default router;