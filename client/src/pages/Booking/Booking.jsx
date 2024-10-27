import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/navbar';
import './Booking.css'
import { useDispatch, useSelector } from 'react-redux';
import BookingCard from '../../components/bookingcard/bookingcard';
import { notification } from '../../utils/notification';
import axios from 'axios';
import { bookingCancelled } from '../../redux/authReducer/authReducer';
import { convertUTCtoIST, getDatesBetween, normalizeDate } from '../../utils/functions';


export default function Booking() {

    const user = useSelector(state => state.auth.user)

    const [booking, setBooking] = useState([])
    const [selectedBooking, setSelectedBooking] = useState([])
    const dispatch = useDispatch();

    useEffect(()=>{
        setBooking(user.bookingDetails);
    },[user])
    useEffect(()=>{
        console.log(selectedBooking);;
    },[selectedBooking])

    const handleBookingCancelButton = async() => {
        if (selectedBooking.length <= 0){
            notification('Booking','Please select a Booking','warning')
        }
        else{
            try {
                const existingBookings = user.bookingDetails

                const removableBookings = existingBookings.filter(booking => selectedBooking.includes(booking._id))
                    
                    for (const booking of removableBookings){
                        const removableDates = getDatesBetween(booking.checkin, booking.checkout);
                        const rooms = booking.roomNumber;
    
                        for (const room of rooms){
                            const res = await axios.get(`/rooms/${room.roomId}`)
                            const currRoom = res.data
                            const roomToUpdate = currRoom.roomNumber.find(r=> r.Number == room.roomNumber)
                            if(roomToUpdate){
                                roomToUpdate.unavailableDate = roomToUpdate.unavailableDate.map((date)=> normalizeDate(convertUTCtoIST(date)).toDateString())
                                let removableDatess = removableDates.map((date)=> (normalizeDate(convertUTCtoIST(date)).toDateString()))
                                roomToUpdate.unavailableDate = roomToUpdate.unavailableDate.filter(date => !removableDatess.includes(date))
                            }
                            const resp = await axios.put(`/rooms/${room.roomId}`,
                                currRoom
                            )
                            console.log(resp);
    
                        }

                    }

                user.bookinDetails = existingBookings.filter(booking => !selectedBooking.includes(booking._id))
                const resp = await axios.put(`/users/${user._id}`,{
                    bookingDetails: user.bookinDetails
                })
                dispatch(bookingCancelled(user.bookinDetails))


                
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleSelectedBooking = (booking_id, selected) =>{
        if (selected){
            setSelectedBooking([...selectedBooking, booking_id])
        }
        else{
            setSelectedBooking(selectedBooking.filter((bookingId)=> bookingId != booking_id))
        }
    }

    


    return (
    <>
        <Navbar type='Login'/>
        <div className="booking">
        <div className="bookingContainer">
            <div className="bookingHeader">My Bookings</div>
            <div className="bookingItems">
                {
                    booking!=undefined && booking.length > 0?
                    
                        booking.map((bookitem, index)=>
                            <BookingCard data={bookitem} handleSelectedBooking={(booking_id, selected)=>{handleSelectedBooking(booking_id, selected)}}/> 
                        )
                     
                    : 
                    'No Bookings Found'
                }
            </div>
            <div className='bookingCancelButton' 
            style={{
                display: (booking !== undefined && booking.length > 0) ? 'initial' : 'none'
            }} 
                onClick={()=>{handleBookingCancelButton()}}>  {`Cancel Selected Bookings`}
            </div>        
        </div>
    </div>
    </>
)}
