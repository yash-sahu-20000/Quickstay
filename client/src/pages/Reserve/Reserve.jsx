import React, { useEffect, useState } from 'react'
import './Reserve.css'
import Navbar from '../../components/navbar/navbar'
import Roomcard from '../../components/roomcard/roomcard'
import { useLocation, useNavigate } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import { useDispatch, useSelector } from 'react-redux'
import { bookingSuccess } from '../../redux/authReducer/authReducer'
import axios from 'axios'
import { Store } from 'react-notifications-component';
import { notification } from '../../utils/notification'
import { getDatesBetween } from '../../utils/functions'
import { baseUrl } from '../../config'



export default function Reserve() {

  const location = useLocation();
  const hotelId = location.state.hotelId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector( state => state.auth)
  const search = useSelector( state => state.search)

  const [rooms, setRooms] = useState(null);
  const [hotelName, setHotelName] = useState(null);
  const [price, setPrice] = useState(0);
  const [selectedRooms, setSelectedRooms] = useState([]);


  const {response: query_response, loading, error} = useFetch(`/hotels/find/${hotelId}`)

  useEffect(()=>{
    if (query_response && loading == false){
      setRooms(query_response.data.rooms)
      setHotelName(query_response.data.name)
    }
  },[query_response])


  const handleRoomSelection = (roomNumber, roomId, isSelected, roomPrice) => {
    if (isSelected) {
      setSelectedRooms((prev) => [...prev, {roomNumber, roomId}]);
      setPrice(price + roomPrice)
    } else {
      setSelectedRooms((prev) => prev.filter((room) => room.roomNumber !== roomNumber));
      setPrice(price - roomPrice)
    }
  };

  const handleReserveButton = async() => {
    if (selectedRooms.length > 0){
      if((search.persons.adult + search.persons.children) == 0){
        notification('Person',`Please add atleast one person/child ${error}`,'warning')
      }
      else{
        const bookingDetails = {
          hotel: hotelId,
          roomNumber: selectedRooms,
          checkin: search.date[0].startDate,
          checkout: search.date[0].endDate,
          price: price,
          person: search.persons.adults + search.persons.children
        };
  
        
        try {
          const res = await axios.put(`${baseUrl}/users/${auth.user._id}`,{
            bookingDetails: [
              ...auth.user.bookingDetails,
              bookingDetails
            ]
          },
          {
            withCredentials: true
          })
          const savedBookingDetails = res.data.bookingDetails;
          dispatch(bookingSuccess(savedBookingDetails))
        } catch (error) {
          notification('Fatal Error',`Please contact Administrator ${error}`,'danger')
        }
  
        try {
          const rooms = bookingDetails.roomNumber
          const unavaldate = getDatesBetween(bookingDetails.checkin, bookingDetails.checkout)
  
          for (const room of rooms) {
            const {roomNumber, roomId} =  room
            const curRoom = await axios.get(`${baseUrl}/rooms/${roomId}`)
            const roomToUpdate = curRoom.data.roomNumber.find(r => r.Number === roomNumber);
            let updatedUnavailableDates = []
            if (roomToUpdate) {
              updatedUnavailableDates = [
                ...roomToUpdate.unavailableDate,
                ...unavaldate 
              ];
            }
              roomToUpdate.unavailableDate = updatedUnavailableDates;
              const r = await axios.put(`${baseUrl}/rooms/${roomId}`, {
                ...curRoom.data
              },
              {
                withCredentials: true
              })
          }
        navigate('/')
  
        } catch (error) {
          notification('Fatal Error',`Please contact Administrator ${error}`,'danger')
        }
      }
    }
    else{
      notification('Room','Please select a room','warning')
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred!</div>;


  return (
    <>
    <Navbar type='Login'/>
    <div className="reserve">
        <div className="reserveContainer">
            <div className="reserveHeader">Availability</div>
            <div className="reserveHotelName">
              {
                hotelName == null ? 'Loading Hotel Name...' : hotelName
              }
            </div>
            <div className="reserveItems">
                {
                  rooms ? rooms.map((room, index)=> 
                  <Roomcard data={room} key={index} handleRoomSelection={(roomNumber, roomId, isSelected, roomPrice) => {handleRoomSelection(roomNumber, roomId, isSelected, roomPrice)}}/> )  :
                   'Loading..'
                }
            </div>
            <div className='reserveButton' onClick={()=>{handleReserveButton()}}>  {`Reserve ${price > 0 ? `for ₹${price}` : ''}`}
            </div>        
        </div>
    </div>
    </>
  )
}
