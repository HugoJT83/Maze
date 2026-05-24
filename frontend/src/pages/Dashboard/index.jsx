import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas, far)
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'

export const Dashboard = () => {



  const { user } = useAuthContext();
  const isAdmin = user?.role === "ADMIN"

  return (

    <>
      <section className="text-black body-font">
        <div className="container px-5 py-18 mx-auto">


          <div className="flex flex-wrap -m-4">

            {/* Contenedor 1 - Ver eventos */}
            <div className="p-4 lg:w-1/4">
              <Link to={'/events'}>
                <div className="h-full bg-lightgray-to-yellow bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative transition ease-in-out hover:scale-105 hover:bg-indigo-to-yellow hover:text-white-to-black hover:cursor-pointer">
                  <FontAwesomeIcon icon="fa-solid fa-magnifying-glass-location" className='text-6xl m-3' />
                  <h1 className="sm:text-2xl text-xl font-medium mb-3 font-Bitcount mt-2">Ver eventos disponibles</h1>
                  <p className="leading-relaxed mb-3">
                    Consulta los eventos programados por otras personas, tanto cerca de tí como aplicando filtros por zona.
                    <span className='font-bold'> ¡No te pierdas nada!</span>
                  </p>
                </div>
              </Link>
            </div>

            {/* Contenedor 2 - Crear Eventos */}
            <div className="p-4 lg:w-1/4">
              <Link to={'/events/create-event'}>
                <div className="h-full bg-lightgray-to-yellow bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative transition ease-in-out hover:scale-105 hover:bg-indigo-to-yellow hover:text-white-to-black hover:cursor-pointer">
                  <FontAwesomeIcon icon="fa-solid fa-calendar-plus" className='text-6xl m-3' />
                  <h1 className="title-font sm:text-2xl text-xl font-medium mb-3 font-Bitcount mt-2">Crear un evento</h1>
                  <p className="leading-relaxed mb-3">
                    Crea un evento: elige una actividad, indica la temática, pon una fecha y una hora y nosotros nos encargaremos del resto.
                    <span className='font-bold'> Busca gente con tus mismos intereses</span> cerca de tí.
                  </p>
                </div>
              </Link>
            </div>


            {/* Contenedor 3 - administrar eventos */}

            <div className="p-4 lg:w-1/4">
              {isAdmin ?
                (
                  <Link to={'/manage-events'}>
                    <div className="h-full bg-lightgray-to-yellow bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative transition ease-in-out hover:scale-105 hover:bg-indigo-to-yellow hover:text-white-to-black hover:cursor-pointer">
                      <FontAwesomeIcon icon="fa-solid fa-screwdriver-wrench" className='text-6xl m-3' />
                      <h1 className="title-font sm:text-2xl text-xl font-medium mb-3 font-Bitcount mt-2">Panel de control</h1>
                      <p className="leading-relaxed mb-3">
                        Obtén datos de la aplicación todo en una misma sección. Aprueba eventos, mira estadísticas y otras herramientas.
                      </p>
                    </div>
                  </Link>

                ) :
                (<Link to={'/my-events'}>
                  <div className="h-full bg-lightgray-to-yellow bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative transition ease-in-out hover:scale-105 hover:bg-indigo-to-yellow hover:text-white-to-black hover:cursor-pointer">
                    <FontAwesomeIcon icon="fa-solid fa-list-check" className='text-6xl m-3' />
                    <h1 className="title-font sm:text-2xl text-xl font-medium mb-3 font-Bitcount mt-2">Mis eventos</h1>
                    <p className="leading-relaxed mb-3">
                      Gestiona lo que necesites. Aquí podrás
                      <span className='font-bold'> consultar los eventos a los que estás apuntado,</span> así como aquellos que has publicado.
                    </p>
                  </div>
                </Link>
                )}

            </div>

            {/* Contenedor 4 - Mi perfil*/}

            <div className="p-4 lg:w-1/4">
              <Link to={'/profile'}>
                <div className="h-full bg-lightgray-to-yellow bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative transition ease-in-out hover:scale-105 hover:bg-indigo-to-yellow hover:text-white-to-black hover:cursor-pointer">
                  <FontAwesomeIcon icon="fa-solid fa-circle-user" className='text-6xl m-3' />
                  <h1 className="title-font sm:text-2xl text-xl font-medium mb-3 font-Bitcount mt-2">Mi perfil</h1>
                  <p className="leading-relaxed mb-3">Edita tu información personal, así como tus intereses; estos nos permitirán <span className='font-bold'>recomendarte justo lo que buscas.</span> ¡Muy oportuno!</p>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
