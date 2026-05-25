import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { axiosClient } from '../../../utils/axiosClient'
import EventUnit from '../MyEvents/components/eventUnit'
import LoaderComponent from '../../../components/ui/LoaderComponent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faInbox, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons'

const EventManager = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalEvents, setTotalEvents] = useState(0)
    const limit = 5

    const fetchPendingEvents = async (currentPage) => {
        try {
            setLoading(true)
            const response = await axiosClient.get(`/events/pending?page=${currentPage}&limit=${limit}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            })
            console.log("Eventos pendientes:", response.data)
            setEvents(response.data.events)
            setTotalPages(response.data.total_pages)
            setTotalEvents(response.data.total_events)
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.detail || "Error al obtener la lista de eventos pendientes")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPendingEvents(page)
    }, [page])

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1)
        }
    }

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1)
        }
    }

    if (loading && events.length === 0) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center p-6">
                <LoaderComponent />
                <p className="mt-6 text-gray-to-yellow font-Bitcount animate-pulse text-lg">Cargando cola de moderación...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white-to-black py-10 px-4 sm:px-6 lg:px-12">
            <div className="max-w-6xl mx-auto mb-10">
                {/* Cabecera de la Página */}
                <div className="text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-to-yellow/20 pb-6">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <FontAwesomeIcon icon={faScrewdriverWrench} className="text-indigo-to-yellow text-3xl" />
                            <h1 className="text-4xl md:text-5xl font-Bitcount text-indigo-to-yellow">
                                Panel de Moderación
                            </h1>
                        </div>
                        <p className="text-gray-to-yellow text-base">
                            Revisa, aprueba o deniega los nuevos eventos solicitados por los usuarios antes de su publicación pública.
                        </p>
                    </div>
                    <div className="bg-lightgray-to-black border border-gray-to-yellow/10 px-6 py-3 rounded-2xl text-center">
                        <span className="text-xs text-gray-to-yellow uppercase font-semibold tracking-wider block">Pendientes</span>
                        <span className="text-3xl font-bold font-Bitcount text-indigo-to-yellow">{totalEvents}</span>
                    </div>
                </div>
            </div>

            {/* Listado de Eventos */}
            <div className="flex flex-col content-center items-center">
                {events.length > 0 ? (
                    <>
                        <div className="w-full flex flex-col items-center">
                            {events.map((event) => (
                                <EventUnit
                                    key={event.id || event._id}
                                    eventData={event}
                                    customNavigatePath="/manage-events"
                                />
                            ))}
                        </div>

                        {/* Controles de Paginación */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8 bg-lightgray-to-black border border-gray-to-yellow/10 py-3 px-6 rounded-2xl">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={page === 1}
                                    className={`flex items-center justify-center gap-2 p-2.5 px-4 rounded-xl text-white-to-black font-semibold bg-indigo-to-yellow transition-all ${page === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95 hover:cursor-pointer'
                                        }`}
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                    <span>Anterior</span>
                                </button>

                                <span className="text-sm font-semibold text-black-to-white">
                                    Página {page} de {totalPages}
                                </span>

                                <button
                                    onClick={handleNextPage}
                                    disabled={page === totalPages}
                                    className={`flex items-center justify-center gap-2 p-2.5 px-4 rounded-xl text-white-to-black font-semibold bg-indigo-to-yellow transition-all ${page === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95 hover:cursor-pointer'
                                        }`}
                                >
                                    <span>Siguiente</span>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col text-center my-20 max-w-md bg-lightgray-to-black p-8 rounded-3xl border border-gray-to-yellow/10">
                        <div className="w-16 h-16 rounded-full bg-indigo-to-yellow/10 flex items-center justify-center mx-auto mb-4 text-indigo-to-yellow">
                            <FontAwesomeIcon icon={faInbox} className="text-3xl" />
                        </div>
                        <h2 className="text-3xl font-Bitcount text-black-to-white mb-2">¡Todo limpio!</h2>
                        <p className="text-gray-to-yellow">
                            No hay ningún evento pendiente de aprobación en este momento. ¡Buen trabajo!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EventManager