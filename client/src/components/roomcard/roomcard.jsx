import React, { useEffect, useState } from 'react';
import './roomcard.css';
import useFetch from '../../hooks/useFetch';
import { useSelector } from 'react-redux';
import { IoPersonOutline } from 'react-icons/io5';
import { normalizeDate } from '../../utils/functions';

function Roomcard(props) {
  const search = useSelector((state) => state.search);
  const [roomDetails, setRoomDetails] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const { response: query_response, loading, error } = useFetch(`/rooms/${props.data}`);

  useEffect(() => {
    if (query_response && roomDetails !== query_response.data) {
      setRoomDetails(query_response.data);
    }
  }, [query_response, roomDetails]);


  const isRoomUnavailable = (unavailableDates) => {
    const startDate = normalizeDate(new Date(search?.date[0]?.startDate));
    const endDate = normalizeDate(new Date(search?.date[0]?.endDate));
    console.log(startDate,endDate);
    return unavailableDates.some((unavailableDate) => {
      const undate = normalizeDate(new Date(unavailableDate));
      return startDate <= undate && undate <= endDate;
    });
  };

  const handleCheckbox = (roomNumber, roomId, roomPrice) => {
    setSelectedRooms((prev) => {
      if (prev.includes(roomNumber)) {
        props.handleRoomSelection(roomNumber, roomId, false, roomPrice);
        return prev.filter((room) => room !== roomNumber);
      } else {
        props.handleRoomSelection(roomNumber, roomId, true, roomPrice);
        return [...prev, roomNumber];
      }
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred!</div>;

  return (
    <>
      {roomDetails ? (
        <div className="roomContainer">
          <div className="roomContainerLeft">
            <div className="roomHeader">{roomDetails.title}</div>
            <div className="roomDescription">{roomDetails.description}</div>
            <div className="roomPerson"><IoPersonOutline/>{roomDetails.maxPerson}</div>
            <div className="roomPrice">₹{roomDetails.price}</div>
          </div>
          <div className="roomContainerRight">
            {roomDetails.roomNumber.map((room, index) => {
              const isDisabled = isRoomUnavailable(room.unavailableDate);
              return (
                <div className="roomNumber" key={index}>
                  {room.Number}
                    <input
                      type="checkbox"
                      className="roomNumberCheckBoxInput"
                      value={room.Number}
                      disabled={isDisabled} 
                      checked={selectedRooms.includes(room.Number)}
                      onChange={() => handleCheckbox(room.Number, roomDetails._id, roomDetails.price)}
                    />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>No room found</div> 
      )}
    </>
  );
}

export default Roomcard;

