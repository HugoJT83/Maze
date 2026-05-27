import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faUsers, faTicket, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import StaticInterest from '../../../Events/MyEvents/components/StaticInterest';

const ActiveEventUnit = ({ event }) => {


    const {
        title = "Sin título disponible",
        description = "Sin descripción disponible",
        starting_event_date,
        finish_event_date,
        interests = [],
        location = {},
        ticket_price = null,
        accepted_users = 0,
        purchased_tickets = 0
    } = event || {};

    const {
        province = "Sin provincia disponible",
        city = "Sin ciudad disponible",
        direction = "Sin dirección disponible"
    } = location || {};

    const isPaidEvent = ticket_price !== null && ticket_price !== undefined && ticket_price > 0;

    const formattedDate = (date) => {
        if (!date) return "Fecha no definida";
        return new Date(date).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white-to-black m-4 p-6 w-full lg:w-3/4 flex flex-col md:flex-row gap-6 rounded-2xl justify-between border border-lightgray-to-yellow hover:scale-[1.02] hover:shadow-xl transition-all duration-300">
            {/* Left Block: Info */}
            <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl text-indigo-to-yellow font-Bitcount">"{title}"</h2>
                    <span className="bg-gray-500/10 text-green-500 text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-500/20 uppercase tracking-wider">
                        Activo
                    </span>
                </div>

                <p className="text-gray-to-yellow text-sm leading-relaxed line-clamp-3 text-justify">
                    {description}
                </p>

                {/* Day it occurred */}
                <div className='flex gap-5'>
                    <div>
                        <div className="flex items-center gap-2 text-sm text-black-to-white mt-1">
                            <FontAwesomeIcon icon={faCalendarDays} className="text-indigo-to-yellow" />
                            <span className="font-semibold">Fecha de inicio:</span>
                            <span className="capitalize">{formattedDate(starting_event_date)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-black-to-white mt-1">
                            <FontAwesomeIcon icon={faCalendarDays} className="text-indigo-to-yellow" />
                            <span className="font-semibold">Fecha de fin:</span>
                            <span className="capitalize">{formattedDate(finish_event_date)}</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex flex-col text-left gap-2 text-sm text-black-to-white mt-1">
                            <div>
                                <FontAwesomeIcon icon={faLocationDot} className="text-indigo-to-yellow" />
                                <span className="font-semibold">Ubicación:</span>
                            </div>
                            <p>Provincia: {province}</p>
                            <p>Ciudad: {city}</p>
                            <p>Calle: {direction}</p>
                            <div>

                            </div>
                        </div>
                    </div>
                </div>
                {/* Interests / Temáticas */}
                {interests.length > 0 && (
                    <div className="mt-2">
                        <span className="text-xs text-gray-to-yellow uppercase font-semibold tracking-wider block mb-2">Temáticas:</span>
                        <div className="flex flex-wrap gap-4">
                            {interests.map((interestName, index) => (
                                <StaticInterest key={index} interestName={interestName} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Block: Stats */}
            <div className="flex flex-col justify-center items-start md:items-end min-w-[200px] border-t md:border-t-0 md:border-l border-gray-to-yellow/10 pt-4 md:pt-0 md:pl-6 gap-4">
                <div className="bg-lightgray-to-black p-4 rounded-xl border border-lightgray-to-yellow w-full text-center md:text-right">
                    <span className="text-xs text-gray-to-yellow uppercase font-semibold tracking-wider block mb-1">
                        Tipo de evento
                    </span>
                    <span className="text-lg font-Bitcount text-indigo-to-yellow">
                        {isPaidEvent ? `Pago (${parseFloat(ticket_price).toFixed(2)} €)` : "Gratuito"}
                    </span>
                </div>

                <div className="bg-lightgray-to-black p-4 rounded-xl border border-lightgray-to-yellow w-full text-center md:text-right flex items-center justify-between md:justify-end gap-3">
                    <div className="text-left md:text-right">
                        <span className="text-xs text-gray-to-yellow uppercase font-semibold tracking-wider block">
                            {isPaidEvent ? "Entradas vendidas" : "Asistentes"}
                        </span>
                        <span className="text-2xl font-Bitcount text-indigo-to-yellow">
                            {isPaidEvent ? purchased_tickets : accepted_users}
                        </span>
                    </div>
                    <div className="bg-indigo-to-yellow/10 p-2.5 rounded-lg text-indigo-to-yellow">
                        <FontAwesomeIcon icon={isPaidEvent ? faTicket : faUsers} className="text-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActiveEventUnit