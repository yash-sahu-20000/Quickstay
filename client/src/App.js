import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home/Home.jsx';
import { List } from './pages/List/List.jsx';
import Hotel from './pages/Hotel/Hotel.jsx';
import Login from './pages/Login/Login.jsx';
import Reserve from './pages/Reserve/Reserve.jsx';
import 'react-notifications-component/dist/theme.css'
import Booking from './pages/Booking/Booking.jsx';
import Profile from './pages/Profile/Profile.jsx';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/hotels' element = {<List/>}/>
          <Route path='/hotels/:id' element = {<Hotel/>}/>
          <Route path='/login' element = {<Login type='login'/>}/>
          <Route path='/register' element = {<Login type='register'/>}/>
          <Route path='/reserve' element = {<Reserve />}/>
          <Route path='/booking' element = {<Booking />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/admin' element={<AdminDashboard />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
 