import React, { useEffect, useState } from 'react'
import './Hotel.css'
import NavBar from '../../components/navbar/navbar.jsx'
import Header from '../../components/header/header.jsx'
import { FaLocationDot } from 'react-icons/fa6'
import { FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa'
import { IoIosCloseCircle } from 'react-icons/io'
import { useLocation, useNavigate } from 'react-router-dom'
import useFetch from '../../hooks/useFetch.jsx'
import { useSelector } from 'react-redux'


function Hotel() {

  const [openSlider, setOpenSLider] = useState(false)
  const [slideNumber, setSlideNumber] = useState(0);
  const [data, setData] = useState(null);

  const searchState = useSelector(state => state.search);
  const auth = useSelector(state => state.auth)
  const navigate = useNavigate();

  const handleOpen = (i) => {
    setOpenSLider(true)
    setSlideNumber(i)
  }

  const handleRight = () => {
    if (slideNumber === 3){
      setSlideNumber(0)
    }
    else{
      setSlideNumber(slideNumber+1)
    }
  }
  const handleLeft = () => {
    if (slideNumber === 0){
      setSlideNumber(3)
    }
    else{
      setSlideNumber(slideNumber-1)
    }
  }
  const handleClose = () => {
    setOpenSLider(false)
  }
  
    const location = useLocation();
    console.log(location);

  const handleReserve = () =>{
    if (!auth.user){
      navigate('/login')
    }
    else{
      console.log('user present');
      navigate('/reserve',{state: {hotelId: location.pathname.substring(8)}})
    }
  }

  let url = `/hotels/find/${location.pathname.substring(8)}`
  const query_response = useFetch(url);

  const [imageSources, setImageSources] = useState([]);

  useEffect(()=>{
    if (query_response.response != null){
      setData(query_response.response.data);
      console.log(data);
      setImageSources(query_response.response.data.photos)
    }
    console.log(query_response);
  },[query_response])

  const ImageGallery = ( images ) => {
    const allImages = []

    for (let i=0 ; i<images.length; i++)
    {
      allImages.push(
        <div className='imageBlock' key={i} >
          <img src = {images[i]} alt='No Image Found' onClick={()=>{handleOpen(i)}} />
        </div>
      )
    }
      return (
          allImages
      );
    };

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(searchState.date[0].endDate, searchState.date[0].startDate);

  return (
    <>
    <NavBar/>
    <Header type='list'/>

    {
      data === null ? 'Loading...' : 
      <>
         {openSlider &&
            <div className="sliderMainContainer">

              <div className="sliderCloseButton" onClick={()=>{handleClose()}}>
                <IoIosCloseCircle />
              </div>
            <div className="sliderBackground">
              <div className='sliderContainer'>
              <div className="sliderLeftArrow" >
              <FaArrowCircleLeft onClick={()=>{handleLeft()}}/>
              </div>
              <div className="sliderImg">
                <img src={imageSources[slideNumber]}/>
              </div>
              <div className="sliderRightArrow" >
              <FaArrowCircleRight onClick={()=>{handleRight()}}/>
              </div>
              </div>
            </div>
            </div> 
            }


            <div className="hotel">
              <div className="hotelContainer">
                <div className="hotelMainDetails">
                  <div className="hotelMainDetailsLeft">
                    <div className="hotelTitle">{data.name}</div>
                    <div className="hotelLocation"><FaLocationDot />
                    {data.address}</div>
                    <div className="hotelDistance">{`Excellect, ${data.distance} km from city center`}</div>
                    <div className="hotelBookAndStay">Seamless Booking, Memorable Stays.</div>
                  </div>
                  <div className="hotelMainDetailsRight">
                    <div className="hotelReserveButton" onClick={()=>{handleReserve()}}>
                      Reserve or Book Now !
                    </div>
                  </div>
                </div>

                <div className="hotelImages">
                {ImageGallery(imageSources)}
                </div>

                <div className="hotelDescription">
                  <div className="hotelDescriptionLeft">
                    <div className="hotelDescTitle">{data.title}</div>
                    <div className="hotelDesc">{data.description}</div>
                  </div>
                  <div className="hotelDescriptionRight">
                    <div className="hotelDescTitle">{`Perfect for ${days}-night stay`}</div>
                    <div className="hotelDesc">
                    Discover comfort and elegance with top-tier amenities, ensuring a memorable stay in the heart of the city.</div>
                    <div className="hotelDescPrice">{`₹ ${days*data.cheapestPrice*searchState.persons.room} for ${days} Nights`}<br/> {`(${searchState.persons.room} rooms)`}</div>
                    <div className="hotelDesReserveButton" onClick={()=> {handleReserve()}}>
                      Reserve or Book Now !
                    </div>
                  </div>
                </div>
              </div>
            </div>
      
          </>

    }

 
    </>
  )
}

export default Hotel