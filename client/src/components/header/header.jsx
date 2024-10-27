import React, { useEffect, useState } from 'react'
import './header.css'
import { RiHotelFill } from 'react-icons/ri';
import { MdFlight, MdOutlineKingBed } from 'react-icons/md';
import { FaBed, FaCar, FaTaxi } from 'react-icons/fa';
import { IoPeople } from 'react-icons/io5';
import { SlCalender } from 'react-icons/sl';
import { DateRangePicker } from 'react-date-range';


import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { format } from 'date-fns';
import { GrAddCircle, GrSubtractCircle } from 'react-icons/gr';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NEW_SEARCH, newSearch } from '../../redux/searchReducer/searchReducer';
import { normalizeDate } from '../../utils/functions';
import useFetch from '../../hooks/useFetch';
import Select from 'react-select';

function Header(prop) {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth)
    const search = useSelector(state => state.search)
    const user = auth.user;

    const [destination, setDestination] = useState(null);
    const [allCities, setAllCities] = useState([])

    const [showCalender, setShowCalender] = useState(false);


    const [date, setDate] = useState([
        {
          startDate: search.date[0].startDate || normalizeDate(new Date()),
          endDate: search.date[0].endDate || normalizeDate(new Date()),
          key: 'selection'
        }
      ]);

    

    const [showPersonOption, setShowPersonOption] = useState(false)

    const [persons, setPersons] = useState(
        {
            adult: 0,
            children: 0,
            room: 0
        }
    )
    
    const handlePersonOptions = (option, action) =>{
        
        if (action == 'i'){
            setPersons(prevState => {
                return {
                    ...prevState, [option]: prevState[option]+1
                }
            })
                
        
        }
        else if(action == 'd'){
            setPersons((prevState) => {
                if(prevState[option] > 0){
                    return {
                        ...prevState, [option]: prevState[option]-1
                    }
                }
                else{
                    return {
                        ...prevState, [option]: 0
                    }
                }
            }) 
        }
    }

    let d = null
    const navigate = useNavigate()
    const handleSearch = () =>{
        dispatch((newSearch({city: destination, date: date, persons:persons})))
        navigate('/hotels')
    }

    const handleSearchInput = (x) => {
        setDestination(x); 
    }

    const resp = useFetch('/hotels/getAllCityNames')
    useEffect(()=>{
        if(resp.response != null)
        setAllCities(resp.response.data)
    },[resp?.response?.data])

  return (
    <>
    <div className="header">
        <div className="headerContainer">
            <div className="headerList" >
                <div className="headerIcons">
                    <RiHotelFill/>
                    <span>Hotels</span>
                </div>
                <div className="headerIcons">
                    <MdFlight/>                    
                    <span>Flight</span>
                </div>
                <div className="headerIcons">
                    <FaCar />                    
                    <span>Car Rental</span>
                </div>
                <div className="headerIcons">
                    <FaBed />                    
                    <span>Rooms</span>
                </div>
                <div className="headerIcons">
                    <FaTaxi />                    
                    <span>Airport Taxi</span>
                </div>
            </div>
            <div className={prop.type !== 'list' ? 'headerAdLine' : 'headerAdLine listMode'}>
                <h1>Your dream stay, <br/>just a tap away with QuickStay!</h1>
                <h3>Register now to unlock exclusive deals, seamless bookings, and personalized stays – your next adventure with QuickStay !</h3>
                
                {
                    user == null ?                 
                    <Link to={'/login'} style={{color:'inherit', textDecoration:'none'}}>
                    <button className="headerAdLineButtion"> Sign in or Register</button>
                </Link> : <></>
                }
                

            </div>
            <div className={prop.type !== 'list' ? 'headerSearchBarContainer' : 'headerSearchBarContainer listMode'}>
                <div className="headerSearchBar">
                    <div className="headerSearchBarItem">
                        <div className='headerSearchBarIcon'><MdOutlineKingBed/></div>
                            {/* <input className="headerSearchInput" type='text' placeholder='Where you are going?' onChange={(event)=>{handleSearchInput(event.target.value)}} /> */}
                            <Select 
                            placeholder='Where are you going?'
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        width: '200px',
                                        height: '17px',
                                        border: 'none',
                                        fontSize: '15px',
                                    }),
                                    option: (baseStyles, state) => ({
                                        ...baseStyles,
                                        fontSize: '15px',
                                        color: 'black',
                                    }),
                                    singleValue: (baseStyles, state) => ({
                                        ...baseStyles,
                                        color: 'grey',
                                        fontWeight: '400'
                                      })
                                    
                                    }}
                                options={
                                    allCities.length > 0
                                    ? allCities.map(city => ({ value: city, label: city }))
                                    : []
                                }
                                onChange={(selectedOption) => {
                                    handleSearchInput(selectedOption.value === "" ? null : selectedOption.value)
                                  }}
                                />   
                        </div>
                    <div className="headerSearchBarItem">
                        <div className='headerSearchBarIcon'><SlCalender/></div>
                            <input readOnly className="headerSearchInput" onClick={()=>{
                                setShowCalender(!showCalender)
                            }} type='text' placeholder={`${format(date[0].startDate, "dd/MM/yyyy")} To ${format(date[0].endDate, "dd/MM/yyyy")} `} />

                        {showCalender && <DateRangePicker 
                            
                            className="headerSearchBarDatePicker"
                            onChange={item => setDate([{startDate: normalizeDate(item.selection.startDate), endDate: normalizeDate(item.selection.endDate), key:'selection'}])}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            ranges={date}/>}

                        </div>
                    <div className="headerSearchBarItem">
                        <div className='headerSearchBarIcon'><IoPeople/></div>
                            <input  readOnly  className="headerSearchInput" onClick={()=>{
                                setShowPersonOption(!showPersonOption)
                            }} type='text' placeholder={`${persons.adult} Adults | ${persons.children} Children | ${persons.room} Room`} />
                            {showPersonOption && <div className='headerSearchBarPersonBox' >
                                <div className="headerSeachBarPersonBoxItem">
                                    <div className="headerSeachBarPersonBoxItemText" >Adult</div>
                                    <div className="headerSeachBarPersonBoxItemButton" onClick={()=>{handlePersonOptions('adult','d')}}><GrSubtractCircle /></div>
                                    <div className="headerSeachBarPersonBoxItemText" >{persons.adult}</div>
                                    <div className="headerSeachBarPersonBoxItemButton" onClick={()=>{handlePersonOptions('adult','i')}}><GrAddCircle/></div>
                                </div>
                                <div className="headerSeachBarPersonBoxItem">
                                    <div className="headerSeachBarPersonBoxItemText">Child</div>
                                    <div className="headerSeachBarPersonBoxItemButton" onClick={()=>{handlePersonOptions('children','d')}} ><GrSubtractCircle /></div>
                                    <div className="headerSeachBarPersonBoxItemText">{persons.children}</div>
                                    <div className="headerSeachBarPersonBoxItemButton" onClick={()=>{handlePersonOptions('children','i')}}><GrAddCircle/></div>
                                </div>
                                <div className="headerSeachBarPersonBoxItem">
                                    <div className="headerSeachBarPersonBoxItemText">Room</div>
                                    <div className="headerSeachBarPersonBoxItemButton" onClick={()=>{handlePersonOptions('room','d')}}><GrSubtractCircle /></div>
                                    <div className="headerSeachBarPersonBoxItemText">{persons.room}</div>
                                    <div className="headerSeachBarPersonBoxItemButton" onClick={()=>{handlePersonOptions('room','i')}}><GrAddCircle/></div>
                                </div>
                            </div>}
                        </div>
                     
                        <div className="headerSearchButton" onClick={()=> {handleSearch()}}>Search</div>
                     
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Header