import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const EventUnit = ({ eventData }) => {

    const navigate = useNavigate();

    const {
        title = "Sin titulo disponible",
        description = "Sin descripcion disponible",
        creation_date,
        starting_event_date,
        finish_event_date,
        start_hour = "00:00",
        finish_hour = "00:00",

        interests = [],
        location = "sin ubicación disponible",
        phone = "+34000000000",
        status = "pendiente"
    } = event || {};

    const formattedDate = function (date) {
        const newDate = date ?
            new Date(date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }) :
            "Fecha no definida";
        return newDate;
    }

    console.log(formattedDate("2026-05-21T00:00:00"));

    return (
        <div>EventUnit</div>
    )
}

export default EventUnit