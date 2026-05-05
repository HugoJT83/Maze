import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { Link } from 'react-router-dom'
import Carousel from './components/Carousel'
library.add(fas, far)

const Home = () => {
  return (
    <>
      <div className='h-auto w-full bg-white-to-black from-white-to-black via-white-to-black via-40% to-indigo-to-yellow bg-radial-[125%_125%_at_50%_10%]'>
        <div className='flex flex-wrap lg:p-20'>
          {/* Información - Redirecciones */}
          <div className='p-10 text-center lg:text-justify lg:w-3/5'>
            <h1 className='text-6xl/25 w-fit font-Bitcount text-indigo-to-yellow'>¿Qué quieres hacer hoy?</h1>
            <h2 className='my-2 text-gray-to-yellow font-bold text-2xl'>Busca y organiza eventos cerca de ti</h2>

            <p className='my-10 text-xl text-justify'>
              Explora eventos, crea y comparte <span className='font-bold'>momentos únicos. </span>
              Desde MAZE buscamos ayudarte a gestionar desde pequeñas reuniones hasta
              grandes festivales, todo en un mismo lugar.
            </p>

            <p className='text-xl text-justify'>
              Crea una cuenta, indica tus gustos y te servimos lo que buscas en cuestión de segundos;
              no te preocupes, <span className='font-bold'>nosotros nos encargamos</span> de los pormenores y la logística.
            </p>

            <div className='flex justify-center gap-6 my-10'>
              <Link to={'/register'}>
                <button className='p-4 rounded-xl hover:cursor-pointer hover:scale-110 transition-all ease-in-out bg-indigo-to-yellow text-white-to-black'>Regisrarse ahora</button>
              </Link>

              <Link to={'/events'}>
                <button className='p-4 rounded-xl hover:cursor-pointer hover:scale-110 transition-all ease-in-out bg-white-to-black border-2 border-indigo-to-yellow text-indigo-to-yellow'>Buscar eventos</button>
              </Link>
            </div>
          </div>

          {/* Display de imagenes */}
          <div className='lg:w-2/5'>
            <Carousel images={['a', 'b', 'c']}></Carousel>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home