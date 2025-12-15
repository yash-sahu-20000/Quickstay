import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/navbar.jsx'
import Header from '../../components/header/header.jsx'
import Featured from '../../components/featured/featured.jsx'
import Card from '../../components/card/card.jsx'
import useFetch from '../../hooks/useFetch.jsx'
import './Home.css'

export const Home = () => {


  const imageSourcesPlace = [
    { src: "/images/Bangalore.jpg", title: "Bangalore" },
    { src: "/images/Munnar.jpg", title: "Munnar" },
    { src: "/images/Mumbai.jpg", title: "Mumbai" },
    { src: "/images/Ooty.jpg", title: "Ooty" },
    { src: "/images/goa.jpg", title: "Goa" }
  ];
  const imageSourcesType = [
    { src: "/images/Bangalore.jpg", title: "Hotel" },
    { src: "/images/Ooty.jpg", title: "Spa" },
    { src: "/images/Munnar.jpg", title: "Restaurent" },
    { src: "/images/Mumbai.jpg", title: "Forest" }
  ];

  const [countByType, setCountByType] = useState(null);
  const [countByPlace, setCountByPlace] = useState(null);
  const [cardData, setCardData] = useState(null)


  const hotelType = 'Hotel,Spa,Restaurent,Forest';
  const temp1 = useFetch(`/hotels/countByType?types=${hotelType}`);
  
  useEffect(() => {
    if (temp1 && !temp1.loading && !temp1.error) {
      setTimeout(() => {
        setCountByType(temp1.response); 
      }, 1000);
    }
  }, [temp1]);

  const hotelPlace = 'Bangalore,Munnar,Mumbai,Ooty,Goa';
  const temp2 = useFetch(`/hotels/countByCities?cities=${hotelPlace}`);
  
  useEffect(() => {
    if (temp2 && !temp2.loading && !temp2.error) {
      setTimeout(() => {
        setCountByPlace(temp2.response); 
      }, 1000);
    }
  }, [temp2]);


  const temp3 = useFetch('/hotels/?featured=true');
  useEffect(() => {
    if (temp3 && !temp3.loading && !temp3.error) {
      setTimeout(() => {
        setCardData(temp3.response); 
      }, 1000);
    }
  }, [temp3]);

  const cardList = (cardData, start) => {
    const cardListArray = []

    let end = start+5
    if (cardData){
      if (end > cardData.data.length)
        end = cardData.data.length
      for (let i of cardData.data.slice(start, end)){
        cardListArray.push(
          <Card data={i}/>
        )
      }
      return cardListArray;
    }

    else{
      return <>Loading... Please wait</>
    }
  }



  return (
    <>
    <div>{<Navbar/>}</div>
    <div>{<Header/>}</div>
    <div className="home">
        <div className="homeContainer">
          <div>{<Featured title={'Quick and easy trip planner'} description={'Browse by Type'} images={imageSourcesType} propertyCount={countByType}/>}</div>
          <div>{<Featured title={'Explore India'} description={'Browse by Place'} images={imageSourcesPlace} propertyCount={countByPlace}/>}</div>
          <div className='homeList'>
            <div className="homeListTitle">
                <h1>Deals for the weekend</h1>
              </div>
            <div className="homeListSubtitle">
                <h2>Exciting offer and exclusive discounts</h2>
            </div>
            <div className="homeListCards">

              {cardList(cardData, 0)}

            </div>
          </div>
          <div className='homeList'>
            <div className="homeListTitle">
                <h1>Stay in a top-rated vacation rental</h1>
              </div>
            <div className="homeListSubtitle">
                <h2>From castles and villas to boats and igloos, we have it all</h2>
            </div>
            <div className="homeListCards">
              {cardList(cardData, 5)}
            </div>
          </div>
        </div>
    </div>
    </>
  )
}


