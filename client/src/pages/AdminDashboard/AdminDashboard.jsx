import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { logout } from '../../redux/authReducer/authReducer'
import { resetSearch } from '../../redux/searchReducer/searchReducer'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/navbar/navbar'
import './AdminDashboard.css'
import { notification } from '../../utils/notification'
import useFetch from '../../hooks/useFetch.jsx'
import { convertUTCtoIST, getDatesBetween, normalizeDate } from '../../utils/functions.js'
import Select from 'react-select'
import { baseUrl } from '../../config.js'


export default function AdminDashboard() {
  
    const user = useSelector(state => state.auth.user)
    const [isAdmin, setIsAdmin] = useState(false)
    const [selectedHotelImage, setSelectedHotelImage] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    useEffect(()=>{
        const fetchAdminStatus = async () => {
            try {
                const res = await axios.get(`${baseUrl}/auth/isAdmin`
                  ,{
                    withCredentials: true
                  }
                );
                if (res.status === 200) {
                    setIsAdmin(true);
                }
            } catch (error) {
                setIsAdmin(false);
                dispatch(logout());
                dispatch(resetSearch());
                localStorage.removeItem('user');
                navigate('/');
            }
        };
        fetchAdminStatus();
    },[])


    const [formDataHotel, setFormDataHotel] = useState({
        name: '',
        type: '',
        city: '',
        address: '',
        distance: '',
        title: '',
        photos: [],
        description: '',
        rating: 0,
        rooms: [],
        featured: false,
        cheapestPrice: 0,
    });
    const [formDataRoom, setFormDataRoom] = useState({
        title: '',
        price: 0,
        maxPerson: 0,
        description: '',
        roomNumber: []
    });
    const [formDataUser, setFormDataUser] = useState({
        username: '',
        email: '',
        mobile: '',
        password: '',
        isAdmin: false
    });
    const [formDataUserBooking, setFormDataUserBooking] = useState({
        hotel :'',
        roomNumber: [{roomNumber: '',
                      roomId: ''    
                    }],
        checkin: '',
        checkout: '',
        price: '',
        person: ''
    });
    const [formDataAdmin, setFormDataAdmin] = useState({
      username: '',
      email: '',
      mobile: '',
      password: '',
      isAdmin: true
  });

    const handleChangeHotel = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormDataHotel({ ...formDataHotel, [name]: checked });
        } else {
            setFormDataHotel({ ...formDataHotel, [name]: value });
        }
    };
    const handleChangeRoom = (e) => {
        const { name, value } = e.target;
        setFormDataRoom({ ...formDataRoom, [name]: value });
    };
    const handleChangeUser = (e) => {
      const { name, value, type, checked } = e.target;
      if (type === 'checkbox') {
          setFormDataUser({ ...formDataHotel, [name]: checked });
      } else {
          setFormDataUser({ ...formDataHotel, [name]: value });
      }
    };
    const handleChangeAdmin = (e) => {
      const { name, value, type, checked } = e.target;
      if (type === 'checkbox') {
          setFormDataAdmin({ ...formDataAdmin, [name]: checked });
      } else {
          setFormDataAdmin({ ...formDataAdmin, [name]: value });
      }
    };


    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + selectedHotelImage.length > 4) {
          notification('Image','You can upload a maximum of 6 images.','danger');
          return;
        }
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              setSelectedHotelImage((prevImages) => [...prevImages, reader.result]);
            };
            reader.readAsDataURL(file); 
          });
        console.log(files);
        }
    const handleClearImages = () => {
        setSelectedHotelImage([])
        notification('Photos','Photos cleared, please select again','warning')
    }
    
    useEffect(()=>{
        setFormDataHotel({...formDataHotel, photos: selectedHotelImage})
    },[selectedHotelImage])
    
    const [openMenuHotel, setOpenMenuHotel] = useState(false)
    const [openMenuRoom, setOpenMenuRoom] = useState(false)
    const [openMenuUser, setOpenMenuUser] = useState(false)
    const [openMenuBooking, setOpenMenuBooking] = useState(false)
    const [openMenuAdmin, setOpenMenuAdmin]= useState(false)
    const [operation, setOperation] = useState(null)
    const [allHotels, setAllHotels] = useState([])
    const [allRooms, setAllRooms] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [selectedHotelForUpdate, setSelectHotelForUpdate] = useState(null)
    const [selectedHotelForDelete, setSelectedHotelForDelete] = useState(null)
    const [tempRoom,setTempRoom] = useState(null)
    const [selectedRoomForUpdate,setSelectedRoomForUpdate] = useState(null)
    const [selectedRoomForDelete,setSelectedRoomForDelete] = useState(null)
    const [selectedUserForUpdate,setSelectedUserForUpdate] = useState(null)
    const [selectedUserForDelete,setSelectedUserForDelete] = useState(null)
    const [selectedUserForDeleteBooking,setSelectedUserForDeleteBooking] = useState(null)
    const [selectedBookingForDeleteBooking,setSelectedBookingForDeleteBooking] = useState(null)

    const query_response = useFetch('/hotels')
    useEffect(()=>{
        if (query_response.response != null){
            setAllHotels(query_response.response.data);
            console.log(query_response.response.data);
          }
    },[query_response.response?.data])
    const query_response_rooms = useFetch('/rooms')
    useEffect(()=>{
        if (query_response_rooms.response != null){
            setAllRooms(query_response_rooms.response.data);
            console.log(query_response_rooms.response.data);
          }
    },[query_response_rooms.response?.data])
    const query_response_users = useFetch('/users')
    useEffect(()=>{
      if (query_response_users.response != null){
          setAllUsers(query_response_users.response.data);
          console.log(query_response_users.response.data);
        }
  },[query_response_users.response?.data])


    const handleSubmitHotel = async (formDataHotel) => {
        if (['createhotel'].includes(operation)){

            try {
                const response = await axios.post(`${baseUrl}/hotels`, formDataHotel,{
                    withCredentials: true
                  });
                console.log('Hotel created:', response.data);
                if (response.status == '200'){
                    notification('Hotel','Hotel Creation Success','success')
                }
                query_response.reFetch();
                handleResetHotelInputs();
            } catch (error) {
                notification('Error',`${error}`,'danger')
                console.error('There was an error creating the hotel:', error);
            }
        }
        else if (['updatehotel'].includes(operation)){
            
            try {
                const response = await axios.put(`${baseUrl}/hotels/${selectedHotelForUpdate._id}`, formDataHotel,{
                    withCredentials: true
                  });
                console.log('Hotel updated:', response.data);
                if (response.status == '200'){
                    notification('Hotel','Hotel Updated Success','success')
                }
                query_response.reFetch();
                handleResetHotelInputs();
            } catch (error) {
                notification('Error',`${error}`,'danger')
                console.error('There was an error updating the hotel:', error);
            }
        }
        else if (['deletehotel'].includes(operation)){
            try {
                const response = await axios.delete(`${baseUrl}/hotels/${selectedHotelForDelete._id}`,{
                    withCredentials: true
                  })
                console.log('Hotel updated:', response.data);
                if (response.status == '200'){
                    notification('Hotel','Hotel Delete Success','success')
                }
                handleResetHotelInputs();
                query_response.reFetch();
            } catch (error) {
                notification('Error',`${error}`,'danger')
                console.error('There was an error deleting the hotel:', error);
            }
        }
    };
    const handleSubmitRoom = async (formDataRoom) => {
        if (['createroom'].includes(operation)){

            try {
                const response = await axios.post(`${baseUrl}/rooms/${selectedHotelForUpdate._id}`, formDataRoom,{
                    withCredentials: true
                  });
                console.log('Room created:', response.data);
                if (response.status == '200'){
                    notification('Room','Room Creation Success','success')
                }
                handleResetRoomInputs();
                query_response_rooms.reFetch();
                query_response.reFetch();

            } catch (error) {
                notification('Error',`${error}`,'danger')
                console.error('There was an error creating the room:', error);
            }
        }
        else if (['updateroom'].includes(operation)){

            try {
                const response = await axios.put(`${baseUrl}/rooms/${selectedRoomForUpdate?.room?._id}`, formDataRoom,{
                    withCredentials: true
                  });
                console.log('Room updated:', response.data);
                if (response.status == '200'){
                    notification('Room','Room Updated Success','success')
                }
                handleResetRoomInputs();
                query_response_rooms.reFetch();
                query_response.reFetch();
            } catch (error) {
                notification('Error',`${error}`,'danger')
                console.error('There was an error updating the Room:', error);
            }
        }
        else if (['deleteroom'].includes(operation)){
            try {
                const response = await axios.delete(`${baseUrl}/rooms/${selectedRoomForDelete?.room?._id}/${selectedRoomForDelete?.hotel?._id}`,{
                    withCredentials: true
                  })
                console.log('Room Deleted:', response.data);
                if (response.status == '200'){
                    notification('Room','Room Delete Success','success')
                }
                handleResetRoomInputs();
                query_response_rooms.reFetch();
                query_response.reFetch();
            } catch (error) {
                notification('Error',`${error}`,'danger')
                console.error('There was an error deleting the Room:', error);
            }
        }
    };
    const handleSubmitUser = async (formDataUser) => {

        if (['updateuser'].includes(operation)){

            try {
                const response = await axios.put(`${baseUrl}/users/${selectedUserForUpdate._id}`, formDataUser,{
                    withCredentials: true
                  });
                console.log('User updated:', response.data);
                if (response.status == '200'){
                    notification('User','User Updated Success','success')
                }
                handleResetUserInputs();
                query_response_rooms.reFetch();
                query_response_users.reFetch();
                query_response.reFetch();
            } catch (error) {
                notification('Error',`${error}`,'danger')
                console.error('There was an error updating the Room:', error);
            }
        }
        else if (['deleteuser'].includes(operation)){
            try {
              const response = await axios.delete(`${baseUrl}/users/${selectedUserForDelete._id}`,{
                    withCredentials: true
                  });
              console.log('User Deleted:', response.data);
                if (response.status == '200'){
                    notification('User','User Delete Success','success')
                }
                handleResetUserInputs();
                query_response_rooms.reFetch();
                query_response_users.reFetch();
                query_response.reFetch();
            } catch (error) {
                notification('Error',`${error}`,'danger')
                console.error('There was an error deleting the User:', error);
            }
        }
    };
    const handleSubmitAdmin = async (formDataAdmin) => {

        if (['createadmin'].includes(operation)){

            try {
                const response = await axios.post(`${baseUrl}/auth/register/admin`, formDataAdmin,{
                    withCredentials: true
                  });
                console.log('Admin created:', response.data);
                if (response.status == '200'){
                    notification('Admin','Admin created Success','success')
                }
                handleResetAdminInputs();
                query_response_rooms.reFetch();
                query_response_users.reFetch();
                query_response.reFetch();
            } catch (error) {
                notification('Error',`${error}`,'danger')
                console.error('There was an error creating the admin:', error);
            }
        }
    };

    const handleSubmitUserBooking = async() => {
      if (selectedBookingForDeleteBooking == null){
          notification('Booking','Please select a Booking','warning')
      }
      else{
          try {
              const existingBookings = selectedUserForDeleteBooking.bookingDetails

              const booking = selectedBookingForDeleteBooking
                  
              const removableDates = getDatesBetween(booking.checkin, booking.checkout);
              const rooms = booking.roomNumber;

              for (const room of rooms){
                  const res = await axios.get(`${baseUrl}/rooms/${room.roomId}`)
                  const currRoom = res.data
                  const roomToUpdate = currRoom.roomNumber.find(r=> r.Number == room.roomNumber)
                  if(roomToUpdate){
                      roomToUpdate.unavailableDate = roomToUpdate.unavailableDate.map((date)=> normalizeDate(convertUTCtoIST(date)).toDateString())
                      let removableDatess = removableDates.map((date)=> (normalizeDate(convertUTCtoIST(date)).toDateString()))
                      roomToUpdate.unavailableDate = roomToUpdate.unavailableDate.filter(date => !removableDatess.includes(date))
                  }
                  const resp = await axios.put(`${baseUrl}/rooms/${room.roomId}`,
                      currRoom
                  )
                  console.log(resp);

              }
              selectedUserForDeleteBooking.bookingDetails = existingBookings.filter(x => !(selectedBookingForDeleteBooking._id === x._id))
              const resp = await axios.put(`${baseUrl}/users/${selectedUserForDeleteBooking._id}`,{
                  bookingDetails: selectedUserForDeleteBooking.bookingDetails
              },{
                    withCredentials: true
                  })
              if (resp.status == '200'){
                notification('Booking','Booking Delete Success','success')
            }
            handleResetBookingInputs();
            setSelectedBookingForDeleteBooking(null)
            setSelectedUserForDeleteBooking(null)
            query_response_rooms.reFetch();
            query_response_users.reFetch();
            query_response.reFetch();
              
          } catch (error) {
            notification('Error',`${error}`,'danger')
            console.error('There was an error deleting the bookign:', error);
        }
      }
  }

    const handleAddRoom = (roomnumber) =>{
        if (formDataRoom.roomNumber.find(obj => obj.Number === roomnumber) === undefined){
            setFormDataRoom({ ...formDataRoom, roomNumber: [...formDataRoom.roomNumber, {Number: roomnumber, unavailableDate:[]}] });
        }
        else{
            notification('Room','Cannot add duplicate room number','danger');
        }
    }

    const handleResetRoomInputs = () => {
        setFormDataRoom({
            title: '',
            price: 0,
            maxPerson: 0,
            description: '',
            roomNumber: []
        })
    }
    const handleResetUserInputs = () => {
        setFormDataUser({
          username: '',
          email: '',
          mobile: '',
          isAdmin: false
        })
    }
    const handleResetBookingInputs = ()=>{
        setFormDataUserBooking({
          hotel :'',
          roomNumber: [{roomNumber: '',
                        roomId: ''    
                      }],
          checkin: '',
          checkout: '',
          price: '',
          person: ''
        })
    }
    const handleResetHotelInputs = ()=>{
        setFormDataHotel({
            name: '',
            type: '',
            city: '',
            address: '',
            distance: '',
            title: '',
            photos: [],
            description: '',
            rating: 0,
            rooms: [],
            featured: false,
            cheapestPrice: 0
        })
    }
    const handleResetAdminInputs = ()=>{
        setFormDataAdmin({
          username: '',
          email: '',
          mobile: '',
          password: '',
          isAdmin: true
        })
    }
    
    return (
    <>
    <Navbar />
    <div className="adminDashboard">
        <div className="adminDashboardContainer">
            {!operation && 'Please select one option' }
            <div className="adminDashBoardOptions">
                <div className={['createhotel','updatehotel','deletehotel'].includes(operation) ? 'adminDashBoardOption adminDashBoardOptionSelected':'adminDashBoardOption'} onMouseEnter={()=>{setOpenMenuHotel(true) }} onMouseLeave={()=>setOpenMenuHotel(false)} >Hotel
                    {openMenuHotel && 
                        <div className="adminDashBoardOptionItems">
                        <div className="adminDashBoardOptionItem" onClick={()=>{setOperation('createhotel')}}>Create Hotel</div>
                        <div className="adminDashBoardOptionItem" onClick={()=>{setOperation('updatehotel')}}>Update Hotel</div>
                        <div className="adminDashBoardOptionItem" onClick={()=>{setOperation('deletehotel')}}>Delete Hotel</div>
                        </div>
                    }</div>
                <div className={['createroom','updateroom','deleteroom'].includes(operation) ? 'adminDashBoardOption adminDashBoardOptionSelected':'adminDashBoardOption'} onMouseEnter={()=>{setOpenMenuRoom(true)}} onMouseLeave={()=>setOpenMenuRoom(false)} >Room
                    {openMenuRoom && 
                        <div className="adminDashBoardOptionItems">
                        <div className="adminDashBoardOptionItem" onClick={()=>{setOperation('createroom')}}>Create Room</div>
                        <div className="adminDashBoardOptionItem" onClick={()=>{setOperation('updateroom')}}>Update Room</div>
                        <div className="adminDashBoardOptionItem" onClick={()=>{setOperation('deleteroom')}}>Delete Room</div>
                        </div>
                    }</div>
                <div className={['updateuser','deleteuser'].includes(operation) ? 'adminDashBoardOption adminDashBoardOptionSelected':'adminDashBoardOption'} onMouseEnter={()=>{setOpenMenuUser(true)}} onMouseLeave={()=>setOpenMenuUser(false)} >User
                    {openMenuUser && 
                        <div className="adminDashBoardOptionItems">
                        <div className="adminDashBoardOptionItem" onClick={()=>{setOperation('updateuser')}}>Update User</div>
                        <div className="adminDashBoardOptionItem" onClick={()=>{setOperation('deleteuser')}}>Delete User</div>
                        </div>
                    }</div>
                <div className={['deletebooking'].includes(operation) ? 'adminDashBoardOption adminDashBoardOptionSelected':'adminDashBoardOption'} onMouseEnter={()=>{setOpenMenuBooking(true)}} onMouseLeave={()=>setOpenMenuBooking(false)} >Bookings
                    {openMenuBooking && 
                        <div className="adminDashBoardOptionItems">
                        <div className="adminDashBoardOptionItem" onClick={()=>{setOperation('deletebooking')}}>Delete Booking</div>
                        </div>
                    }</div>
                <div className={['createadmin'].includes(operation) ? 'adminDashBoardOption adminDashBoardOptionSelected':'adminDashBoardOption'} onMouseEnter={()=>{setOpenMenuAdmin(true)}} onMouseLeave={()=>setOpenMenuAdmin(false)} >Admin
                    {openMenuAdmin && 
                        <div className="adminDashBoardOptionItems">
                        <div className="adminDashBoardOptionItem" onClick={()=>{setOperation('createadmin')}}>Create Admin</div>
                        </div>
                    }</div>
            </div>
          {operation == "createhotel" && (
            <div className="adminDashboardForm">
              <div className="adminDashboardFormHeader">Create Hotel</div>
              <form
                className="adminDashboardFormInputs"
              >
                <div className="adminDashboardFormField">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formDataHotel.name}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Type:</label>
                  <Select
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '15px'
                      })
                    }}
                    name='type'
                    onChange={(selectedOption) => {
                      setFormDataHotel({ ...formDataHotel, type: selectedOption.value })
                    }}
                    options={
                      [
                        {value: 'Hotel', label: 'Hotel'},
                        {value: 'Restaurent', label: 'Restaurent'},
                        {value: 'Spa', label: 'Spa'},
                        {value: 'Forest', label: 'Forest'}

                      ]
                    }
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>City:</label>
                  <input
                    type="text"
                    name="city"
                    value={formDataHotel.city}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={formDataHotel.address}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Distance:</label>
                  <input
                    type="text"
                    name="distance"
                    value={formDataHotel.distance}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={formDataHotel.title}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Description:</label>
                  <input
                    text="text"
                    name="description"
                    value={formDataHotel.description}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Rating:</label>
                  <input
                    type="number"
                    name="rating"
                    value={formDataHotel.rating}
                    onChange={handleChangeHotel}
                    min="0"
                    max="5"
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Select Room:</label>
                  <Select
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '15px'
                      })
                    }}
                    isMulti
                    onChange={(selectedOption) => {
                      const selectedRooms = selectedOption ? selectedOption.map(option => option.value) : [];
                      setFormDataHotel({ ...formDataHotel, rooms: selectedRooms });
                    }}
                    options={
                      allRooms.length > 0
                        ? allRooms.map(room => ({ value: room._id, label: room.title }))
                        : []
                    }
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Cheapest Price:</label>
                  <input
                    type="number"
                    name="cheapestPrice"
                    value={formDataHotel.cheapestPrice}
                    onChange={handleChangeHotel}
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Featured:</label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formDataHotel.featured}
                    onChange={handleChangeHotel}
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label htmlFor="photos">Upload up to 4 photos:</label>
                  <input
                    type="file"
                    id="photos"
                    name="photos"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={selectedHotelImage.length >= 4}
                  />
                  <button
                    className="adminDashboardPhotoClearButton"
                    onClick={() => {
                      handleClearImages();
                    }}
                  >
                    Clear selection
                  </button>
                </div>
                <div className="adminDashboardFormSubmitButtons">
                    <div className="adminDashboardFormSubmitButton" type="submit" onClick={()=>handleSubmitHotel(formDataHotel)}>
                    Create Hotel
                    </div>
                    <div className="adminDashboardFormSubmitButton" type="submit" onClick={()=>handleResetHotelInputs(formDataHotel)}>
                    Reset Inputs
                    </div>
                </div>
              </form>
            </div>
          )}
          {operation == "updatehotel" && (
            <div className="adminDashboardForm">
              <div className="adminDashboardFormHeader">Update Hotel</div>
              <form
                className="adminDashboardFormInputs"
              >
                <div className="adminDashboardFormField">
                  <label>Select Hotel:</label>
                  <Select
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '15px'
                      })
                    }} onChange={(selectedOption) => {
                        const selectedHotel = allHotels.find(hotel => hotel._id === selectedOption.value);
                        setSelectHotelForUpdate(selectedHotel);
                        setFormDataHotel({
                            name: selectedHotel?.name,
                            type: selectedHotel?.type,
                            city: selectedHotel?.city,
                            address: selectedHotel?.address,
                            distance: selectedHotel?.distance,
                            title: selectedHotel?.title,
                            photos: selectedHotel?.photos,
                            description: selectedHotel?.description,
                            rating: selectedHotel?.rating,
                            rooms: selectedHotel?.rooms,
                            featured: selectedHotel?.featured,
                            cheapestPrice: selectedHotel?.cheapestPrice
                        })
                    }}                 
                    options = {allHotels.length > 0 &&
                      allHotels.map((hotel, index) => (
                        { value:hotel._id,  
                          label: hotel.name}
                      ))}
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formDataHotel.name}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Type:</label>
                  <input
                    type="text"
                    name="type"
                    value={formDataHotel.type}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>City:</label>
                  <input
                    type="text"
                    name="city"
                    value={formDataHotel.city}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={formDataHotel.address}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Distance:</label>
                  <input
                    type="text"
                    name="distance"
                    value={formDataHotel.distance}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={formDataHotel.title}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Description:</label>
                  <input
                    text="text"
                    name="description"
                    value={formDataHotel.description}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Rating:</label>
                  <input
                    type="number"
                    name="rating"
                    value={formDataHotel.rating}
                    onChange={handleChangeHotel}
                    min="0"
                    max="5"
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Select Room:</label>
                  <Select 
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '15px'
                      })
                    }}
                    isMulti 
                    onChange={(selectedOption) => {
                      const selectedRooms = selectedOption ? selectedOption.map(option => option.value) : [];
                    setFormDataHotel({ ...formDataHotel, rooms: selectedRooms });
                    }}                                      
                    options = {allRooms.length > 0 &&
                      allRooms.map((room, index) => (
                        {value:room._id  ,
                          label:room.title}
                      ))}
                  />
 
                </div>
                <div className="adminDashboardFormField">
                  <label>Cheapest Price:</label>
                  <input
                    type="number"
                    name="cheapestPrice"
                    value={formDataHotel.cheapestPrice}
                    onChange={handleChangeHotel}
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Featured:</label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formDataHotel.featured}
                    onChange={handleChangeHotel}
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label htmlFor="photos">Upload up to 4 photos:</label>
                  <input
                    type="file"
                    id="photos"
                    name="photos"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={selectedHotelImage.length >= 4}
                  />
                  <button
                    className="adminDashboardPhotoClearButton"
                    onClick={() => {
                      handleClearImages();
                    }}
                  >
                    Clear selection
                  </button>
                </div>
                <div className="adminDashboardFormSubmitButtons">
                    <div className="adminDashboardFormSubmitButton" type="submit" onClick={()=>handleSubmitHotel(formDataHotel)}>
                    Update Hotel
                    </div>
                    <div className="adminDashboardFormSubmitButton" type="submit" onClick={()=>handleResetHotelInputs(formDataHotel)}>
                    Reset Inputs
                    </div>
                </div>
              </form>
            </div>
          )}
          {operation == "deletehotel" && (
            <div className="adminDashboardForm">
              <div className="adminDashboardFormHeader">Delete Hotel</div>
              <form
                className="adminDashboardFormInputs"
              >
                <div className="adminDashboardFormField">
                  <label>Select Hotel:</label>
                  <Select
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '15px'
                      })
                    }} onChange={(selectedOption) => {
                        const selectedHotel = allHotels.find(hotel => hotel._id === selectedOption.value);
                        setSelectHotelForUpdate(selectedHotel);
                        setFormDataHotel({
                            name: selectedHotel?.name,
                            type: selectedHotel?.type,
                            city: selectedHotel?.city,
                            address: selectedHotel?.address,
                            distance: selectedHotel?.distance,
                            title: selectedHotel?.title,
                            photos: selectedHotel?.photos,
                            description: selectedHotel?.description,
                            rating: selectedHotel?.rating,
                            rooms: selectedHotel?.rooms,
                            featured: selectedHotel?.featured,
                            cheapestPrice: selectedHotel?.cheapestPrice
                        })
                    }}                 
                    options = {allHotels.length > 0 &&
                      allHotels.map((hotel, index) => (
                        { value:hotel._id,  
                          label: hotel.name}
                      ))}
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    disabled = 'true'
                    value={formDataHotel.name}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Type:</label>
                  <input
                    type="text"
                    name="type"
                    disabled = 'true'
                    value={formDataHotel.type}
                    onChange={handleChangeHotel}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>City:</label>
                  <input
                    type="text"
                    name="city"
                    disabled = 'true'
                    value={formDataHotel.city}
                    onChange={handleChangeHotel}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Address:</label>
                  <input
                    type="text"
                    disabled = 'true'
                    name="address"
                    value={formDataHotel.address}
                    onChange={handleChangeHotel}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Distance:</label>
                  <input
                    type="text"
                    disabled = 'true'
                    name="distance"
                    value={formDataHotel.distance}
                    onChange={handleChangeHotel}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Title:</label>
                  <input
                    type="text"
                    disabled = 'true'
                    name="title"
                    value={formDataHotel.title}
                    onChange={handleChangeHotel}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Description:</label>
                  <input
                    text="text"
                    disabled = 'true'
                    name="description"
                    value={formDataHotel.description}
                    onChange={handleChangeHotel}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Rating:</label>
                  <input
                    type="number"
                    disabled = 'true'
                    name="rating"
                    value={formDataHotel.rating}
                    onChange={handleChangeHotel}
                    min="0"
                    max="5"
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Selected Room:</label>
                  <div>                    
                  {formDataHotel?.rooms?.length > 0 ?
                      formDataHotel?.rooms?.map((room,index) => 
                        <div style={{fontWeight:'400'}}>
                        {allRooms.find(obj => obj._id == room)?.title}
                        </div>
                        ) : 'None'
                    }
                </div>
                </div>
                <div className="adminDashboardFormField">
                  <label>Cheapest Price:</label>
                  <input
                    type="number"
                    disabled = 'true'
                    name="cheapestPrice"
                    value={formDataHotel.cheapestPrice}
                    onChange={handleChangeHotel}
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Featured:</label>
                  <input
                    type="checkbox"
                    disabled = 'true'
                    name="featured"
                    checked={formDataHotel.featured}
                    onChange={handleChangeHotel}
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label htmlFor="photos">Upload up to 4 photos:</label>
                  <input
                    type="file"
                    id="photos"
                    disabled = 'true'
                    name="photos"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </div>
                <div className="adminDashboardFormSubmitButtons">
                    <div className="adminDashboardFormSubmitButton" type="submit" style={{backgroundColor: 'red'}} onClick={()=>handleSubmitHotel(formDataHotel)}>
                    Delete Hotel
                    </div>
                </div>
              </form>
            </div>
          )}
          {operation == "createroom" && (
            <div className="adminDashboardForm">
              <div className="adminDashboardFormHeader">Create Room</div>
              <form
                className="adminDashboardFormInputs"
              >
                <div className="adminDashboardFormField">
                  <label>Title:</label>
                  <input
                    type="text"
                    name='title'
                    value={formDataRoom.title}
                    onChange={handleChangeRoom}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Price:</label>
                  <input
                    type="text"
                    name='price'
                    value={formDataRoom.price}
                    onChange={handleChangeRoom}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Max Person:</label>
                  <input
                    type="text"
                    name='maxPerson'
                    value={formDataRoom.maxPerson}
                    onChange={handleChangeRoom}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Description:</label>
                  <input
                    type="text"
                    name='description'
                    value={formDataRoom.description}
                    onChange={handleChangeRoom}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Room Number:</label>
                  <input
                    type="text"
                    onChange={(e)=>setTempRoom(e.target.value)}
                    required
                  />
                    <div
                    className="adminDashboardPhotoClearButton" style={{backgroundColor:'green'}}
                    onClick={(e) => {
                      handleAddRoom(tempRoom);
                    }}
                  >
                    Add Room
                  </div>
                </div>
                <div className="adminDashboardFormField">
                  <label>Selected Room:</label>
                  <div>                                              
                  {formDataRoom?.roomNumber?.length > 0 ?
                      formDataRoom?.roomNumber?.map((roomNumber,index) => 
                        <div>
                            {roomNumber.Number}
                        </div>
                        ): 'None'
                    }
                </div>
                </div>
                <div className="adminDashboardFormField">
                  <label>Select Hotel:</label>
                  <Select
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '15px'
                      })
                    }}
                    onChange={(selectedOption) => {
                        const selectedHotel = allHotels.find(hotel => hotel._id === selectedOption.value);
                        setSelectHotelForUpdate(selectedHotel)
                    }}                 
                    options = {allHotels.length > 0 &&
                      allHotels.map((hotel, index) => (
                        { value:hotel._id,  
                          label: hotel.name}
                      ))}
                  />
                </div>
                <div className="adminDashboardFormSubmitButtons">

                    <div className="adminDashboardFormSubmitButton" onClick={()=>handleSubmitRoom(formDataRoom)}>
                    Create Room
                    </div>
                    <div className="adminDashboardFormSubmitButton" onClick={()=>handleResetRoomInputs()}>
                    Reset Input
                    </div>
                </div>
              </form>
            </div>
          )}
          {operation == "updateroom" && (
            <div className="adminDashboardForm">
              <div className="adminDashboardFormHeader">Update Room</div>
              <form
                className="adminDashboardFormInputs"
              >
                <div className="adminDashboardFormField">
                  <label>Select Room:</label>
                  <Select
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '15px'
                      })
                    }} onChange={(selectedOption) => {
                        const selectedRoom = allRooms.find(room => room._id === selectedOption.value);
                        setSelectedRoomForUpdate({room: selectedRoom});
                        setFormDataRoom({
                            title: selectedRoom?.title,
                            price: selectedRoom?.price,
                            maxPerson: selectedRoom?.maxPerson,
                            description: selectedRoom?.description,
                            roomNumber: selectedRoom?.roomNumber
                        })
                    }}       
                    options = {allRooms.length > 0 &&
                      allRooms.map((room, index) => (
                         {value:room._id, 
                          label:room.title}
                      ))}
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Title:</label>
                  <input
                    type="text"
                    name='title'
                    value={formDataRoom.title}
                    onChange={handleChangeRoom}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Price:</label>
                  <input
                    type="text"
                    name='price'
                    value={formDataRoom.price}
                    onChange={handleChangeRoom}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Max Person:</label>
                  <input
                    type="text"
                    name='maxPerson'
                    value={formDataRoom.maxPerson}
                    onChange={handleChangeRoom}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Description:</label>
                  <input
                    type="text"
                    name='description'
                    value={formDataRoom.description}
                    onChange={handleChangeRoom}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Room Number:</label>
                  <input
                    type="text"
                    onChange={(e)=>setTempRoom(e.target.value)}
                    required
                  />
                    <div
                    className="adminDashboardPhotoClearButton" style={{backgroundColor:'green'}}
                    onClick={(e) => {
                      handleAddRoom(tempRoom);
                    }}
                  >
                    Add Room
                  </div>
                    <div
                    className="adminDashboardPhotoClearButton" 
                    onClick={(e) => {
                      setFormDataRoom({...formDataRoom, roomNumber:[]});
                    }}
                  >
                    Clear all rooms
                  </div>
                </div>
                <div className="adminDashboardFormField">
                  <label>Selected Room:</label>
                  <div>
                  {formDataRoom?.roomNumber?.length > 0 ?
                      formDataRoom?.roomNumber?.map((roomNumber,index) => 
                        <div>
                            {roomNumber.Number}
                        </div>
                        ): 'None'
                    }
                </div>
                </div>
                <div className="adminDashboardFormSubmitButtons">

                    <div className="adminDashboardFormSubmitButton" onClick={()=>handleSubmitRoom(formDataRoom)}>
                    Update Room
                    </div>
                    <div className="adminDashboardFormSubmitButton" onClick={()=>handleResetRoomInputs()}>
                    Reset Input
                    </div>
                </div>
              </form>
            </div>
          )}
          {operation == "deleteroom" && (
            <div className="adminDashboardForm">
              <div className="adminDashboardFormHeader">Delete Room</div>
              <form
                className="adminDashboardFormInputs"
              >
                <div className="adminDashboardFormField">
                  <label>Select Room:</label>
                  <Select
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '15px'
                      })
                    }} onChange={(selectedOption) => {
                        const selectedRoom = allRooms.find(room => room._id === selectedOption.value);
                        setSelectedRoomForDelete({room: selectedRoom});
                        setFormDataRoom({
                            title: selectedRoom?.title,
                            price: selectedRoom?.price,
                            maxPerson: selectedRoom?.maxPerson,
                            description: selectedRoom?.description,
                            roomNumber: selectedRoom?.roomNumber
                        })
                    }}       
                    options = {allRooms.length > 0 &&
                      allRooms.map((room, index) => (
                         {value:room._id, 
                          label:room.title}
                      ))}
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Select Hotel:</label>
                  <Select
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '15px'
                      })
                    }} onChange={(selectedOption) => {
                        const selectedHotel = allHotels.find(hotel => hotel._id === selectedOption.value);
                        setSelectedRoomForDelete(prev => {return {...prev, hotel: selectedHotel}});
                    }}
                    options={allHotels.length > 0 &&
                        allHotels
                        .filter(hotel => hotel.rooms.includes(selectedRoomForDelete?.room?._id))
                        .map(hotel => (
                            { value:hotel._id,
                            label:hotel.name}
                    ))}

                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Title:</label>
                  <input
                    type="text"
                    name='title'
                    disabled='true'
                    value={formDataRoom.title}
                    onChange={handleChangeRoom}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Price:</label>
                  <input
                    type="text"
                    disabled='true'
                    name='price'
                    value={formDataRoom.price}
                    onChange={handleChangeRoom}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Max Person:</label>
                  <input
                    type="text"
                    name='maxPerson'
                    value={formDataRoom.maxPerson}
                    onChange={handleChangeRoom}
                    disabled='true'
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Description:</label>
                  <input
                    type="text"
                    name='description'
                    value={formDataRoom.description}
                    disabled='true'
                    onChange={handleChangeRoom}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Selected Room:</label>
                  <div>
                  {formDataRoom?.roomNumber?.length > 0 ?
                      formDataRoom?.roomNumber?.map((roomNumber,index) => 
                        <div>
                            {roomNumber.Number}
                        </div>
                        ): 'None'
                    }
                </div>
                </div>
                <div className="adminDashboardFormSubmitButtons">
                    <div className="adminDashboardFormSubmitButton" style={{backgroundColor: 'red'}} onClick={()=>handleSubmitRoom(formDataRoom)}>
                    Delete Room
                    </div>
                </div>
              </form>
            </div>
          )}
          {operation == "updateuser" && (
            <div className="adminDashboardForm">
              <div className="adminDashboardFormHeader">Update User</div>
              <form
                className="adminDashboardFormInputs"
              >
                <div className="adminDashboardFormField">
                  <label>Select User:</label>
                  <Select
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '15px'
                      })
                    }} onChange={(selectedOption) => {
                        const selectedUser = allUsers.find(user => user._id === selectedOption.value);
                        setSelectedUserForDelete(selectedUser);
                        setFormDataUser({
                          username: selectedUser?.username,
                          email: selectedUser?.email,
                          mobile: selectedUser?.mobile,
                          isAdmin: selectedUser?.isAdmin
                        })
                    }}
                    
                    options = {allUsers.length > 0 &&
                      allUsers.filter(x=> x._id != user._id).map((user, index) => (
                        {  value:user._id,  
                          label: user.username
                        }
                      ))}
                    />  
                </div>
                <div className="adminDashboardFormField">
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={formDataUser.username}
                    onChange={handleChangeUser}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formDataUser.email}
                    onChange={handleChangeUser}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Mobile:</label>
                  <input
                    type="number"
                    name="mobile"
                    value={formDataUser.mobile}
                    onChange={handleChangeUser}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Admin Access:</label>
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={formDataUser.isAdmin}
                    onChange={handleChangeUser}
                    required
                  />
                </div>
                
                <div className="adminDashboardFormSubmitButtons">
                    <div className="adminDashboardFormSubmitButton" type="submit" onClick={()=>handleSubmitUser(formDataUser)}>
                    Update User
                    </div>
                    <div className="adminDashboardFormSubmitButton" type="submit" onClick={()=>handleResetUserInputs()}>
                    Reset Inputs
                    </div>
                </div>
              </form>
            </div>
          )}
          {operation == "deleteuser" && (
            <div className="adminDashboardForm">
              <div className="adminDashboardFormHeader">Update User</div>
              <form
                className="adminDashboardFormInputs"
              >
                <div className="adminDashboardFormField">
                  <label>Select User:</label>
                  <Select
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '15px'
                      })
                    }} onChange={(selectedOption) => {
                        const selectedUser = allUsers.find(user => user._id === selectedOption.value);
                        setSelectedUserForDelete(selectedUser);
                        setFormDataUser({
                          username: selectedUser?.username,
                          email: selectedUser?.email,
                          mobile: selectedUser?.mobile,
                          isAdmin: selectedUser?.isAdmin
                        })
                    }}
                    
                    options = {allUsers.length > 0 &&
                      allUsers.filter(x=> x._id != user._id).map((user, index) => (
                        {  value:user._id,  
                          label: user.username
                        }
                      ))}
                    />                           
                 
                </div>
                <div className="adminDashboardFormField">
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    disabled='true'
                    value={formDataUser.username}
                    onChange={handleChangeUser}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formDataUser.email}
                    disabled='true'
                    onChange={handleChangeUser}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Mobile:</label>
                  <input
                    type="number"
                    disabled='true'
                    name="mobile"
                    value={formDataUser.mobile}
                    onChange={handleChangeUser}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Admin Access:</label>
                  <input
                    type="checkbox"
                    disabled='true'
                    name="isAdmin"
                    checked={formDataUser.isAdmin}
                    onChange={handleChangeUser}
                    required
                  />
                </div>
                
                <div className="adminDashboardFormSubmitButtons">
                    <div className="adminDashboardFormSubmitButton" style={{backgroundColor: 'red'}} type="submit" onClick={()=>handleSubmitUser(formDataUser)}>
                    Delete User
                    </div>
                </div>
              </form>
            </div>
          )}
          {operation == "deletebooking" && (
            <div className="adminDashboardForm">
              <div className="adminDashboardFormHeader">Delete Booking</div>
              <form
                className="adminDashboardFormInputs"
              >
                <div className="adminDashboardFormField">
                  <label>Select User:</label>
                  <Select
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '15px'
                      })
                    }} onChange={(selectedOption) => {
                        const selectedUser = allUsers.find(user => user._id === selectedOption.value);
                        setSelectedUserForDeleteBooking(selectedUser);
                    }}
                    options = {allUsers.length > 0 &&
                      allUsers.filter(x=> x._id != user._id).map((user, index) => (
                        {label:user.username ,
                        value:user._id } 
                      ))}
                    />   
                </div>
                <div className="adminDashboardFormField">
                  <label>Select Booking:</label>
                  <Select
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '15px'
                      })
                    }} className='adminDashboardFormFieldSelect'
                      onChange={(selectedOption) => {
                        const selectedBooking = selectedUserForDeleteBooking?.bookingDetails?.find(
                          (booking) => booking._id === selectedOption.value
                        );
                        setSelectedBookingForDeleteBooking(selectedBooking);
                        setFormDataUserBooking({
                          hotel: selectedBooking?.hotel,
                          roomNumber: selectedBooking?.roomNumber,
                          checkin: selectedBooking?.checkin,
                          checkout: selectedBooking?.checkout,
                          price: selectedBooking?.price,
                          person: selectedBooking?.person,
                        });
                      }}
                      options={
                        selectedUserForDeleteBooking?.bookingDetails?.length > 0
                          ? selectedUserForDeleteBooking.bookingDetails.map((booking) => ({
                              value: booking._id,
                              label: booking._id,
                            }))
                          : []
                      }
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Hotel:</label>
                  <input
                    type="text"
                    name="hotel"
                    disabled='true'
                    value={allHotels.find(x => x._id == formDataUserBooking.hotel)?.name || null}
                    required
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Room Numbers:</label>
                  {
                    formDataUserBooking?.roomNumber?.map((room, index)=>
                        <div>
                            {room.roomNumber}
                        </div>
                    )
                  }
                </div>
                <div className="adminDashboardFormField">
                  <label>Checkin:</label>
                  <input
                    type="text"
                    disabled='true'
                    name="checkin"
                    value={(normalizeDate(convertUTCtoIST(formDataUserBooking?.checkin)).toDateString())}
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Checkout:</label>
                  <input
                    type="text"
                    disabled='true'
                    name="checkout"
                    value={(normalizeDate(convertUTCtoIST(formDataUserBooking?.checkout)).toDateString())}
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Price:</label>
                  <input
                    type="text"
                    disabled='true'
                    name="price"
                    value={formDataUserBooking?.price}
                    />
                </div>
                <div className="adminDashboardFormField">
                  <label>Person:</label>
                  <input
                    type="text"
                    disabled='true'
                    name="person"
                    value={formDataUserBooking?.person}
                    />
                </div>

                
                <div className="adminDashboardFormSubmitButtons">
                    <div className="adminDashboardFormSubmitButton" style={{backgroundColor: 'red'}} type="submit" onClick={()=>handleSubmitUserBooking()}>
                    Delete Booking
                    </div>
                </div>
              </form>
            </div>
          )}
          {operation == "createadmin" && (
            <div className="adminDashboardForm">
              <div className="adminDashboardFormHeader">Create Admin</div>
              <form
                className="adminDashboardFormInputs"
              >
                <div className="adminDashboardFormField">
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={formDataAdmin.username}
                    onChange={handleChangeAdmin}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formDataAdmin.email}
                    onChange={handleChangeAdmin}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={formDataAdmin.password}
                    onChange={handleChangeAdmin}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Mobile:</label>
                  <input
                    type="number"
                    name="mobile"
                    value={formDataAdmin.mobile}
                    onChange={handleChangeAdmin}
                    required
                  />
                </div>
                <div className="adminDashboardFormField">
                  <label>Admin Access:</label>
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={formDataAdmin.isAdmin}
                    disabled="true"
                  />
                </div>
                
                <div className="adminDashboardFormSubmitButtons">
                    <div className="adminDashboardFormSubmitButton" type="submit" onClick={()=>handleSubmitAdmin(formDataAdmin)}>
                    Create Admin
                    </div>
                    <div className="adminDashboardFormSubmitButton" type="submit" onClick={()=>handleResetAdminInputs()}>
                    Reset Inputs
                    </div>
                </div>
              </form>
            </div>
          )}
        </div>
    </div>
    </>    
  )
}
