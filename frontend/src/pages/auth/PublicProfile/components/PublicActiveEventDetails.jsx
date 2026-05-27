import React from 'react'
import HistoricEventUnit from '../../ProfileUser/components/HistoricEventUnit'

const PublicActiveEventDetails = ({ created_events }) => {


    const active_events = created_events.filter(event => {
        const eventDate = event.finish_event_date || event.starting_event_date
        return eventDate ? new Date(eventDate) >= new Date() : false
    })

    return (
        <div className="flex flex-col items-center w-full min-h-[200px]">
            {created_events.length > 0 ? (
                active_events.map(event => (
                    <HistoricEventUnit key={event.id || event._id} event={event} />
                ))
            ) : (
                <div className="lg:w-1/2 sm:w-1/3 m-5 p-5 bg-slate-50 rounded-lg text-center shadow">
                    <p className="text-xl text-gray-500 font-Bitcount">Este usuario no tiene eventos activos.</p>
                </div>
            )}
        </div>
    )
}

export default PublicActiveEventDetails