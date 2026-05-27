import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { axiosClient } from '../../../utils/axiosClient'
import EventUnit from './components/eventUnit'
import TicketUnit from './components/ticketUnit'
import StaticInterest from './components/StaticInterest'
import { Link } from 'react-router-dom'

const myEvents = () => {

    const [events, setEvents] = useState([])
    const [viewMode, setViewMode] = useState('publicados')
    const [tickets, setTickets] = useState([])
    const [ticketsLoading, setTicketsLoading] = useState(false)

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

    useEffect(() => {
        if (viewMode === 'apuntados') {
            fetchUserTickets();
        } else {
            fetchUserEvents();
        }
    }, [viewMode])

    return (
        <>
            <div className='my-10 lg:mx-10 flex flex-col items-center gap-6'>
                <h1 className='text-indigo-to-yellow text-6xl font-Bitcount text-center'>Tus eventos:</h1>

                {/* Selector de modo de vista */}
                <div className='flex gap-4 bg-lightgray-to-black p-2 px-4 rounded-lg border border-lightgray-to-yellow'>
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
                </div>
            </div>

            <div className='flex flex-col content-center items-center w-full pb-10'>
                {viewMode === 'publicados' ? (
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
                ) : (
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
                                    <p className='bg-indigo-to-yellow text-white-to-black px-6 py-2.5 rounded-xl hover:scale-105 transition-all font-semibold shadow-md'>Buscar eventos</p>
                                </Link>
                            </div>
                        </div>
                    )
                )}
            </div>
        </>
    )
}

export default myEvents