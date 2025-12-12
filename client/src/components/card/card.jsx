import React from 'react'
import './card.css'
import { FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom';

function Card(props) {
    const cardData = props.data
  return (
    
    <Link to={`/hotels/${cardData._id}`} style={{color: 'inherit', textDecoration: 'none'}}>
    <div className="card">
        <div className="cardImage">
            <img src={cardData.photos.length >0 && cardData.photos[0]} alt='No Photo Found' />
        </div>
        <div className="cardDetails">
            <div className="cardTitle">
                <h2>
                {cardData.name}
                </h2>
            </div>
            <div className="cardSubtitle">
                <h3>
                {cardData.city}
                </h3>
            </div>
            {cardData.rating && <div className="cardRating">
                <FaStar/>
                <div className="cardRatingPoint">{cardData.rating}</div>
            </div>}
            <div className="cardReview">
                {Math.floor(Math.random() * 3000)} Reviews
            </div>
            <div className="cardPrice">
                <div className="cardMrp">{`Starting from ₹ ${cardData.cheapestPrice * 1.2}`}/-</div>
                <div className="cardPrice">{`₹ ${cardData.cheapestPrice}`}/-</div>
            </div>
            <div className="cardNight">Per Night</div>
        </div>
    </div>
    </Link>
  )
}

export default Card