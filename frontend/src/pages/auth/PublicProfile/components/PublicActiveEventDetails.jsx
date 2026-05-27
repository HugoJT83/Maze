import React, { useState } from 'react'
import HistoricEventUnit from '../../ProfileUser/components/HistoricEventUnit'
import ActiveEventUnit from '../../ProfileUser/components/ActiveEventUnit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const PublicActiveEventDetails = ({ created_events }) => {
    const [page, setPage] = useState(1)
    const limit = 5

    const active_events = created_events.filter(event => {
        const eventDate = event.finish_event_date || event.starting_event_date
        return eventDate ? new Date(eventDate) >= new Date() : false
    })

    const totalPages = Math.ceil(active_events.length / limit)
    const startIndex = (page - 1) * limit
    const paginatedEvents = active_events.slice(startIndex, startIndex + limit)

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

    return (
        <div className="flex flex-col items-center w-full min-h-[200px]">
            {created_events.length > 0 ? (
                <>
                    <div className="w-full flex flex-col items-center">
                        {paginatedEvents.map(event => (
                            <ActiveEventUnit key={event.id || event._id} event={event} />
                        ))}
                    </div>

                    {/* Controles de Paginación */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8 bg-lightgray-to-black border border-gray-to-yellow/10 py-3 px-6 rounded-2xl shadow-md">
                            <button
                                onClick={handlePrevPage}
                                disabled={page === 1}
                                className={`flex items-center justify-center gap-2 p-2.5 px-4 rounded-xl text-white-to-black font-semibold bg-indigo-to-yellow transition-all ${
                                    page === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95 hover:cursor-pointer'
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
                                className={`flex items-center justify-center gap-2 p-2.5 px-4 rounded-xl text-white-to-black font-semibold bg-indigo-to-yellow transition-all ${
                                    page === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95 hover:cursor-pointer'
                                }`}
                            >
                                <span>Siguiente</span>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="lg:w-1/2 sm:w-1/3 m-5 p-5 bg-slate-50 rounded-lg text-center shadow">
                    <p className="text-xl text-gray-500 font-Bitcount">Este usuario no tiene eventos activos.</p>
                </div>
            )}
        </div>
    )
}

export default PublicActiveEventDetails