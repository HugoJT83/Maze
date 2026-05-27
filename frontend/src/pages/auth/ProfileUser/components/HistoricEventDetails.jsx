import React, { useState, useEffect } from 'react'
import HistoricEventUnit from './HistoricEventUnit'
import { axiosClient } from '../../../../utils/axiosClient'
import { toast } from 'react-toastify'

const HistoricEventDetails = () => {
    const [events, setEvents] = useState([])
    const [eventsLoading, setEventsLoading] = useState(false)
    const [eventsFetched, setEventsFetched] = useState(false)

    const fetchUserEvents = async () => {
        try {
            setEventsLoading(true)
            const response = await axiosClient.get("/events/my-events", {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            })
            setEvents(response.data)
            setEventsFetched(true)
        } catch (error) {
            toast.error(error.response?.data?.detail || error?.message || "Error al obtener el historial de eventos")
        } finally {
            setEventsLoading(false)
        }
    }

    useEffect(() => {
        if (!eventsFetched) {
            fetchUserEvents()
        }
    }, [eventsFetched])

    const historicEvents = events.filter(event => {
        const eventDate = event.finish_event_date || event.starting_event_date
        return eventDate ? new Date(eventDate) < new Date() : false
    })

    return (
        <div className="flex flex-col items-center w-full min-h-[200px]">
            {eventsLoading ? (
                <div className="lg:w-1/2 sm:w-1/3 m-5 p-5 bg-slate-50 rounded-lg text-center shadow">
                    <p className="text-xl text-gray-500 font-Bitcount animate-pulse">Cargando historial de eventos...</p>
                </div>
            ) : historicEvents.length > 0 ? (
                historicEvents.map(event => (
                    <HistoricEventUnit key={event.id || event._id} event={event} />
                ))
            ) : (
                <div className="lg:w-1/2 sm:w-1/3 m-5 p-5 bg-slate-50 rounded-lg text-center shadow">
                    <p className="text-xl text-gray-500 font-Bitcount">No tienes eventos en tu historial.</p>
                </div>
            )}
        </div>
    )
}

export default HistoricEventDetails
