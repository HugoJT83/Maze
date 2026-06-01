import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { axiosClient } from '../../../utils/axiosClient'
import EventUnit from './components/eventUnit'
import TicketUnit from './components/ticketUnit'
import StaticInterest from './components/StaticInterest'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faCalendarDays, faTimes } from '@fortawesome/free-solid-svg-icons'

const myEvents = () => {

    const [events, setEvents] = useState([])
    const [viewMode, setViewMode] = useState('publicados')
    const [tickets, setTickets] = useState([])
    const [ticketsLoading, setTicketsLoading] = useState(false)

    // Calendario states
    const [currentDate, setCurrentDate] = useState(new Date())
    const [showDayModal, setShowDayModal] = useState(false)
    const [selectedDay, setSelectedDay] = useState(null)
    const [modalEvents, setModalEvents] = useState([])

    const fetchUserEvents = async () => {
        try {
            const response = await axiosClient.get("/events/my-events", {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            })

            console.log("Lista de eventos:", response.data);
            setEvents(response.data);

        }
        catch (error) {
            toast.error(error.response?.data?.detail || error?.message || "Error de obtención de datos")
        }
    }

    const fetchUserTickets = async () => {
        try {
            setTicketsLoading(true)
            const response = await axiosClient.get("/tickets/my-tickets", {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            })
            console.log("Lista de tickets:", response.data.tickets);
            setTickets(response.data.tickets || []);
        } catch (error) {
            toast.error(error.response?.data?.detail || error?.message || "Error al obtener tus entradas")
        } finally {
            setTicketsLoading(false)
        }
    }

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handlePrevMonth = () => {
        const today = new Date();
        if (currentDate.getFullYear() > today.getFullYear() ||
            (currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() > today.getMonth())) {
            setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
        }
    };

    const getEventsForDate = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        const dayEvents = [];

        events.forEach(event => {
            if (event.starting_event_date) {
                const evDate = new Date(event.starting_event_date);
                if (evDate.getFullYear() === year && evDate.getMonth() === month && evDate.getDate() === day) {
                    dayEvents.push({
                        id: event.id || event._id,
                        title: event.title,
                        type: event.ticket_price !== null && event.ticket_price !== undefined && event.ticket_price > 0
                            ? `Pago (${parseFloat(event.ticket_price).toFixed(2)} €)`
                            : "Gratuito",
                        interests: event.interests || [],
                        role: "publicado",
                        link: `/my-events/${event.id || event._id}`
                    });
                }
            }
        });

        tickets.forEach(ticket => {
            if (ticket.event_starting_date) {
                const evDate = new Date(ticket.event_starting_date);
                if (evDate.getFullYear() === year && evDate.getMonth() === month && evDate.getDate() === day) {
                    dayEvents.push({
                        id: ticket.event_id,
                        title: ticket.event_title || "Evento sin título",
                        type: ticket.ticket_type === "paid" || (ticket.event_ticket_price !== null && ticket.event_ticket_price !== undefined && ticket.event_ticket_price > 0)
                            ? `Pago (${parseFloat(ticket.event_ticket_price || 0).toFixed(2)} €)`
                            : "Gratuito",
                        interests: ticket.event_interests || [],
                        role: "apuntado",
                        link: `/events/${ticket.event_id}`
                    });
                }
            }
        });

        return dayEvents;
    };

    useEffect(() => {
        if (viewMode === 'apuntados') {
            fetchUserTickets();
        } else if (viewMode === 'publicados') {
            fetchUserEvents();
        } else if (viewMode === 'calendario') {
            fetchUserEvents();
            fetchUserTickets();
        }
    }, [viewMode])

    const today = new Date();
    const isPrevDisabled = currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        cells.push({
            day: prevMonthDays - i,
            isCurrentMonth: false,
            date: new Date(year, month - 1, prevMonthDays - i)
        });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        cells.push({
            day: i,
            isCurrentMonth: true,
            date: new Date(year, month, i)
        });
    }
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
        cells.push({
            day: i,
            isCurrentMonth: false,
            date: new Date(year, month + 1, i)
        });
    }

    const monthsSpanish = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const headerText = `${monthsSpanish[month]} ${year}`;

    return (
        <>
            <div className='my-10 lg:mx-10 flex flex-col items-center gap-6'>
                <h1 className='text-indigo-to-yellow text-6xl font-Bitcount text-center'>Tus eventos:</h1>

                {/* Selector de modo de vista */}
                <div className='flex gap-4 bg-lightgray-to-black p-2 px-4 rounded-lg border border-lightgray-to-yellow flex-wrap justify-center'>
                    <button
                        onClick={() => setViewMode('publicados')}
                        className={`px-6 py-2.5 rounded-lg font-Bitcount text-xl transition-all duration-300 hover:cursor-pointer ${viewMode === 'publicados'
                            ? 'bg-indigo-to-yellow text-white-to-black scale-105'
                            : 'text-gray-to-yellow hover:text-indigo-to-yellow'
                            }`}
                    >
                        Eventos Publicados
                    </button>
                    <button
                        onClick={() => setViewMode('apuntados')}
                        className={`px-6 py-2.5 rounded-lg font-Bitcount text-xl transition-all duration-300 hover:cursor-pointer ${viewMode === 'apuntados'
                            ? 'bg-indigo-to-yellow text-white-to-black scale-105'
                            : 'text-gray-to-yellow hover:text-indigo-to-yellow'
                            }`}
                    >
                        Eventos Apuntados
                    </button>
                    <button
                        onClick={() => setViewMode('calendario')}
                        className={`px-6 py-2.5 rounded-lg font-Bitcount text-xl transition-all duration-300 hover:cursor-pointer ${viewMode === 'calendario'
                            ? 'bg-indigo-to-yellow text-white-to-black scale-105'
                            : 'text-gray-to-yellow hover:text-indigo-to-yellow'
                            }`}
                    >
                        Calendario
                    </button>
                </div>
            </div>

            <div className='flex flex-col content-center items-center w-full pb-10'>
                {viewMode === 'publicados' && (
                    events.length > 0 ? (
                        events.map((event) => (
                            <EventUnit key={event.id || event._id} eventData={event} />
                        ))
                    ) : (
                        <div className='flex flex-col text-center my-20 max-w-md bg-lightgray-to-black p-8 rounded-3xl border border-lightgray-to-yellow'>
                            <h1 className='mx-auto my-2 text-4xl font-Bitcount text-indigo-to-yellow'>Nada por aquí...</h1>
                            <p className='text-gray-to-yellow text-sm'>
                                Parece que no tienes eventos creados. ¡Prueba a publicar un evento y empieza a conocer gente!
                            </p>
                            <div className='flex justify-center hover:cursor-pointer mt-4'>
                                <Link to={"/events/create-event"}>
                                    <p className='bg-indigo-to-yellow text-white-to-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all font-semibold'>Crear un evento</p>
                                </Link>
                            </div>
                        </div>
                    )
                )}

                {viewMode === 'apuntados' && (
                    ticketsLoading ? (
                        <div className='lg:w-1/2 sm:w-1/3 m-5 p-5 bg-slate-50 rounded-lg text-center shadow'>
                            <p className='text-xl text-gray-500 font-Bitcount animate-pulse'>Cargando tus entradas...</p>
                        </div>
                    ) : tickets.length > 0 ? (
                        tickets.map((ticket) => (
                            <TicketUnit key={ticket.id} ticketData={ticket} />
                        ))
                    ) : (
                        <div className='flex flex-col text-center my-20 max-w-md bg-lightgray-to-black p-8 rounded-3xl border border-lightgray-to-yellow'>
                            <h1 className='mx-auto my-2 text-4xl font-Bitcount text-indigo-to-yellow'>¿Sin planes?</h1>
                            <p className='text-gray-to-yellow text-sm'>
                                Aún no te has apuntado a ningún evento. ¡Explora los eventos disponibles en el buscador y apúntate!
                            </p>
                            <div className='flex justify-center hover:cursor-pointer mt-4'>
                                <Link to={"/event-search"}>
                                    <p className='bg-indigo-to-yellow text-white-to-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all font-semibold'>Buscar eventos</p>
                                </Link>
                            </div>
                        </div>
                    )
                )}

                {viewMode === 'calendario' && (
                    <div className='w-full max-w-4xl mx-auto px-4 pb-12 flex flex-col items-center'>
                        <div className='bg-lightgray-to-black rounded-lg p-6 w-full border border-lightgray-to-yellow'>
                            {/* Cabecera del Calendario */}
                            <div className='flex justify-between items-center mb-6 pb-4 border-b border-lightgray-to-yellow/30'>
                                <button
                                    onClick={handlePrevMonth}
                                    disabled={isPrevDisabled}
                                    className={`p-3 rounded-full flex items-center justify-center transition-all ${isPrevDisabled
                                        ? 'text-gray-400/35 cursor-not-allowed opacity-50'
                                        : 'text-indigo-to-yellow hover:bg-indigo-to-yellow/10 hover:scale-110 active:scale-95 cursor-pointer'
                                        }`}
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
                                </button>

                                <h2 className='text-3xl font-Bitcount text-indigo-to-yellow capitalize select-none flex items-center gap-3'>
                                    <FontAwesomeIcon icon={faCalendarDays} />
                                    {headerText}
                                </h2>

                                <button
                                    onClick={handleNextMonth}
                                    className='p-3 text-indigo-to-yellow hover:bg-indigo-to-yellow/10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer'
                                >
                                    <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
                                </button>
                            </div>

                            {/* Cabeceras de días de la semana */}
                            <div className='grid grid-cols-7 gap-2 mb-4 text-center font-bold text-gray-to-yellow font-Bitcount text-lg'>
                                <div>L</div>
                                <div>M</div>
                                <div>X</div>
                                <div>J</div>
                                <div>V</div>
                                <div>S</div>
                                <div>D</div>
                            </div>

                            {/* Cuadrícula de días */}
                            <div className='grid grid-cols-7 gap-3'>
                                {cells.map((cell, index) => {
                                    const dayEvents = cell.isCurrentMonth ? getEventsForDate(cell.date) : [];
                                    const hasEvents = dayEvents.length > 0;
                                    const isToday = cell.isCurrentMonth &&
                                        cell.date.getDate() === today.getDate() &&
                                        cell.date.getMonth() === today.getMonth() &&
                                        cell.date.getFullYear() === today.getFullYear();

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                if (hasEvents) {
                                                    setModalEvents(dayEvents);
                                                    setSelectedDay(cell.date);
                                                    setShowDayModal(true);
                                                }
                                            }}
                                            className={`aspect-square flex flex-col justify-between p-2 rounded-lg border transition-all duration-300 relative ${!cell.isCurrentMonth
                                                ? 'bg-transparent text-gray-500/20 border-transparent pointer-events-none'
                                                : hasEvents
                                                    ? 'bg-indigo-to-yellow/10 text-indigo-to-yellow border-indigo-to-yellow/50 cursor-pointer hover:scale-105 hover:bg-indigo-to-yellow/20 active:scale-95'
                                                    : 'bg-white-to-black text-black-to-white border-lightgray-to-yellow/20 hover:bg-lightgray-to-black hover:border-lightgray-to-yellow/45'
                                                } ${isToday ? 'ring-2 ring-indigo-to-yellow' : ''}`}
                                        >
                                            {/* Número del día */}
                                            <span className={`font-semibold text-lg ${isToday ? 'font-bold' : ''}`}>
                                                {cell.day}
                                            </span>

                                            {/* Indicadores de eventos */}
                                            {hasEvents && (
                                                <div className='flex flex-wrap gap-1 mt-auto justify-end'>
                                                    {dayEvents.map((ev, evIdx) => (
                                                        <span
                                                            key={evIdx}
                                                            className={`w-2.5 h-2.5 rounded-full shadow-sm animate-pulse ${ev.role === 'publicado'
                                                                ? 'bg-indigo-500 border border-white/20'
                                                                : 'bg-green-500 border border-white/20'
                                                                }`}
                                                            title={`${ev.role === 'publicado' ? 'Creado: ' : 'Apuntado: '}${ev.title}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de eventos del día */}
            {showDayModal && selectedDay && (
                <div className='fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300'>
                    <div className='bg-lightgray-to-black rounded-lg border border-lightgray-to-yellow w-full max-w-2xl max-h-[85vh] flex flex-col p-6 relative animate-in fade-in zoom-in-95 duration-200'>
                        {/* Botón Cerrar */}
                        <button
                            onClick={() => setShowDayModal(false)}
                            className='absolute top-5 right-5 text-gray-to-yellow hover:text-indigo-to-yellow hover:scale-110 active:scale-95 transition-all p-2 rounded-full cursor-pointer'
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                        </button>

                        {/* Cabecera del Modal */}
                        <div className='border-b border-lightgray-to-yellow/30 pb-4 mb-4 pr-10'>
                            <h3 className='text-3xl font-Bitcount text-indigo-to-yellow flex items-center gap-3'>
                                <FontAwesomeIcon icon={faCalendarDays} />
                                Eventos del día
                            </h3>
                            <p className='text-gray-to-yellow mt-1 capitalize font-semibold'>
                                {selectedDay.toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>

                        {/* Lista de Eventos (Scrollable) */}
                        <div className='flex-1 overflow-y-auto pr-2 custom-scrollbar'>
                            {modalEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className='bg-white-to-black rounded-2xl border border-lightgray-to-yellow/20 p-5 mb-4 hover:border-lightgray-to-yellow/50 transition-all hover:scale-[1.01]'
                                >
                                    {/* Cabecera de Evento */}
                                    <div className='flex justify-between items-start gap-4 flex-wrap sm:flex-nowrap'>
                                        <div>
                                            <h4 className='text-2xl font-bold text-indigo-to-yellow leading-snug'>
                                                "{event.title}"
                                            </h4>

                                            {/* Tipo de evento */}
                                            <p className='text-sm text-gray-to-yellow mt-1 font-semibold'>
                                                Tipo: <span className='text-black-to-white font-normal'>{event.type}</span>
                                            </p>
                                        </div>

                                        {/* Badge de Rol */}
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border font-Bitcount select-none whitespace-nowrap ${event.role === 'publicado'
                                            ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30'
                                            : 'bg-green-500/10 text-green-500 border-green-500/30'
                                            }`}>
                                            {event.role === 'publicado' ? 'Creado por ti' : 'Apuntado'}
                                        </span>
                                    </div>

                                    {/* Temáticas */}
                                    {event.interests && event.interests.length > 0 && (
                                        <div className='mt-4 pt-3 border-t border-lightgray-to-yellow/10'>
                                            <p className='text-xs uppercase text-gray-to-yellow font-bold tracking-wider mb-2'>
                                                Temáticas:
                                            </p>
                                            <div className='grid grid-cols-3 gap-4 pt-1'>
                                                {event.interests.map((interestName, index) => (
                                                    <StaticInterest key={index} interestName={interestName} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Botón de Acceso */}
                                    <Link
                                        to={event.link}
                                        onClick={() => setShowDayModal(false)}
                                        className='mt-5 flex items-center justify-center gap-2 bg-indigo-to-yellow text-white-to-black font-bold py-3 px-6 rounded-xl hover:scale-102 active:scale-98 transition-all hover:cursor-pointer'
                                    >
                                        {event.role === 'publicado' ? 'Gestionar Evento' : 'Ver Detalles del Evento'}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default myEvents