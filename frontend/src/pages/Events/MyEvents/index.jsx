import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { axiosClient } from '../../../utils/axiosClient'

const myEvents = () => {

    const fetchUserEvents = async () => {
        try {
            const response = await axiosClient.get("/events/my-events", {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            })

            console.log("Lista de eventos:", response.data);
        }
        catch (error) {
            toast.error(error.response?.data?.detail || error?.message || "Error de obtención de datos")
        }
    }

    useEffect(() => {
        fetchUserEvents();
    }, [])

    return (
        <div>myEvents</div>
    )
}

export default myEvents