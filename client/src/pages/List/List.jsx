import { useEffect, useState } from "react";
import Header from "../../components/header/header"
import ListCard from "../../components/listCard/listCard";import { format } from 'date-fns';
import { DateRangePicker } from 'react-date-range'
import Navbar from "../../components/navbar/navbar"
import useFetch from "../../hooks/useFetch";
import './List.css';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { newSearch } from "../../redux/searchReducer/searchReducer";
import { normalizeDate } from "../../utils/functions";
import Select from "react-select";


export const List = () => {
    const search = useSelector(state => state.search)

    const location = useLocation();
    const [showCalender, setShowCalender] = useState(false);
    const [destination, setDestination] = useState(search.city || location.state?.destination || null);
    const [date, setDate] = useState(search.date || [
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
      ]);
    const [adults, setAdults] = useState(search.persons.adults || 0)
    const [child, setChild] = useState(search.persons.children || 0)
    const [rooms, setRooms] = useState(search.persons.room || 0)
    const [max, setMax] = useState(9999)
    const [min, setMin] = useState(0)
    const [type, setType] = useState(location.state?.type || null)


    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [allCities, setAllCities] = useState([])

    let urlend = '/hotels/?'
    if (destination !== null && destination !== ""){
        urlend = urlend + `city=${destination}&`
    }
    if (type != null){
        urlend = urlend + `type=${type}&`
    }

    urlend = urlend + `min=${min}&max=${max}`
    
    const query_response = useFetch(`${urlend}`)
    useEffect(()=>{
            // console.log(query_response);
            setResponse(query_response.response)
            setLoading(query_response.loading)
            setError(query_response.error)
        
    },[query_response])

    
    const dispatch = useDispatch();
    const handleSearch = () => {
        query_response.reFetch();
        dispatch(newSearch({city: destination, date: date, persons:{adults: adults, children: child, room: rooms}}))
    }

    const resp = useFetch('/hotels/getAllCityNames')
    useEffect(()=>{
        if(resp.response != null)
        setAllCities(resp.response.data)
    },[resp?.response?.data])
    useEffect(()=>{
        console.log(allCities);
    },[allCities])

    return <div>
        <Navbar/>
        <Header type="list" />

        <div className="list">

            <div className="listContainer">
                <div className="listSearchBar">
                    <div className='listSearchBarContainer' >
                        <div className="listSearchBarHeader">Search</div>
                        <div className="listSearchBarItems">
                            <div className="listSearchBoxLeft">
                                <div className='listSearchBarInputHeader'>Destination</div>
                                <Select 
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        fontSize: '15px',
                                        width: '190px',
                                        height: '17px'
                                    }),
                                    option: (baseStyles, state) => ({
                                        ...baseStyles,
                                        fontSize: '15px'
                                    })
                                    }}
                                options={
                                    allCities.length > 0
                                    ? allCities.map(city => ({ value: city, label: city }))
                                    : []
                                }
                                onChange={(selectedOption) => {
                                    setDestination(selectedOption.value === "" ? null : selectedOption.value)
                                  }}
                                />   
                                <div className='listSearchBarInputHeader'>Type</div>
                                <Select 
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        fontSize: '15px',
                                        width: '190px',
                                        height: '17px'
                                    })
                                    }}
                                options={[
                                    {value: 'Hotel', label: "Hotel"},
                                    {value: 'Restaurent', label: "Restaurent"},
                                    {value: 'Forest', label: "Forest"},
                                    {value: 'Spa', label: "Spa"}
                                ]}
                                onChange={(selectedOption) => {
                                    setType(selectedOption.value === "" ? null : selectedOption.value)
                                  }}
                                />                               
                                <div className='listSearchBarInputHeader'>Check-in/out Date</div>
                                <input readOnly className="listSearchBarInput" 
                                            onClick={()=>{
                                            setShowCalender(!showCalender)
                                            }}  
                                            type='text' 
                                            placeholder={`${format(date[0].startDate, "dd/MM/yyyy")} To ${format(date[0].endDate, "dd/MM/yyyy")} `} />

                                        {showCalender && <DateRangePicker 
                                            className="listSearchBarDatePicker"
                                            onChange={item => setDate([{startDate: normalizeDate(item.selection.startDate), endDate: normalizeDate(item.selection.endDate), key:'selection'}])}
                                            showSelectionPreview={true}
                                            moveRangeOnFirstSelection={false}
                                            ranges={date}/>}
                            </div>

                        <div className="listSearchBoxRight">
                            <div className="listSearchBoxRightInput">
                            <div className="listSearchBarInput">Max price per night</div>
                            <input className="listSearchBarInput" type='number' min={0} placeholder={max} onChange={(event)=>setMax(event.target.value)}/>
                            </div>
                            <div className="listSearchBoxRightInput">
                            <div className="listSearchBarInput">Min price per night</div>
                            <input className="listSearchBarInput" type='number'  min={0} placeholder={min} onChange={(event)=>setMin(event.target.value)}/>
                            </div>
                            <div className="listSearchBoxRightInput">
                            <div className="listSearchBarInput">Adults</div>
                            <input className="listSearchBarInput" type='number'  min={0} placeholder={adults} onChange={(event)=>setAdults(event.target.value)}/>
                            </div>
                            <div className="listSearchBoxRightInput">
                            <div className="listSearchBarInput">Child</div>
                            <input className="listSearchBarInput" type='number'  min={0} placeholder={child} onChange={(event)=>setChild(event.target.value)}/>
                            </div>
                            <div className="listSearchBoxRightInput">
                            <div className="listSearchBarInput">Room</div>
                            <input className="listSearchBarInput" type='number' min={0} placeholder={rooms} onChange={(event)=>setRooms(event.target.value)}/>
                            </div>

                            </div>

                        </div>

                        <div className="listSearchBarButton" onClick={()=>{handleSearch()}}>Search</div>
                        </div>
                    </div>
                <div className="listHotel">
                    {   loading!=null && loading===false ? <> 
                    {
                    response.data.length > 0 ? response.data.map((data, index) => {
                           return <ListCard data = {data}/>
                        }) : <>No Result Found..</>
                    }
                    </> :
                    <>
                        Loading...
                    </>
                    }

                </div>
            </div>
        </div>
    </div>
}