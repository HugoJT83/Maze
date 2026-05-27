import React from 'react'

const PublicHistoricEventDetails = ({ created_events }) => {


    const historicEvents = created_events.filter(event => {
        const eventDate = event.finish_event_date || event.starting_event_date
        return eventDate ? new Date(eventDate) < new Date() : false
    })



    return (
        <div className="flex flex-col items-center w-full min-h-[200px]">
            {created_events > 0 ? (
                historicEvents.map(event => (
                    <HistoricEventUnit key={event.id || event._id} event={event} />
                ))
            ) : (
                <div className="lg:w-1/2 sm:w-1/3 m-5 p-5 bg-slate-50 rounded-lg text-center shadow">
                    <p className="text-xl text-gray-500 font-Bitcount">Este usuario no tiene eventos pasados.</p>
                </div>
            )}
        </div>
    )
}

export default PublicHistoricEventDetails