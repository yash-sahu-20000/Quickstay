import React, { useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import './bookingcard.css'
import { convertUTCtoIST, normalizeDate } from '../../utils/functions'
import { baseUrl } from '../../config'

export default function BookingCard(props) {
  
    const [hotelName, setHotelName] = useState(null)
    const [selected, setSelected] = useState(false)

    const bookitem = props.data
    const {response: hotel, loading: hotelLoading, hotelerror} = useFetch(`/hotels/find/${bookitem.hotel}`)
    
    
    
    useEffect(()=>{
        if(hotel!=null && hotel.data.name != null){
            setHotelName(hotel.data.name) 
        }
    },[hotel])

    const handleCheckbox = (bookingId, selected) => {
        const val = !selected
        setSelected(val)
        props.handleSelectedBooking(bookingId, val)
    } 
    return (
        <div className='bookingBox' onClick={() => handleCheckbox(bookitem._id, selected)}>
            <div className="leftContainer">

                {
                    hotelName != null ?
                    <div className="hotelName">{hotelName}</div>:
                    <div className="hotelName">Loading hotel name</div> 
                }
                
                <div className="bookingRoomNumbers">
                    Rooms:
                    {
                        bookitem.roomNumber.map((room, index)=>
                            <div className="bookingRoomNumber">
                                {room.roomNumber}
                            </div>
                        )
                    }

                </div>       
                {console.log(bookitem)}
                <div className="checkin">{`Check-in: ${(normalizeDate(convertUTCtoIST(bookitem.checkin )).toDateString())}`}</div>
                <div className="checkin">{`Check-out: ${(normalizeDate(convertUTCtoIST(bookitem.checkout )).toDateString())}`}</div>
                <div className="checkin">{`Price: ₹${bookitem.price}`}</div>
                <div className="checkin">{`Person: ${bookitem.person}`}</div>
                <div className="bookingId">Booking ID: {bookitem._id} </div>                             
            </div>
            <div className="rightContainer">
            <input
                type="checkbox"
                className="roomNumberCheckBoxInput"
                checked={selected}
                onChange={() => handleCheckbox(bookitem._id, selected)}
            />
            </div>
            
        </div>
  )
}
