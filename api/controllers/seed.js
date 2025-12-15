import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const seedAll = async (req, res, next) => {
  try {
    await Promise.all([
      User.deleteMany({}),
      Hotel.deleteMany({}),
      Room.deleteMany({})
    ]);

    // 1) Create 100 hotels
    const cities = [
      "Mumbai",
      "Delhi",
      "Bangalore",
      "Chennai",
      "Pune",
      "Hyderabad",
      "Goa",
      "Jaipur"
    ];
    const types = ["hotel", "apartment", "resort", "villa"];

    const hotelPayload = Array.from({ length: 100 }).map((_, i) => {
      const city = cities[i % cities.length];
      const type = types[i % types.length];
      const basePrice = 1500 + (i % 10) * 200;
      return {
        name: `QuickStay ${city} ${i + 1}`,
        type,
        city,
        address: `Address line ${i + 1}, ${city}`,
        distance: `${500 + (i % 5) * 100}m from center`,
        // photos: [
        //   `https://example.com/${city.toLowerCase()}-${i + 1}-1.jpg`,
        //   `https://example.com/${city.toLowerCase()}-${i + 1}-2.jpg`
        // ],
        title: `Comfort stay in ${city}`,
        desc: `Sample description for hotel ${i + 1} in ${city}.`,
        rating: 3.5 + (i % 10) * 0.1,
        rooms: [],
        cheapestPrice: basePrice,
        featured: i % 7 === 0
      };
    });

    const hotels = await Hotel.insertMany(hotelPayload);
    const hotelIds = hotels.map(h => h._id);

    // 2) Create 200 rooms and link to hotels
    const roomPayload = [];

    for (let i = 0; i < 200; i++) {
      const hotelId = hotelIds[i % hotelIds.length];
      roomPayload.push({
        title: `Room Type ${i + 1}`,
        price: 1000 + (i % 10) * 150,
        maxPeople: 1 + (i % 4),
        desc: `Sample room description ${i + 1}.`,
        roomNumbers: [
          { number: 100 + i * 2, unavailableDates: [] },
          { number: 101 + i * 2, unavailableDates: [] }
        ],
        hotel: hotelId
      });
    }

    const rooms = await Room.insertMany(roomPayload);

    // Update hotels with rooms
    const roomsByHotel = {};
    rooms.forEach(r => {
      const hId = r.hotel.toString();
      if (!roomsByHotel[hId]) roomsByHotel[hId] = [];
      roomsByHotel[hId].push(r._id);
    });

    await Promise.all(
      Object.entries(roomsByHotel).map(([hotelId, roomIds]) =>
        Hotel.findByIdAndUpdate(
          hotelId,
          { $push: { rooms: { $each: roomIds } } },
          { new: true }
        )
      )
    );

    // 3) Create 30 users with embedded bookings
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync("User@123", salt);

    const usersPayload = Array.from({ length: 30 }).map((_, i) => {
      // create ~2 bookings per user
      const bookings = [];
      for (let b = 0; b < 2; b++) {
        const room = rooms[(i * 2 + b) % rooms.length];
        const hotelId = room.hotel;
        const start = new Date();
        start.setDate(start.getDate() + (i + b));
        const end = new Date(start);
        end.setDate(start.getDate() + 2);
        bookings.push({
          hotelId,
          roomId: room._id,
          startDate: start,
          endDate: end,
          totalPrice: room.price * 2,
          status: "confirmed"
        });
      }

      return {
        username: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: hashedPassword,
        isAdmin: i === 0,
        bookings // must match your User schema field name/shape
      };
    });

    const users = await User.insertMany(usersPayload);

    res.status(200).json({
      message: "Seed completed with embedded bookings in users",
      users: users.length,
      hotels: hotels.length,
      rooms: rooms.length,
      approxBookings: users.reduce((acc, u) => acc + (u.bookings?.length || 0), 0)
    });
  } catch (err) {
    return next(err);
  }
};
