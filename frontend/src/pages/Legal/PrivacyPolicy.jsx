import React from 'react'

const PrivacyPolicy = () => {
    return (
        <>
            <div className='w-full flex flex-col items-center justify-center bg-lightgray-to-yellow text-center p-10'>
                <h1 className='font-bold text-5xl text-black'>POLÍTICA DE PRIVACIDAD</h1>
                <h2 className='italic text-2xl my-2 text-black'>Recopilación y tratamiento de datos</h2>
                <h3 className='text-lg text-black'>Ultima actualización: 08/05/2026</h3>
            </div>

            <div className='lg:pt-20 lg:px-40 pt-10 px-8 text-justify justify-items-center'>
                <p>
                    La presente Política de Privacidad establece los términos en que el Titular utiliza y protege la
                    información que es proporcionada por sus usuarios al momento de utilizar este sitio web y su
                    plataforma de gestión de eventos.
                </p>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>1. INFORMACIÓN QUE ES RECOGIDA</h1>
                    <p className='my-2'>
                        Nuestra plataforma podrá recoger información personal de las siguientes formas:
                    </p>
                    <ul className='list-disc pl-5'>
                        <li>
                            Datos de Registro: Nombre, dirección de correo electrónico e información de contacto.
                        </li>
                        <li>
                            Perfil de Usuario: Información biográfica, intereses seleccionados y fotografía de perfil.
                        </li>
                        <li>
                            Contenido de Eventos: Títulos, descripciones, ubicaciones geográficas y archivos multimedia
                            (imágenes) subidos por el usuario.
                        </li>
                        <li>
                            Uso Técnico: Dirección IP, tipo de navegador e identificadores de sesión para garantizar la
                            seguridad de la cuenta.
                        </li>
                    </ul>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>2. USO DE LA INFORMACIÓN RECOGIDA</h1>
                    <p className='my-2'>
                        La información recopilada se utiliza específicamente para:
                    </p>
                    <ul className='list-disc pl-5'>
                        <li>
                            Proporcionar el servicio de creación, gestión y publicación de eventos.
                        </li>
                        <li>
                            Personalizar la experiencia del usuario basada en sus temáticas de interés.
                        </li>
                        <li>
                            Permitir que otros usuarios se inscriban en los eventos publicados.
                        </li>
                        <li>
                            Mantener la seguridad de la plataforma y verificar la identidad de los administradores.
                        </li>
                        <li>
                            Envío de notificaciones críticas sobre cambios en el estado de sus eventos (ej. confirmación
                            por administrador).
                        </li>
                    </ul>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>3. ALMACENAMIENTO Y SEGURIDAD</h1>
                    <p>
                        Estamos altamente comprometidos para cumplir con el compromiso de mantener su información
                        segura. Usamos sistemas de almacenamiento de datos avanzados y cifrado de contraseñas
                        mediante algoritmos de hash (Bcrypt) para asegurar que no exista acceso no autorizado.
                        Los archivos multimedia proporcionados se almacenan en servicios de terceros especializados
                        (Cloudinary) bajo protocolos de transferencia segura.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>4. COOKIES Y SESIONES</h1>
                    <p>
                        Nuestra plataforma utiliza tokens de seguridad (JWT) y cookies técnicas para mantener la sesión del
                        usuario activa y proteger las rutas privadas. Estas herramientas no se utilizan para rastrear su
                        actividad fuera de nuestra aplicación ni para fines publicitarios de terceros.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>5. CESIÓN DE DATOS A TERCEROS</h1>
                    <p>
                        El Titular no venderá, cederá ni distribuirá la información personal que es recopilada sin su
                        consentimiento, salvo que sea requerido por un juez con una orden judicial.
                        Al inscribirse en un evento, ciertos datos de su perfil público podrán ser visibles para el organizador
                        de dicho evento con el fin de gestionar la asistencia.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>6. DERECHOS ARCO</h1>
                    <p className='my-2'>
                        Usted puede restringir la recopilación o el uso de la información personal que es proporcionada a
                        nuestro sitio web en cualquier momento. Usted tiene derecho a ejercer sus derechos de:
                    </p>
                    <ul className='list-disc pl-5'>
                        <li>
                            <span className='font-bold'>Acceso:</span> Consultar qué datos tenemos sobre usted.
                        </li>
                        <li>
                            <span className='font-bold'>Rectificación:</span> Corregir información inexacta en su perfil.
                        </li>
                        <li>
                            <span className='font-bold'>Cancelación/Supresión:</span> Solicitar la eliminación de su cuenta y sus eventos asociados.
                        </li>
                        <li>
                            <span className='font-bold'>Oposición:</span> Oponerse al tratamiento de sus datos para fines específicos.
                        </li>
                    </ul>
                    <p className='my-2'>
                        Para ejercer estos derechos, puede enviar un correo electrónico a: <a href="mailto:hugojariod77@gmail.com" className='italic text-indigo-to-yellow underline'>hugojariod77@gmail.com</a>
                    </p>
                </div>

                <div className='w-full my-5 bg-lightgray-to-yellow text-black italic p-5'>
                    <p>
                        Este proyecto se reserva el derecho de cambiar los términos de la presente Política de
                        Privacidad en cualquier momento para adaptarla a novedades legislativas o funcionales de la
                        aplicación.
                    </p>
                </div>

                <p className='w-full my-5 text-sm text-gray-to-yellow'>
                    ©2026, MAZE. Todos los derechos reservados.
                </p>
            </div>
        </>
    )
}

export default PrivacyPolicy