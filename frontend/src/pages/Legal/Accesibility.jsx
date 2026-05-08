import React from 'react'

const Accesibility = () => {
    return (
        <>
            <div className='w-full flex flex-col items-center justify-center bg-lightgray-to-yellow text-center p-10'>
                <h1 className='font-bold text-5xl text-black'>Declaración de accesibilidad</h1>
                <h2 className='italic text-2xl my-2 text-black'>Compromiso de MAZE con la inclusión digital</h2>
            </div>

            <div className='lg:pt-20 lg:px-40 pt-10 px-8 text-justify justify-items-center'>
                <p>
                    MAZE se ha comprometido a hacer accesible su sitio web de conformidad
                    con el Real Decreto 1112/2018, de 7 de septiembre, sobre accesibilidad de los sitios web y
                    aplicaciones para dispositivos móviles del sector público, o estándares equivalentes como las
                    <span className='font-bold'> WCAG 2.1 (Nivel AA).</span>
                </p>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>1. SITUACION DE CUMPLIMIENTO</h1>
                    <p className='my-2'>
                        Este sitio web es <span className='font-bold'>parcialmente</span> conforme con los estándares de accesibilidad mencionados debido
                        a las excepciones y faltas de conformidad que se indican a continuación.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>2. CONTENIDO NO ACCESIBLE</h1>
                    <p className='my-2'>
                        El contenido que se recoge a continuación no es accesible por lo siguiente:
                    </p>
                    <ul className='list-disc pl-5'>
                        <li>
                            <span className='font-bold'>Contenido de terceros:</span> El portal permite la subida de imágenes por parte de los usuarios
                            para sus eventos. Es posible que algunas de estas imágenes no cuenten con un texto
                            alternativo (alt text) descriptivo adecuado.
                        </li>
                        <li>
                            <span className='font-bold'>Mapas y geolocalización:</span> Algunos elementos de interacción con mapas complejos pueden
                            presentar dificultades para la navegación exclusiva mediante teclado o lectores de pantalla.
                        </li>
                        <li>
                            <span className='font-bold'>Animaciones:</span> Componentes visuales como contadores numéricos pueden resultar
                            distractores para ciertos usuarios, aunque se han implementado mecanismos para que su
                            lectura sea clara.
                        </li>

                    </ul>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>3. MEDIDAS ADOPTADAS</h1>
                    <ul className='list-disc pl-5'>
                        <li className='my-1'>
                            <span className='font-bold'>Estructura Semántica:</span> Uso correcto de etiquetas HTML5 para facilitar la navegación a
                            los lectores de pantalla.
                        </li>
                        <li className='my-1'>
                            <span className='font-bold'>Navegación por teclado:</span> Se han revisado los focos de los formularios de creación de
                            eventos y perfiles para asegurar que son operables sin ratón.
                        </li>
                        <li className='my-1'>
                            <span className='font-bold'>Contraste de Color:</span> Aplicación de paleta de color alternativa que cumple con
                            los ratios de contraste exigidos para texto y elementos de interfaz.
                        </li>
                        <li className='my-1'>
                            <span className='font-bold'>Estados de Carga:</span> Implementación de indicadores visuales y técnicos durante las
                            transiciones de rutas protegidas y procesos de subida de imágenes.
                        </li>
                        <li className='my-1'>
                            <span className='font-bold'>Textos Claros:</span> Uso de un lenguaje sencillo en los formularios y mensajes de éxito.
                        </li>
                    </ul>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>4. PREPARACIÓN DE LA DECLARACIÓN</h1>
                    <p>
                        La presente declaración fue preparada el 08/05/2026. El método empleado para la misma
                        ha sido una autoevaluación realizada por el equipo de desarrollo, verificando los flujos principales de
                        registro, creación de eventos y búsqueda por temática.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>5. OBSERVACIONES Y DATOS DE CONTACTO</h1>
                    <p className='my-2'>
                        Si usted encuentra barreras de accesibilidad o necesita asistencia con algún contenido del portal,
                        puede ponerse en contacto con nosotros a través de:
                    </p>
                    <ul className='list-disc pl-5'>
                        <li>
                            <span className='font-bold'>Correo electrónico: </span>
                            <a href="mailto:hugojariod77@gmail.com" className='italic text-indigo-to-yellow underline'>hugojariod77@gmail.com</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Accesibility