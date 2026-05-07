import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas, far)

import { Link } from 'react-router-dom'
import ImageCarousel from './components/ImageCarousel'
import InterestFilter from './components/InterestFilter'
import InterestCarousel from './components/InterestCarousel'
import PlaceFilter from './components/PlaceFilter'
import Counter from './components/Counter'


const Home = () => {

  const placeholders = ['https://placehold.co/700x400', 'https://placehold.co/700x400', 'https://placehold.co/700x400', 'https://placehold.co/700x400'];
  const sectionOnePhotos = ['imgs/photoSection1-1.webp', 'imgs/photoSection1-2.webp', 'imgs/photoSection1-3.webp', 'imgs/photoSection1-4.webp', 'imgs/photoSection1-5.webp'];
  const sectionTwoPhotos = ['imgs/photoSection2-1.webp', 'imgs/photoSection2-2.webp', 'imgs/photoSection2-3.webp', 'imgs/photoSection2-4.webp', 'imgs/photoSection2-5.webp'];
  return (
    <>
      {/* SECCION 1 */}
      <div className='h-auto w-full bg-white-to-black from-white-to-black via-white-to-black via-40% to-indigo-to-yellow bg-radial-[125%_125%_at_50%_10%]'>

        <div className='flex flex-wrap lg:p-20 justify-center'>

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
          <div className='lg:w-2/5 w-4/5 my-auto'>
            <ImageCarousel images={sectionOnePhotos}></ImageCarousel>
          </div>
        </div>



      </div>

      {/* SECCION 2 - Buscador por tematica */}
      <div className='bg-indigo-to-yellow min-h-110 lg:p-20 p-5'>

        <div className='mb-20'>
          <h1 className='text-5xl font-Bitcount text-center md:text-left text-white-to-black'>Busca por temáticas...</h1>
          <h2 className='mb-8 text-2xl text-center md:text-left text-lightgray-to-black'>Elige un tema de tu interés y busca eventos a tu gusto</h2>
          <p className='my-2 text-lg  text-white-to-black lg:w-2/3 text-center md:text-left'>Desde MAZE te ofrecemos un filtrado rápido y efectivo de experiencias según tus intereses personales; ya sea tecnología, arte o deportes, conecta directamente con comunidades y actividades que te importan.  </p>
        </div>

        <div className='flex justify-center'>
          <InterestCarousel></InterestCarousel>
        </div>
      </div>


      {/* SECCION 3 - Buscador por lugar */}
      <div className='lg:p-20 p-5 flex flex-wrap justify-center'>
        <div className='lg:w-1/3 mx-auto'>
          <ImageCarousel images={sectionTwoPhotos}></ImageCarousel>
        </div>

        <div className=' text-center flex flex-col justify-between w-2/3'>
          <div className='lg:justify-items-end lg:text-end text-center justify-items-center'>
            <h1 className='text-5xl font-Bitcount text-indigo-to-yellow'>...O busca por zonas</h1>
            <h2 className='text-2xl mb-8 opacity-70 text-indigo-to-yellow'>Indica provincia y ciudad, y nosotros hacemos el resto</h2>
            <p className='my-2 text-lg lg:w-3/4  text-indigo-to-yellow'>Seas de donde seas y vayas a donde vayas, desde MAZE te ofrecemos cobertura total a nivel nacional para que vivas nuevas experiencias y conectes con otras personas.</p>
          </div>


          <div className='lg:my-6 justify-items-center lg:justify-items-end'>
            <PlaceFilter></PlaceFilter>
          </div>
        </div>
      </div >

      {/* Sección 4 - Stats y About */}
      < div className='bg-lightgray-to-yellow lg:p-20 p-5 flex justify-around flex-wrap gap-10' >
        <div className='w-full flex justify-center items-center text-center md:text-left flex-wrap'>
          <div>
            <h1 className='text-5xl font-Bitcount text-black'>Conócenos</h1>
            <h2 className='text-2xl opacity-70 text-black'>Los datos detrás de MAZE</h2>
          </div>

          <div className='border-l-2 border-black h-20 mx-5 not-md:hidden'></div>

          <button className='p-3 bg-white-to-black border-2 rounded-xl my-5 md:my-0  border-black text-black-to-white hover:cursor-pointer hover:scale-110 transition-all ease-in-out'>
            Sobre nosotros
          </button>

        </div>

        <Counter text={'Eventos registrados'} targetCounter={100} />
        <Counter text={'Usuarios activos'} targetCounter={300} />
        <Counter text={'Entradas vendidas'} targetCounter={4000} />
      </div >
    </>
  )
}

export default Home