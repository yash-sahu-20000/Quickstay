import express, { json } from 'express'
import { login, registerAdmin, registerUser } from '../controllers/auth.js';
import { verifyAdmin, verifyToken } from '../utils/verification.js';
const router = express.Router();

router.post('/register', registerUser)
router.post('/login', login)
router.post('/register/admin',verifyToken, verifyAdmin, registerAdmin)
router.get('/isAdmin', verifyToken, verifyAdmin, (req, res, next)=> res.status(200).json({'isAdmin': 'true'}))

export default router;