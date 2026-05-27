import React from 'react'
import { useNavigate } from 'react-router-dom'

const TicketUnit = ({ ticketData }) => {
    const navigate = useNavigate();

    const {
        id,
        event_id,
        status,
        ticket_type,
        ticket_validator,
        event_title = "Sin título disponible",
        event_ticket_price = null,
        event_location = {},
        event_starting_date,
        event_finish_date,
        event_start_hour = "00:00",
        event_finish_hour = "00:00"
    } = ticketData || {};

    const {
        direction = "sin dirección disponible",
        city = "sin ciudad disponible",
        province = "sin provincia disponible"
    } = event_location || {};

    const isPaidEvent = ticket_type === "paid";

    const formattedDate = (date) => {
        if (!date) return "Fecha no definida";
        return new Date(date).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className='bg-lightgray-to-black m-4 p-5 lg:w-3/4 flex flex-wrap lg:flex-nowrap rounded-2xl justify-between shadow-md hover:scale-[1.01] transition-transform duration-200 border border-gray-to-yellow/10'>
            {/* Datos */}
            <div className='flex gap-5 flex-wrap lg:flex-nowrap w-full'>
                {/* Columna 1: Título y Horarios */}
                <div className='p-3 w-full lg:w-1/3'>
                    <h1 className='border-b-2 py-1 font-bold text-indigo-to-yellow border-gray-to-yellow'>"{event_title}"</h1>
                    <div className='border-b-2 py-1 border-gray-to-yellow text-sm'>
                        <h2>Fecha de inicio: {formattedDate(event_starting_date)}</h2>
                        <h2>Fecha de fin: {formattedDate(event_finish_date)}</h2>
                    </div>
                    <div className='text-sm mt-1'>
                        <h3>Empieza a las: {event_start_hour}</h3>
                        <h3>Acaba a las: {event_finish_hour}</h3>
                    </div>
                </div>

                {/* Columna 2: Ubicación */}
                <div className='p-3 w-full lg:w-1/3 text-sm'>
                    <h1 className='font-bold border-b-2 py-1 border-gray-to-yellow text-base'>Ubicación</h1>
                    <h2>Provincia: {province}</h2>
                    <h2>Ciudad: {city}</h2>
                    <h2>Calle / Dirección: {direction}</h2>
                </div>

                {/* Columna 3: Datos de la Entrada */}
                <div className='p-3 w-full lg:w-1/3 text-sm'>
                    <h1 className='font-bold border-b-2 py-1 border-gray-to-yellow text-base'>Datos de la Entrada</h1>
                    <h2>Tipo: <span className='font-semibold'>{isPaidEvent ? `Pago (${parseFloat(event_ticket_price).toFixed(2)} €)` : "Gratuito"}</span></h2>
                    
                    {isPaidEvent ? (
                        <div className='mt-2'>
                            <span className='text-xs text-gray-to-yellow uppercase font-semibold block'>Identificador Único:</span>
                            <span className='font-mono font-bold text-indigo-to-yellow break-all text-sm'>
                                {ticket_validator || "Procesando..."}
                            </span>
                        </div>
                    ) : (
                        <div className='mt-2'>
                            <span className='text-xs text-gray-to-yellow uppercase font-semibold block'>Estado de solicitud:</span>
                            <span className={`font-bold ${status === 'accepted' ? 'text-green-500' : 'text-yellow-500'}`}>
                                {status === 'accepted' ? 'Aceptado' : 'Pendiente'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Acciones */}
            <div className='flex items-center content-end justify-center md:justify-end md:pl-4 not-md:w-full'>
                <button
                    onClick={() => navigate(`/events/${event_id}`)}
                    className='bg-indigo-to-yellow rounded-2xl h-full my-2 text-white-to-black hover:cursor-pointer not-md:p-2 hover:scale-105 active:scale-95 transition-all duration-200 px-6 py-3 whitespace-nowrap'
                >
                    Más detalles
                </button>
            </div>
        </div>
    )
}

export default TicketUnit
