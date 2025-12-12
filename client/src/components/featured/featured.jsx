import React from 'react'
import './featured.css'
import { useNavigate } from 'react-router-dom';

function Featured(props) {
  

    const navigate = useNavigate();

    const checkIfHotelType = (title) => {
      const hotelTypes = ["Hotel", "Spa", "Restaurent","Forest"]; 
      return hotelTypes.includes(title);
    };
    const handleClick = (title) => {
      const isHotelType = checkIfHotelType(title); 
      if (isHotelType) {
        navigate('/hotels', { state: {type : title }  });
      } else {
        navigate('/hotels', { state: {destination: title}  });
      }
    };
    

    const ImageGallery = (props) => {
      const propertyCount = props.propertyCount;
    
      return (
        <div className="imageGalleryList">
          {props.images.map((image, index) => (
            <div
              className="imageBlock"
              key={index}
              onClick={() => {
                if (image && image.title) {
                  handleClick(image.title);
                } else {
                  console.error("Title is undefined");
                }
              }}
            >
              <img src={image.src} alt={image.title} />
              <div className="imageTitle">{image.title}</div>
              <div className="imageDescription">
                {propertyCount != null &&
                image &&
                propertyCount.data[index] &&
                propertyCount.data[index][image.title]
                  ? `${propertyCount.data[index][image.title]} Properties`
                  : "Loading..."}
              </div>
            </div>
          ))}
        </div>
      );
    };
           

  return (
    <div className="featured">

      <div className="featuredTitle">
          <h1>{props.title}</h1>
      </div>
      <div className="featuredDescription">
          <h2>{props.description}</h2>
      </div>
      <div className="featuredImages">
          {ImageGallery(props)}
      </div>

    </div>
  )
}

export default Featured