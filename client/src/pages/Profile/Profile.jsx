import React, { useState } from 'react'
import Navbar from '../../components/navbar/navbar'
import './Profile.css'
import { useSelector } from 'react-redux'
import { notification } from '../../utils/notification'
import axios from 'axios'
import { validateEmail } from '../../utils/functions'
import { baseUrl } from '../../config'

export default function Profile() {

    const user = useSelector(state => state.auth.user || null)

    const [username, setUsername] = useState(user.username || null)
    const [email, setEmail] = useState(user.email || null)
    const [mob, setMob] = useState(user.mobile || null)

    const handleUpdateButton = async() => {
        if (!validateEmail(email)){
            notification('Email ID','Please enter correct email','danger')            
        }
        else if (mob!=null && mob.length != 10){
            notification('Mobile','Please enter correct mobile number','danger')
        }
        else{
            const updatedUser = {
                username : username,
                email: email,
                mobile: mob
            }
            try {
                const res = await axios.put(`${baseUrl}/users/${user._id}`, updatedUser,
                {
                    withCredentials: true
                })
                if (res.status == 200){
                    notification('Updated','User details updated','success')
                }
            } catch (error) {
                notification('Fatal Error',`username already exist`,'danger')
            }
        }

    }
  return (
    <>
        <Navbar type='Login'/>
        <div className="profile">
            <div className="profileContainer">
                <div className="profileHeader">
                    My Profile
                </div>
                <div className="profileDetails">
                    <div className="profileDetailsItem">
                        <div className="profileDetailsItemLabel">
                            Username :
                        </div>
                        <div className="profileDetailsItemField">
                            <input className="profileDetailsItemFieldInput" type='text' placeholder={username} onChange={(event)=> setUsername(event.target.value)} />
                        </div>
                    </div>
                    <div className="profileDetailsItem">
                        <div className="profileDetailsItemLabel">
                            Email ID :  
                        </div>
                        <div className="profileDetailsItemField">
                            <input className="profileDetailsItemFieldInput" type='email' placeholder={email} onChange={(event)=> setEmail(event.target.value)}/>
                        </div>
                    </div>
                    <div className="profileDetailsItem">
                        <div className="profileDetailsItemLabel">
                            Mobile No :
                        </div>
                        <div className="profileDetailsItemField">
                            <input className="profileDetailsItemFieldInput" type='number' placeholder={mob} onChange={(event)=> setMob(event.target.value)}/>
                        </div>
                    </div>
                    <div className="profileDetailsItem">
                        <div className="profileDetailsItemLabel">
                            User ID :
                        </div>
                        <div className="profileDetailsItemField">
                            <input className="profileDetailsItemFieldInput" type='text' disabled={true} placeholder={user._id} />
                        </div>
                        <div className="profileDetailsItemDesc">Can not be changed</div>
                    </div>
                </div>
                <div className="profileUpdateButton" onClick={()=>{handleUpdateButton()}}>
                    Update
                </div>
            </div>
        </div>
    </>
  )
}
