import React from 'react'

const CompanyDetails = () => {
    return (
        <>
            <div className='w-full flex flex-col items-center justify-center bg-lightgray-to-yellow text-center p-10'>
                <h1 className='font-bold text-5xl text-black'>AVISO LEGAL</h1>
                <h2 className='italic text-2xl my-2 text-black'>Términos y condiciones de Uso del Proyecto</h2>
            </div>

            <div className='lg:pt-20 lg:px-40 pt-10 px-8 text-justify justify-items-center'>
                <p>
                    En cumplimiento con el deber de información general recogido en el artículo 10 de la Ley
                    34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio
                    Electrónico (LSSI-CE), se facilitan a continuación los siguientes datos:
                </p>

                <table className='table-fixed w-full  my-5 bg-lightgray-to-black'>
                    <tbody className='text-black-to-white'>
                        <tr>
                            <td className='border border-gray-to-yellow p-2'>Titular</td>
                            <td className='border border-gray-to-yellow p-2'>Hugo Jariod</td>
                        </tr>
                        <tr>
                            <td className='border border-gray-to-yellow p-2'>NIF/CIF</td>
                            <td className='border border-gray-to-yellow p-2'>000000000X</td>
                        </tr>
                        <tr>
                            <td className='border border-gray-to-yellow p-2'>Domicilio</td>
                            <td className='border border-gray-to-yellow p-2'>C/ de Ejemplo, 29</td>
                        </tr>
                        <tr>
                            <td className='border border-gray-to-yellow p-2'>Contacto</td>
                            <td className='border border-gray-to-yellow p-2'>111 222 333</td>
                        </tr>
                    </tbody>
                </table>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>1. USUARIOS</h1>
                    <p>
                        El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho
                        acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>2. USO DEL PORTAL</h1>
                    <p>
                        La aplicación proporciona el acceso a multitud de informaciones, servicios o datos (en
                        adelante, "los contenidos") en Internet pertenecientes al Titular o a sus licenciantes a los que
                        el USUARIO pueda tener acceso. El USUARIO asume la responsabilidad del uso del portal.
                        Dicha responsabilidad se extiende al registro que fuese necesario para acceder a
                        determinados servicios o contenidos (como la creación de eventos).
                        En dicho registro el USUARIO será responsable de aportar información veraz y lícita. El
                        USUARIO se compromete a hacer un uso adecuado de los contenidos y servicios que la
                        plataforma ofrece.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>3. PROTECCION DE DATOS</h1>
                    <p>
                        El Titular cumple con las directrices del Reglamento General de Protección de Datos (RGPD) y
                        demás normativa vigente en cada momento, y vela por garantizar un correcto uso y
                        tratamiento de los datos personales del usuario. Para ello, junto a cada formulario de recabo
                        de datos de carácter personal, se hará saber al usuario de la existencia y aceptación de las
                        condiciones particulares del tratamiento de sus datos.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>4. PROPIEDAD INTELECTURAL E INDUSTRIAL</h1>
                    <p>
                        El Titular por sí o como cesionario, es titular de todos los derechos de propiedad intelectual e
                        industrial de su página web, así como de los elementos contenidos en la misma (a título
                        enunciativo: imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos,
                        combinaciones de colores, estructura y diseño, etc.).
                        Quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública,
                        incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de
                        esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico,
                        sin la autorización del Titular.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>5. EXCLUSIÓN DE GARANTIAS Y RESPONSABILIDAD</h1>
                    <p>
                        El Titular no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier
                        naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los
                        contenidos, falta de disponibilidad del portal o la transmisión de virus o programas
                        maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas
                        tecnológicas necesarias para evitarlo.
                        Dado que la plataforma permite la publicación de contenidos por parte de terceros (eventos),
                        el Titular no se hace responsable de la veracidad de los datos introducidos por los usuarios.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>6. MODIFICACIONES</h1>
                    <p>
                        El Titular se reserva el derecho de efectuar sin previo aviso las modificaciones que considere
                        oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios
                        que se presten a través de la misma como la forma en la que éstos aparezcan presentados o
                        localizados en su portal.
                    </p>
                </div>

                <div className='w-full my-5'>
                    <h1 className='my-2 text-xl font-bold'>7. DERECHO DE EXCLUSIÓN</h1>
                    <p>
                        El Titular se reserva el derecho a denegar o retirar el acceso al portal y/o los servicios
                        ofrecidos sin necesidad de preaviso, a instancia propia o de un tercero, a aquellos usuarios
                        que incumplan las presentes Condiciones Generales de Uso.
                    </p>
                </div>
            </div>
        </>
    )
}

export default CompanyDetails