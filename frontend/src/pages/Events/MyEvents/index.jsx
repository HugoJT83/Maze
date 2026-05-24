import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { axiosClient } from '../../../utils/axiosClient'
import EventUnit from './components/eventUnit'
import StaticInterest from './components/StaticInterest'
import { Link } from 'react-router-dom'

const myEvents = () => {

    const [events, setEvents] = useState([])

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

    useEffect(() => {
        fetchUserEvents();
    }, [])

    return (
        <>
            <div className='my-10 lg:mx-10'>
                <h1 className='text-indigo-to-yellow text-6xl font-Bitcount text-center'>Tus eventos:</h1>
            </div>
            <div className='flex flex-col content-center items-center'>
                {events.length > 0 ?
                    (
                        events.map((event) => (
                            <EventUnit key={event.id || event._id} eventData={event} />
                        ))
                    )
                    :
                    (
                        <>
                            <div className='flex flex-col text-center my-30'>
                                <h1 className='mx-auto my-2 text-5xl font-Bitcount'>Nada por aquí...</h1>
                                <p className='text-gray-to-yellow'>
                                    Parece que no tienes eventos publicados. ¡Prueba a publicar un evento y empieza a conocer gente!
                                </p>
                                <div className='flex justify-center hover:cursor-pointer'>
                                    <Link to={"/events/create-event"}>
                                        <p className='my-3 bg-indigo-to-yellow text-white-to-black w-40 p-2 rounded-xl hover:scale-110 transition-all'>Crear un evento</p>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
            </div>
        </>
    )
}

export default myEvents