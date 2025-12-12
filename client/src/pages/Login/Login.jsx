import React, { useEffect, useState } from 'react'
import Navbar from '../../components/navbar/navbar';
import './Login.css'
import { CiUser } from 'react-icons/ci';
import { PiPasswordBold } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loginFailure, loginStart, loginSuccess } from '../../redux/authReducer/authReducer';
import { MdEmail } from 'react-icons/md';
import { notification } from '../../utils/notification';

function Login(props) {

  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null)
  const [emailId, setEmailId] = useState(null)
  const [password, setPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)

  const [adminLogin, setAdminLogin] = useState(false)


  const handleLoginButton = async () => {
    dispatch(loginStart())
    try {
      const user = await axios.post(`/auth/login`,{
        username: userId,
        password: password
      })
      dispatch(loginSuccess(user.data))
      localStorage.setItem('user',JSON.stringify(user.data))
      
      adminLogin ? navigate('/admin') : navigate('/')
      
    } catch (error) {
      dispatch(loginFailure(error.response.data.message))
      notification('Error',`${error.response.data.message}`,'danger')
    }
  }
  const handleRegister = async () => {
    try {
      if (confirmPassword !== password){
        notification('Error',`Password does NOT match.`,'danger')
      }
      else{
        const isRegistered = await axios.post(`/auth/register`,{
          username: userId,
          email: emailId,
          isAdmin: false,
          password: password
        })
        if (isRegistered.status == '200' && isRegistered.data == 'User registered.'){
          notification('Registered',`User Registered Successfully`,'success')
        }
      }
      
    } catch (error) {
      notification('Error',`Please contact Admin ${error}`,'danger')
    }
  }

  return (
    <>
      <Navbar type={'login'}/>
      {
        props.type === 'login' ?       
        <div className="login">
        <div className="loginContainer">
          <div className="loginBox">
            <div className="loginHeader">
              { adminLogin ? 'Sign in as Administrator' : 'Sign in'} 
            </div>
            <div className="loginSubHeader">
              { adminLogin ? 'You can sign in using your admin account to manage and access QuickStay\'s administrative services.':'You can sign in using your QuickStay.com account to access our services.'}
            </div>
            <div className="loginSearchBar">
                <div className="loginSearchBarItem">
                    <div className='loginSearchBarIcon'><CiUser/></div>
                    <input className="loginSearchInput" type='text' placeholder='Email ID' onChange={(event)=>{setUserId(event.target.value)}} />
                  </div>
                <div className="loginSearchBarItem">
                    <div className='loginSearchBarIcon'><PiPasswordBold /></div>
                    <input className="loginSearchInput" type='password' placeholder='Password' onChange={(event)=>{setPassword(event.target.value)}} />
                  </div>
            <div/>
          </div>
          <div className="loginButton" onClick={()=>{handleLoginButton()}}>Login</div>
          <Link to={'/register'} style={{color:'inherit', textDecoration:'none'}}>
            <div className="loginRegisterLink">Click here to Register...</div>
          </Link>
            <div className="loginRegisterLink" onClick={()=> {setAdminLogin(!adminLogin)}}>Click here if you are {adminLogin ? 'user':'admin'}...</div>
        </div>
        </div>
      </div> :
      <div className="login">
        <div className="loginContainer">
          <div className="loginBox">
            <div className="loginHeader">
              Create an account !
            </div>
            <div className="loginSubHeader">
              You can register using your QuickStay.com account to access our services.
            </div>
            <div className="loginSearchBar">
                <div className="loginSearchBarItem">
                    <div className='loginSearchBarIcon'><CiUser/></div>
                    <input className="loginSearchInput" type='text' placeholder='Username' onChange={(event)=>{setUserId(event.target.value)}} />
                  </div>
                <div className="loginSearchBarItem">
                    <div className='loginSearchBarIcon'><MdEmail/></div>
                    <input className="loginSearchInput" type='email' placeholder='Email ID' onChange={(event)=>{setEmailId(event.target.value)}} />
                  </div>
                <div className="loginSearchBarItem">
                    <div className='loginSearchBarIcon'><PiPasswordBold /></div>
                    <input className="loginSearchInput" type='password' placeholder='Password' onChange={(event)=>{setPassword(event.target.value)}} />
                  </div>
                <div className="loginSearchBarItem">
                    <div className='loginSearchBarIcon'><PiPasswordBold /></div>
                    <input className="loginSearchInput" type='password' placeholder='Confirm Password' onChange={(event)=>{setConfirmPassword(event.target.value)}} />
                  </div>
            <div/>
          </div>
          <div className="loginButton" onClick={()=>{handleRegister()}}>Register</div>
        <Link to={'/login'} style={{color:'inherit', textDecoration:'none'}}>
            <div className="loginRegisterLink">Click here to login...</div>
          </Link>
        </div>
        </div>
      </div>
      }

    </>
    
  )
}

export default Login