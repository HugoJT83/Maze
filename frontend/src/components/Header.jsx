import React, { useState } from 'react'
import logo from '../assets/app_logo.svg'
import { Link, useLocation } from 'react-router-dom'

/* FontAwesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { useSelector } from 'react-redux'
import { UserSlicePath } from '../redux/slice/user.slice'
import { useAuthContext } from '../context/AuthContext'
library.add(fas, far)
/* 
Para añadir un fontawesome:
<FontAwesomeIcon icon="fa-solid fa-house"></FontAwesomeIcon>
*/

import samplePhoto from "../assets/profile_photo.png"
import { INTERESTS_CONFIG } from '../constant/interestsConfig'

const Header = () => {

    const user = useSelector(UserSlicePath)
    const { logoutUser } = useAuthContext()

    const { pathname } = useLocation()
    const protectedRoute = ['/dashboard', '/profile']

    const interests = Object.values(INTERESTS_CONFIG).map(interest => interest.icon);

    const [currentIcon, setCurrentIcon] = useState(interests[0]);
    const handleMouseEnter = () => {
        const randomIndex = Math.floor(Math.random() * interests.length);
        if (interests[randomIndex] === currentIcon) {
            handleMouseEnter();
            return;
        }

        setCurrentIcon(interests[randomIndex]);
    };

    const localProfilePic = localStorage.getItem("google_profile_pic");
    const avatarSrc = user?.auth_method === "google" ? localProfilePic : user?.avatar || samplePhoto

    return (
        <>
            <header className="text-gray-600 body-font">
                <div className="flex min-w-full justify-between p-5">


                    {/* Logo */}
                    <Link to={'/'} className="flex items-center max-w-15">
                        <img src={logo} className='' alt="" />
                        <p className="text-3xl text-black-to-white font-Bitcount mt-2 ml-2 transition-[text-shadow] duration-300 hover:text-shadow-[6px_4px_0px]  hover:text-shadow-indigo-to-yellow">Maze</p>
                    </Link>

                    {/* Botones */}
                    <div className='flex items-center'>

                        {/* Boton registrarse */}
                        {user ?
                            <>
                                <Link to={'/dashboard'}>
                                    <button className="bg-indigo-to-yellow rounded-lg p-2 flex align-middle items-center text-white-to-black transition ease-in-out hover:bg-gray-300 m-2 hover:cursor-pointer">
                                        Dashboard
                                        <FontAwesomeIcon icon="fa-regular fa-rectangle-list" className='p-1'></FontAwesomeIcon>
                                    </button>
                                </Link>
                            </> :
                            <Link to={'/register'}>
                                <button className="bg-lightgray-to-yellow text-black rounded-lg p-2 flex items-center ease-in-out hover:bg-gray-300 hover:scale-110 transition-all m-2 hover:cursor-pointer">
                                    Registrarse
                                    <FontAwesomeIcon icon="fa-regular fa-user" className='p-1'></FontAwesomeIcon>
                                </button>
                            </Link>}

                        {/* Boton login/logout */}
                        {user ?
                            <>
                                <button onClick={logoutUser} className="bg-lightgray-to-yellow text-black rounded-lg p-2 flex items-center ease-in-out hover:bg-gray-300 hover:scale-110 transition-all m-2 hover:cursor-pointer">
                                    Cerrar sesión
                                    <FontAwesomeIcon icon="fa-regular fa-circle-xmark" className='p-1'></FontAwesomeIcon>
                                </button>
                            </> :
                            <Link to={'/login'}>
                                <button
                                    onMouseEnter={handleMouseEnter}
                                    className="bg-indigo-to-yellow text-white-to-black rounded-lg p-2 flex items-center ease-in-out hover:scale-110 transition-all m-2 hover:cursor-pointer"
                                >
                                    Iniciar Sesión
                                    <FontAwesomeIcon icon={currentIcon} className='p-1'></FontAwesomeIcon>
                                </button>
                            </Link>}

                        {user ?
                            <>
                                <Link to={'/profile'}>
                                    <div className='bg-white w-15 h-15 rounded-full ml-5 mr-5 hover:border-3 border-indigo-to-yellow'>
                                        <img src={avatarSrc} alt="" className='w-full h-full object-cover rounded-full' />
                                    </div>
                                </Link>
                            </> :
                            <>

                            </>
                        }
                    </div>

                </div>
            </header>

        </>
    )
}

export default Header