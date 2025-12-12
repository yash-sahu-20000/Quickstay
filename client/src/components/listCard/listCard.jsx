import React, { useEffect } from 'react'
import './listCard.css'
import { Link, useNavigate } from 'react-router-dom'

function ListCard(props) {

  const navigate = useNavigate();
  const data = props.data


  return (
    <div className="listCard" >
      <div className="listCardContainer">
        <div className="listCardImage">
          <img src={data.photos[0]} alt='No Image Found'/>
        </div>
        <div className="listCardHotelDetails">
          <div className="listCardHotelName">{data.name}</div>
          <div className="listCardHotelDistance">{data.distance} km from the center</div>
          <div className="listCardHotelAirport"><h3>{'Free Airport Taxi'}</h3></div>
          <div className="listCardHotelDescription">{data.description.length > 300 ? `${data.description.substring(0,200)} ...Read More`: data.description}</div>
          <div className="listCardHotelFreeCancel">{'Free Cancellation'}</div>
          <div className="listCardHotelCancel">{'You can cancel later, so lock this great price today!'}</div>
        </div>
        <div className="listCardHotelPriceDetails">
          <div className="listCardHotelRating"><div className='listCardHotelRatingIn'>{data.rating ? data.rating : 'No rating'}</div></div>
          <div className="listCardHotelPriceIn">
            <div className="listCardHotelPrice">₹{data.cheapestPrice}</div>
            <div className="listCardHotelIncludes">{'Includes fare and taxes'}</div>
              <div className="listCardHotelAvailability" >
                <Link to={`/hotels/${data._id}`} style={{textDecoration:'none'}}>
                  <div className='listCardHotelAvailabilityIn'>{'See availablity'}</div>
                </Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListCard