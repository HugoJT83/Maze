import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'
library.add(fas, far, fab)

export const About = () => {
    return (
        <>
            <div className='w-full  flex justify-around bg-lightgray-to-yellow py-10 flex-wrap text-center'>
                <div className='flex flex-col'>
                    <h1 className='font-bold text-5xl text-black'>Qué es MAZE</h1>
                    <h2 className='italic text-2xl my-2 text-black'>Conoce más sobre nosotros</h2>
                </div>

                <div className='items-center align-middle flex'>
                    <img src={'/imgs/app_logo.ico'} />
                </div>
            </div>

            <div className='lg:py-20 lg:px-40 pt-10 px-8 text-justify'>
                <h1 className='font-bold text-4xl my-1'>Quiénes somos</h1>
                <h2 className='italic text-gray-to-yellow'>"Descubre, Conecta, Disfruta"</h2>
                <p className='mt-3'>
                    Somos un equipo apasionado por la tecnología y la comunidad, dedicados a derribar las barreras entre las personas y las experiencias que las definen. En MAZE, creemos que cada evento es una oportunidad para conectar, aprender y crecer, por lo que hemos diseñado un ecosistema digital donde descubrir tu próximo gran plan es tan sencillo como un clic.
                </p>
            </div>

            <div className='w-full  grid sm:grid-cols-3 grid-cols-1 gap-10 p-10 lg:px-40 bg-indigo-to-yellow'>
                <div className='flex flex-col items-center'>
                    <div className='bg-white-to-black rounded-full flex items-center justify-center w-25 h-25'>
                        <FontAwesomeIcon icon={'fa-solid fa-trophy'} className='text-4xl text-indigo-to-yellow'></FontAwesomeIcon>
                    </div>
                    <h1 className='my-2 font-bold text-2xl text-white-to-black'>Misión</h1>
                    <p className='text-justify text-white-to-black'>Nuestra misión es proporcionar una plataforma tecnológica intuitiva y segura que elimine las fricciones en la organización de eventos. Buscamos empoderar a los creadores de contenido y organizadores locales, dándoles las herramientas necesarias para transformar sus ideas en realidades accesibles para toda la comunidad.</p>
                </div>
                <div className='flex flex-col items-center'>
                    <div className='bg-white-to-black rounded-full flex items-center justify-center w-25 h-25'>
                        <FontAwesomeIcon icon={'fa-solid fa-eye'} className='text-4xl text-indigo-to-yellow'></FontAwesomeIcon>
                    </div>
                    <h1 className='my-2 font-bold text-2xl text-white-to-black'>Visión</h1>
                    <p className='text-justify text-white-to-black'>Aspiramos a ser la primera opción para cualquier persona que busque enriquecer su tiempo libre, integrando innovación tecnológica y accesibilidad. Queremos que MAZE sea sinónimo de una comunidad vibrante donde ningún evento pase desapercibido y ninguna pasión se quede sin su espacio.</p>
                </div>
                <div className='flex flex-col items-center'>
                    <div className='bg-white-to-black rounded-full flex items-center justify-center w-25 h-25'>
                        <FontAwesomeIcon icon={'fa-solid fa-heart'} className='text-4xl text-indigo-to-yellow'></FontAwesomeIcon>
                    </div>
                    <h1 className='my-2 font-bold text-2xl text-white-to-black'>Valores</h1>
                    <p className='text-justify text-white-to-black'>MAZE se basa en la inclusión y accesibilidad universal, asegurando que la plataforma sea funcional para todos. La transparencia en la gestión de eventos y la seguridad de datos generan un entorno de confianza, mientras que la innovación constante fortalece el tejido social al conectar a la comunidad con experiencias locales significativas.</p>
                </div>
            </div>

            <div className='lg:pt-20 lg:px-40 pt-10 px-8 flex not-sm:flex-wrap-reverse'>
                <div className='w-full justify-items-center my-auto not-sm:my-5'>
                    <img src={'/imgs/creator_photo.webp'} className='rounded-full h-30 w-30' />
                    <div className='flex justify-around gap-5 my-2'>
                        <a href="https://linkedin.com/in/hugo-jariod-tomas-15a39b3b2" target='_blank'>
                            <FontAwesomeIcon icon={"fa-brands fa-linkedin"} className='text-2xl'></FontAwesomeIcon>
                        </a>
                        <a href="https://github.com/HugoJT83" target='_blank'>
                            <FontAwesomeIcon icon={"fa-brands fa-github"} className='text-2xl'></FontAwesomeIcon>
                        </a>
                    </div>
                </div>
                <div className=''>
                    <h1 className='font-bold text-4xl my-1 text-end'>Su creador</h1>
                    <h2 className='italic text-gray-to-yellow text-end'>"Programitas Enjoyer"</h2>
                    <p className='mt-3 text-justify'>
                        ¡Hola!, soy Hugo Jariod, el creador de MAZE. Desarrollé esta aplicación como proyecto de final de grado superior de Desarrollo de Aplicaciones Web (DAW) en el instituto CPIFP Los Enlaces. Mi objetivo con el proyecto era ayudar a crear un sistema sencillo y útil para mejorar la capacidad de las personas de encontrar a otras con sus mismos gustos y poder formar experiencias inolvidables,
                        aprovechando el potencial de la era digital en la que vivimos. ¡Espero que sea de tu agrado!
                    </p>
                </div>

            </div>
        </>
    )
}
