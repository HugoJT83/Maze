import React, { useEffect } from 'react'
import logo from '../assets/app_logo.svg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { Link, useLocation } from 'react-router-dom'
library.add(fas, far)

const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  }

  return (
    <>
      <footer>
        <div className="container py-24 mx-auto flex justify-between md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="w-80 md:mx-0 mx-auto text-center md:text-left">
            <Link to={'/'} className='flex items-center'>
              <img src={logo} alt="" className='w-15 h-15' />
              <span className='text-3xl font-Bitcount mt-2 ml-2 text-black-to-white'>Maze</span>
            </Link>
            <p className="mt-2 text-sm text-gray-to-yellow">©{new Date().getFullYear()}, MAZE. Todos los derechos reservados.</p>
          </div>
          <div className="flex grow justify-end flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="tracking-widest text-sm mb-3">NAVEGACIÓN</h2>
              <nav className="list-none mb-10">
                <li className='my-1'>
                  <Link to={'/register'} className=' text-gray-to-yellow hover:text-indigo-to-yellow'>Registrarse</Link>
                </li>
                <li className='my-1'>
                  <Link to={'/login'} className=' text-gray-to-yellow hover:text-indigo-to-yellow'>Iniciar Sesión</Link>
                </li>
                <li className='my-1'>
                  <Link to={'/events'} className=' text-gray-to-yellow hover:text-indigo-to-yellow'>Eventos</Link>
                </li>
                <li className='my-1'>
                  <Link to={'/about'} className=' text-gray-to-yellow hover:text-indigo-to-yellow'>Sobre nosotros</Link>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="tracking-widest text-sm mb-3">LEGAL</h2>
              <nav className="list-none mb-10">
                <li className='my-1'>
                  <Link to={'/legal'} onClick={scrollToTop()} className=' text-gray-to-yellow hover:text-indigo-to-yellow'>Aviso Legal</Link>
                </li>
                <li className='my-1'>
                  <Link to={'/privacy-policy'} onClick={scrollToTop()} className=' text-gray-to-yellow hover:text-indigo-to-yellow'>Política de privacidad</Link>
                </li>
                <li className='my-1'>
                  <Link to={'/accessibility'} onClick={scrollToTop()} className=' text-gray-to-yellow hover:text-indigo-to-yellow'>Accesibilidad</Link>
                </li>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer