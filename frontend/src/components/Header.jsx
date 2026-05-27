import React, { useState } from 'react'
import logo from '../assets/icono_transparent.png'
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

import samplePhoto from "../assets/profile_photo.png"
import { INTERESTS_CONFIG } from '../constant/interestsConfig'

const Header = () => {

    const user = useSelector(UserSlicePath)
    const { logoutUser } = useAuthContext()

    const { pathname } = useLocation()
    const [isOpen, setIsOpen] = useState(false)

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

    const avatarSrc = user?.avatar || samplePhoto

    const handleLogout = () => {
        logoutUser();
        setIsOpen(false);
    }

    return (
        <>
            <header className="text-gray-600 body-font relative z-50">
                <div className="flex min-w-full justify-between items-center p-5">

                    {/* Logo */}
                    <Link to={'/'} className="flex items-center max-w-15" onClick={() => setIsOpen(false)}>
                        <img src={logo} className='' alt="" />
                        <p className="text-3xl text-black-to-white font-Bitcount mt-2 ml-2 transition-[text-shadow] duration-300 hover:text-shadow-[6px_4px_0px]  hover:text-shadow-indigo-to-yellow">Maze</p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className='hidden md:flex items-center'>

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
                                    <div className='bg-white w-15 h-15 rounded-full ml-5 mr-5 hover:border-3 border-indigo-to-yellow overflow-hidden'>
                                        <img src={avatarSrc} alt="" className='w-full h-full object-cover' />
                                    </div>
                                </Link>
                            </> :
                            <>

                            </>
                        }
                    </div>

                    {/* Mobile Navigation Toggle */}
                    <div className="flex md:hidden items-center">
                        {user && (
                            <Link to={'/profile'} onClick={() => setIsOpen(false)}>
                                <div className='bg-white w-11 h-11 rounded-full mr-3 border-2 border-indigo-to-yellow overflow-hidden hover:scale-105 transition-transform'>
                                    <img src={avatarSrc} alt="" className='w-full h-full object-cover' />
                                </div>
                            </Link>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-indigo-to-yellow text-white-to-black rounded-lg p-2.5 flex items-center justify-center hover:cursor-pointer hover:bg-gray-300 transition-all focus:outline-none"
                            aria-label="Toggle Menu"
                        >
                            <FontAwesomeIcon icon={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"} className="text-xl" />
                        </button>
                    </div>

                </div>

                {/* Collapsible Mobile Drawer */}
                {isOpen && (
                    <div className="md:hidden absolute top-20 left-5 right-5 bg-lightgray-to-black border-2 border-indigo-to-yellow rounded-2xl p-5 shadow-2xl flex flex-col items-center gap-4 transition-all duration-300 ease-in-out z-50">
                        {user ? (
                            <>
                                <Link to={'/profile'} onClick={() => setIsOpen(false)} className="flex flex-col items-center mb-2">
                                    <div className='bg-white w-16 h-16 rounded-full border-3 border-indigo-to-yellow overflow-hidden mb-2'>
                                        <img src={avatarSrc} alt="" className='w-full h-full object-cover' />
                                    </div>
                                    <span className="text-black-to-white font-Bitcount text-lg">{user.name || "Usuario"}</span>
                                </Link>

                                <Link to={'/dashboard'} onClick={() => setIsOpen(false)} className="w-full">
                                    <button className="bg-indigo-to-yellow rounded-lg p-3 w-full flex items-center justify-center text-white-to-black transition ease-in-out hover:bg-gray-300 hover:cursor-pointer font-Bitcount text-lg">
                                        Dashboard
                                        <FontAwesomeIcon icon="fa-regular fa-rectangle-list" className='ml-2'></FontAwesomeIcon>
                                    </button>
                                </Link>

                                <button onClick={handleLogout} className="bg-lightgray-to-yellow text-black rounded-lg p-3 w-full flex items-center justify-center ease-in-out hover:bg-gray-300 transition-all hover:cursor-pointer font-Bitcount text-lg">
                                    Cerrar sesión
                                    <FontAwesomeIcon icon="fa-regular fa-circle-xmark" className='ml-2'></FontAwesomeIcon>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to={'/register'} onClick={() => setIsOpen(false)} className="w-full">
                                    <button className="bg-lightgray-to-yellow text-black rounded-lg p-3 w-full flex items-center justify-center ease-in-out hover:bg-gray-300 transition-all hover:cursor-pointer font-Bitcount text-lg">
                                        Registrarse
                                        <FontAwesomeIcon icon="fa-regular fa-user" className='ml-2'></FontAwesomeIcon>
                                    </button>
                                </Link>

                                <Link to={'/login'} onClick={() => setIsOpen(false)} className="w-full">
                                    <button
                                        onMouseEnter={handleMouseEnter}
                                        className="bg-indigo-to-yellow text-white-to-black rounded-lg p-3 w-full flex items-center justify-center ease-in-out hover:bg-gray-300 transition-all hover:cursor-pointer font-Bitcount text-lg"
                                    >
                                        Iniciar Sesión
                                        <FontAwesomeIcon icon={currentIcon} className='ml-2'></FontAwesomeIcon>
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </header>
        </>
    )
}

export default Header