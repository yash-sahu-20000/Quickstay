import React, { useEffect, useState } from 'react'
import './navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/authReducer/authReducer'
import { resetSearch } from '../../redux/searchReducer/searchReducer'
import { ReactNotifications } from 'react-notifications-component'
import axios from 'axios'

function Navbar(props) {

  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const user = auth.user 
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const handleLogout = () => {
    dispatch(logout())
    dispatch(resetSearch())
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleProfileClick = () => {
    navigate('/profile')
  }
  const handleBookingClick = () => {
    navigate('/booking')
  }
  const handleDashboard= () =>{
    navigate('/admin')
  }

  useEffect(()=>{
    const fetchAdminStatus = async () => {
        try {
            const res = await axios.get(`/auth/isAdmin`,
      {
        withCredentials: true
      });
            if (res.status === 200) {
                setIsAdmin(true);
            }
        } catch (error) {
            setIsAdmin(false);
        }
    };
    fetchAdminStatus();
},[])

  return (
  <>
    <div className='navBar' >
        <div className="navBarContainer">
            <Link to={'/'} style={{color:'inherit', textDecoration:'None'}}>
              <div className='navBarLogo'>Quickstay.com</div>
            </Link>
            {
              user !== null ? 
              <>
              <div className={props.type == 'login' ? 'navBarItems login' : 'navBarItems'}>
                <div className="navBarUsername" onClick={()=>{setOpenMenu(!openMenu)}} >Hi, {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
                {openMenu && 
                  <div className="navMenu">
                    <div className="navMenuItems">
                      <div className="navMenuItem" onClick={()=>{handleProfileClick()}}>My Profile</div>
                      <div className="navMenuItem" onClick={()=>{handleBookingClick()}}>My Bookings</div>
                    </div>
                  </div>
                }</div>
                
                {isAdmin && window.location.pathname != '/admin'  && <button className='navBarButton' onClick={()=>{handleDashboard()}}>Dashboard</button>}
                <button className='navBarButton' onClick={()=>{handleLogout()}}>Logout</button>
              </div>
              </>
              :
              <div className={props.type == 'login' ? 'navBarItems login' : 'navBarItems'}>
            <Link to={'/login'} style={{color:'inherit', textDecoration:'None'}}>
                <button className='navBarButton'>Login</button>
            </Link>
            <Link to={'/register'} style={{color:'inherit', textDecoration:'None'}}>
              <button className='navBarButton'>Register</button>
            </Link>
            </div>
            }
        </div>
    </div>
    <ReactNotifications/>
  </>
  )
}

export default Navbar