import React from 'react'

const Terms = () => {
    return (
        <>
            <div className='w-full flex flex-col items-center justify-center bg-lightgray-to-yellow text-center p-10'>
                <h1 className='font-bold text-5xl text-black'>TÉRMINOS Y CONDICIONES</h1>
            </div>


            <div className='lg:pt-20 lg:px-40 pt-10 px-8 text-justify justify-items-center'>

                <p>
                    Bienvenido a MAZE. Al utilizar nuestra plataforma y, específicamente, al acceder al apartado de
                    "Crear Evento", usted acepta quedar vinculado por los siguientes términos y condiciones. Por favor,
                    léalos detenidamente.
                </p>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>1. OBJETO DE LA PLATAFORMA</h1>
                    <p>
                        MAZE es una herramienta tecnológica que permite a los usuarios registrados crear, publicar y
                        gestionar eventos locales, así como permitir la inscripción de otros usuarios en los mismos.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>2. REGISTRO Y RESPONSABILIDAD DE LA CUENTA</h1>
                    <p>
                        Para crear un evento, el usuario debe poseer una cuenta activa y un perfil completado. El usuario es
                        el único responsable de la veracidad de los datos de su perfil y de mantener la confidencialidad de
                        sus credenciales de acceso.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>3. CONDICIONES DE CREACIÓN DE EVENTOS</h1>
                    <p className='my-2'>
                        Al enviar un formulario en el apartado "Crear Evento", el usuario garantiza que:
                    </p>
                    <ul className='list-disc pl-5'>
                        <li>
                            La información proporcionada (título, descripción, fecha y lugar) es precisa y no induce a error.
                        </li>
                        <li>
                            Posee los derechos necesarios sobre cualquier contenido multimedia (imágenes) que suba a
                            través de la plataforma (integración con Cloudinary).
                        </li>
                        <li>
                            El evento no promueve actividades ilegales, discursos de odio, violencia o discriminación.
                        </li>
                    </ul>
                    <div className='w-full my-5 bg-lightgray-to-yellow text-black italic p-5'>
                        <p>
                            <span className='font-bold'>Proceso de Verificación:</span> Todo evento creado quedará inicialmente en estado "Pendiente". MAZE se
                            reserva el derecho de revisar y confirmar el evento a través de sus administradores antes de su publicación
                            definitiva en el feed público.
                        </p>
                    </div>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>4. DERECHOS SOBRE EL CONTENIDO</h1>
                    <p>
                        El usuario conserva la propiedad de los contenidos que publica. Sin embargo, al crear un evento en
                        MAZE, concede a la plataforma una licencia gratuita y no exclusiva para mostrar, distribuir y
                        promocionar dicho contenido dentro del ecosistema de la aplicación.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>5. INSCRIPCIÓN Y GESTIÓN DE ASISTENTES</h1>
                    <p>
                        MAZE facilita el sistema de registro de asistentes. El organizador del evento se compromete a tratar
                        los datos de los usuarios inscritos exclusivamente para la gestión del evento específico, cumpliendo
                        con la Política de Privacidad de la plataforma.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>6. MODIFICACIÓN Y CANCELACIÓN</h1>
                    <p>
                        MAZE se reserva el derecho de modificar, suspender o eliminar cualquier evento que, a juicio de los
                        administradores, infrinja estos términos, sin previo aviso y sin derecho a indemnización alguna.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>7. LIMITACIÓN DE RESPONSABILIDAD</h1>
                    <p>
                        MAZE actúa únicamente como intermediario tecnológico. No somos responsables de la organización
                        física, seguridad o calidad de los eventos publicados por los usuarios, ni de los incidentes que
                        pudieran ocurrir durante el desarrollo de los mismos.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>8. CONTACTO Y RECLAMACIONES</h1>
                    <p>
                        Para cualquier duda relativa a estos términos, puede dirigirse a: <a href="mailto:hugojariod77@gmail.com" className='italic text-indigo-to-yellow underline'>hugojariod77@gmail.com</a>
                    </p>
                </div>

                <div className='w-full my-5 text-center text-gray-to-yellow border-t-2 pt-5 border-gray-to-yellow'>
                    <p>
                        Última actualización: 08/05/2026 | © 2026 Proyecto MAZE                    </p>
                </div>

            </div>
        </>
    )
}

export default Terms