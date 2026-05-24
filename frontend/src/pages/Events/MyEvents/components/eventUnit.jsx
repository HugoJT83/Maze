import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StaticInterest from './StaticInterest';

const EventUnit = ({ eventData, customNavigatePath }) => {

    const navigate = useNavigate();

    const {
        _id = "Sin id disponible",
        title = "Sin titulo disponible",
        description = "Sin descripcion disponible",
        creation_date,
        starting_event_date,
        finish_event_date,
        start_hour = "00:00",
        finish_hour = "00:00",

        interests = [],
        province = eventData.location?.province || "sin provincia disponible",
        city = eventData.location?.city || "sin ciudad disponible",
        direction = eventData.location?.direction || "sin dirección disponible",

        phone = "+34000000000",
        status = "sin estado asignado",
        accepted_users = 0,
        interested_users = 0
    } = eventData || {};

    const eventId = eventData?.id || eventData?._id || _id;

    const formattedDate = function (date) {
        const newDate = date ?
            new Date(date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }) :
            "Fecha no definida";
        return newDate;
    }


    return (
        <>
            <div className='bg-lightgray-to-black m-4 p-2 lg:w-3/4 flex flex-wrap lg:flex-nowrap rounded-2xl justify-between '>

                {/* Datos */}
                <div className='flex gap-5 flex-wrap lg:flex-nowrap'>
                    <div className='p-3 w-full'>
                        <h1 className='border-b-2 py-1 font-bold text-indigo-to-yellow border-gray-to-yellow'>"{title}"</h1>
                        <div className='border-b-2 py-1 border-gray-to-yellow'>
                            <h2>Fecha de inicio: {formattedDate(starting_event_date)}</h2>
                            <h2>Fecha de fin: {formattedDate(finish_event_date)}</h2>
                        </div>
                        <div>
                            <h3>Empieza a las: {start_hour}</h3>
                            <h3>Acaba a las: {finish_hour}</h3>
                        </div>
                    </div>


                    <div className='p-3 w-full'>
                        <h1 className='font-bold border-b-2 py-1 border-gray-to-yellow'>Ubicación</h1>
                        <h2>Provincia: {province}</h2>
                        <h2>Ciudad: {city}</h2>
                        <h2>Calle / Dirección: {direction}</h2>
                    </div>


                    <div className='p-3 w-full'>
                        <h1 className='font-bold border-b-2 py-1 border-gray-to-yellow'>Temáticas indicadas</h1>
                        {/* bucle intereses */}
                        <div className='grid grid-cols-3 py-3'>
                            {interests.map((interestName, index) => (
                                <StaticInterest key={index} interestName={interestName} />
                            ))}
                        </div>
                    </div>
                    <div className='p-3 w-full'>
                        <h1 className='font-bold border-b-2 py-1 border-gray-to-yellow'>Datos de publicación</h1>
                        <h2>Estado:
                            {/* Condicional de color */}
                            <span className={`${status == "accepted" ? "text-green-500" : "text-indigo-to-yellow"} font-bold`}>
                                {status == "pending" ? " Pendiente" : " Aceptado"}</span>
                        </h2>
                        {status == "accepted" ?
                            <>
                                <h2>Usuarios aceptados: {accepted_users}</h2>
                                <h2>Usuarios interesados: {interested_users}</h2>
                            </> :
                            <>
                                <p className='text-center text-gray-to-yellow my-2'>Cuando se apruebe, verás los usuarios aquí.</p>
                            </>
                        }
                    </div>
                </div>

                {/* acciones */}
                <div className='flex items-center content-end'>
                    <button
                        onClick={() => navigate(customNavigatePath ? `${customNavigatePath}/${eventId}` : `/my-events/${eventId}`)}
                        className='bg-indigo-to-yellow rounded-2xl h-full my-2 text-white-to-black hover:cursor-pointer not-md:p-2 hover:scale-105 active:scale-95 transition-all duration-200'>Más detalles</button>
                </div>
            </div>
        </>
    )
}

export default EventUnit