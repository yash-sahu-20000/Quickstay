import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import authroute from './routes/auth.js';
import hotelsroute from './routes/hotels.js';
import roomsroute from './routes/rooms.js';
import usersroute from './routes/users.js';

const app = express();

dotenv.config();

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log('Connected to DB');
    } catch (error) {
        throw error;
    }
}




app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
app.use(express.json({ limit: '10mb' }));


app.use('/auth', authroute);
app.use('/users', usersroute);
app.use('/hotels', hotelsroute);
app.use('/rooms', roomsroute);

app.use((err, req, res, next) => {
    const errStatus = err.status || 500;
    const errMessage = err.message || 'Something went wrong';
    return res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack: err.stack
    });
});

app.listen(1001, () => {
    connectdb();
    console.log('Backend connected!');
});
