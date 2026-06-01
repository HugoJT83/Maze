import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { axiosClient } from '../../../utils/axiosClient'
import LoaderComponent from '../../../components/ui/LoaderComponent'
import StaticInterest from '../MyEvents/components/StaticInterest'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowLeft,
    faCalendarDays,
    faClock,
    faMapPin,
    faPhone,
    faFileAlt,
    faChevronLeft,
    faChevronRight,
    faInfoCircle,
    faCheckCircle,
    faExclamationTriangle,
    faCircleUser,
    faThumbsUp,
    faThumbsDown,
    faEnvelope,
    faTimesCircle,
    faTicket
} from '@fortawesome/free-solid-svg-icons'

const EventManagementDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const [isProcessing, setIsProcessing] = useState(false)
    const [justification, setJustification] = useState("")

    const fetchEventDetails = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await axiosClient.get(`/events/manage/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            })
            console.log("Detalles de moderación del evento:", response.data)
            setEvent(response.data)
        } catch (err) {
            console.error(err)
            const errMsg = err.response?.data?.detail || err.message || "Error al obtener los detalles del evento"
            setError(errMsg)
            toast.error(errMsg)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchEventDetails()
        } else {
            setError("ID de evento no especificado")
            setLoading(false)
        }
    }, [id])

    const handleApprove = async () => {
        try {
            setIsProcessing(true)
            const token = localStorage.getItem("token")
            const response = await axiosClient.put(`/events/approve/${id}`, {}, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })

            if (response.data.status === "success") {
                toast.success(response.data.msg || "Evento aprobado con éxito")
                navigate("/manage-events")
            }
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.detail || "No se pudo aprobar el evento")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDeny = async () => {
        if (!justification.trim()) {
            toast.error("La justificación es obligatoria para denegar el evento")
            return
        }

        try {
            setIsProcessing(true)
            const token = localStorage.getItem("token")
            const response = await axiosClient.put(`/events/deny/${id}`, {
                justification: justification.trim()
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })

            if (response.data.status === "success") {
                toast.success(response.data.msg || "Evento rechazado con éxito y creador notificado")
                navigate("/manage-events")
            }
        } catch (err) {
            console.error(err)
            toast.error(err.response?.data?.detail || "No se pudo denegar el evento")
        } finally {
            setIsProcessing(false)
        }
    }

    const formattedDate = (dateString) => {
        if (!dateString) return "No definida"
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    const nextImage = () => {
        if (event?.images && event.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % event.images.length)
        }
    }

    const prevImage = () => {
        if (event?.images && event.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center p-6">
                <LoaderComponent />
                <p className="mt-6 text-gray-to-yellow font-Bitcount animate-pulse text-lg">Cargando detalles del evento...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-black-to-white p-6">
                <div className="bg-lightgray-to-black p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-2 border-red-500/20">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-5xl mb-4" />
                    <h2 className="text-2xl font-bold text-white-to-black mb-2">¡Ups! Algo salió mal</h2>
                    <p className="text-gray-to-yellow mb-6">{error}</p>
                    <Link to="/manage-events" className="inline-flex items-center justify-center gap-2 bg-indigo-to-yellow text-white-to-black font-semibold py-3 px-6 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200 w-full shadow-lg">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Volver a moderación
                    </Link>
                </div>
            </div>
        )
    }

    if (!event) return null

    const {
        title = "Sin título disponible",
        description = "Sin descripción disponible",
        starting_event_date,
        finish_event_date,
        start_hour = "00:00",
        finish_hour = "00:00",
        location = {},
        interests = [],
        phone = "+34000000000",
        status = "pending",
        images = [],
        creator_data = {},
        max_capacity,
        max_tickets_per_person,
        ticket_price
    } = event

    const {
        direction = "Sin dirección disponible",
        city = "Sin ciudad disponible",
        province = "Sin provincia disponible"
    } = location

    return (
        <div className="min-h-screen bg-white-to-black text-white-to-black py-8 px-4 sm:px-6 lg:px-12">
            {/* Header / Botón de retroceso */}
            <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
                <button
                    onClick={() => navigate('/manage-events')}
                    className="flex items-center gap-2 text-white-to-black bg-indigo-to-yellow p-2 rounded-lg transition-all font-medium hover:scale-105 hover:cursor-pointer active:scale-95 duration-200"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Volver a Moderación</span>
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-gray-to-yellow font-semibold">Estado:</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status === "accepted"
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : status === "expired"
                        ? "bg-red-500/10 text-red-500 border border-red-500/20"
                        : "bg-indigo-to-yellow/10 text-indigo-to-yellow border border-indigo-to-yellow/20"
                        }`}>
                        <FontAwesomeIcon icon={status === "accepted" ? faCheckCircle : status === "expired" ? faExclamationTriangle : faInfoCircle} />
                        {status === "accepted" ? "Aceptado" : status === "expired" ? "Pasado" : "Pendiente de Moderación"}
                    </span>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* COLUMNA IZQUIERDA: Galería e Información general */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* Contenedor del Carrusel de imágenes */}
                    <div className="relative bg-lightgray-to-black rounded-lg overflow-hidden group border border-gray-to-yellow/10 aspect-video flex items-center justify-center">
                        {images && images.length > 0 ? (
                            <>
                                <img
                                    src={images[currentImageIndex]?.image_uri}
                                    alt={`Imagen de ${title}`}
                                    className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                                />

                                {/* Controles de navegación del carrusel */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full hover:scale-110 active:scale-90 transition-all duration-200 backdrop-blur-md"
                                            aria-label="Imagen anterior"
                                        >
                                            <FontAwesomeIcon icon={faChevronLeft} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full hover:scale-110 active:scale-90 transition-all duration-200 backdrop-blur-md"
                                            aria-label="Siguiente imagen"
                                        >
                                            <FontAwesomeIcon icon={faChevronRight} />
                                        </button>

                                        {/* Indicadores inferiores */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                            {images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? "bg-indigo-to-yellow w-4" : "bg-white/50"
                                                        }`}
                                                    aria-label={`Ir a imagen ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-slate-900/20 to-yellow-950/20 flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-20 h-20 rounded-full bg-indigo-to-yellow/10 flex items-center justify-center mb-4 text-indigo-to-yellow border border-indigo-to-yellow/20">
                                    <FontAwesomeIcon icon={faFileAlt} className="text-4xl" />
                                </div>
                                <h3 className="font-Bitcount text-2xl text-indigo-to-yellow mb-2">Maze Event</h3>
                                <p className="text-sm text-gray-to-yellow max-w-sm">No se han subido imágenes para este evento, pero toda la información importante está disponible debajo.</p>
                            </div>
                        )}
                    </div>

                    {/* Ficha de Detalles y Descripción */}
                    <div className="bg-lightgray-to-black p-6 sm:p-8 rounded-lg border border-gray-to-yellow/10">
                        <h1 className="text-4xl sm:text-5xl font-Bitcount text-indigo-to-yellow mb-6 leading-tight">
                            "{title}"
                        </h1>
                        <div className="border-t border-gray-to-yellow/20 pt-6">
                            <h3 className="text-lg font-bold text-indigo-to-yellow uppercase tracking-wider mb-3">
                                Descripción del evento
                            </h3>
                            <p className="text-black-to-white leading-relaxed whitespace-pre-line text-base text-justify">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Información de Acceso y Entradas */}
                    <div className="bg-lightgray-to-black p-6 rounded-lg border border-gray-to-yellow/10 hover:scale-[1.01] transition-transform duration-300">
                        <h3 className="text-lg font-bold text-indigo-to-yellow uppercase tracking-wider border-b border-gray-to-yellow/20 pb-3 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faTicket} />
                            Entradas y Aforo
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <span className="text-xs text-gray-to-yellow uppercase font-semibold">Aforo Máximo:</span>
                                <p className="text-lg text-black-to-white font-bold mt-0.5">{max_capacity ? `${max_capacity} personas` : "No especificado"}</p>
                            </div>

                            {ticket_price !== null && ticket_price !== undefined ? (
                                <div className="grid grid-cols-2 gap-4 border-t border-gray-to-yellow/10 pt-3 mt-1">
                                    <div>
                                        <span className="text-xs text-gray-to-yellow uppercase font-semibold">Precio por entrada:</span>
                                        <p className="text-lg text-black-to-white font-bold mt-0.5 text-indigo-to-yellow">
                                            {ticket_price > 0 ? `${parseFloat(ticket_price).toFixed(2)} €` : "¡Gratis!"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-to-yellow uppercase font-semibold">Máx. por persona:</span>
                                        <p className="text-lg text-black-to-white font-bold mt-0.5">
                                            {max_tickets_per_person || "Sin límite"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-t border-gray-to-yellow/10 pt-3 mt-1">
                                    <span className="text-xs text-gray-to-yellow uppercase font-semibold">Precio por entrada:</span>
                                    <p className="text-lg text-black-to-white font-bold mt-0.5 text-indigo-to-yellow">¡Gratis!</p>
                                </div>
                            )}
                        </div>
                    </div>



                    {/* PANEL DE MODERACIÓN (Reemplaza el contenedor de borrado) */}
                    <div className="bg-lightgray-to-black p-6 rounded-lg border border-gray-to-yellow/10 flex flex-col gap-6">
                        <h3 className="text-xl font-bold text-indigo-to-yellow uppercase tracking-wider border-b border-gray-to-yellow/20 pb-3 mb-1">
                            Acciones de Moderación
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Aceptar Evento */}
                            <div className="bg-green-500/5 border border-green-500/20 p-5 rounded-2xl flex flex-col justify-between items-start gap-4">
                                <div>
                                    <h4 className="font-bold text-green-500 flex items-center gap-2 text-lg">
                                        <FontAwesomeIcon icon={faThumbsUp} />
                                        Aprobar Evento
                                    </h4>
                                    <p className="text-sm text-gray-to-yellow mt-2 text-justify">
                                        El evento pasará a estar publicado de manera oficial y visible para toda la comunidad en la plataforma.
                                    </p>
                                </div>
                                <button
                                    onClick={handleApprove}
                                    disabled={isProcessing}
                                    className={`w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-md ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95 hover:cursor-pointer'
                                        }`}
                                >
                                    {isProcessing ? 'Procesando...' : 'Aprobar Publicación'}
                                </button>
                            </div>

                            {/* Denegar Evento */}
                            <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl flex flex-col justify-between items-start gap-4">
                                <div className="w-full">
                                    <h4 className="font-bold text-red-500 flex items-center gap-2 text-lg">
                                        <FontAwesomeIcon icon={faThumbsDown} />
                                        Denegar Evento
                                    </h4>
                                    <p className="text-sm text-gray-to-yellow mt-2 mb-3 text-justify">
                                        El evento se eliminará permanentemente. Es obligatorio introducir una justificación válida que se le enviará al autor.
                                    </p>

                                    <textarea
                                        value={justification}
                                        onChange={(e) => setJustification(e.target.value)}
                                        placeholder="Introduce el motivo del rechazo del evento (ej: Contiene vocabulario inapropiado, etc.)"
                                        rows="3"
                                        disabled={isProcessing}
                                        className="w-full p-3 rounded-xl bg-white-to-black text-black-to-white border border-gray-to-yellow/20 text-sm focus:outline-none focus:border-indigo-to-yellow resize-none"
                                    />
                                </div>
                                <button
                                    onClick={handleDeny}
                                    disabled={isProcessing || !justification.trim()}
                                    className={`w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-md ${isProcessing || !justification.trim() ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95 hover:cursor-pointer'
                                        }`}
                                >
                                    {isProcessing ? 'Procesando...' : 'Denegar e Informar al Usuario'}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* COLUMNA DERECHA: Ficha técnica del evento y Datos del Creador */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* TARJETA DEL CREADOR */}
                    <div className="bg-lightgray-to-black p-6 rounded-lg border border-gray-to-yellow/10 hover:scale-[1.01] transition-transform duration-300">
                        <h3 className="text-lg font-bold text-indigo-to-yellow uppercase tracking-wider border-b border-gray-to-yellow/20 pb-3 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faCircleUser} />
                            Creador del Evento
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-indigo-to-yellow/10 flex items-center justify-center border border-indigo-to-yellow/20 shadow-inner flex-shrink-0">
                                    {creator_data?.avatar ? (
                                        <img src={creator_data.avatar} alt={creator_data.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <FontAwesomeIcon icon={faCircleUser} className="text-indigo-to-yellow text-4xl" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/public-profile/${event.creator_id}`}>
                                        <p className="text-base font-bold text-black-to-white truncate  hover:scale-105 transform-all duration-200 hover:text-indigo-to-yellow">{creator_data?.name || "Cargando..."}</p>
                                    </Link>
                                    <p className="text-xs text-gray-to-yellow truncate flex items-center gap-1.5 mt-0.5">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-indigo-to-yellow/70" />
                                        {creator_data?.email || "Sin email"}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-indigo-to-yellow/5 border border-indigo-to-yellow/10 p-3.5 rounded-xl">
                                <p className="text-xs text-indigo-to-yellow leading-relaxed text-justify">
                                    Esta información es visible exclusivamente para administradores para propósitos de verificación del usuario publicante y moderación.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cuadro de Horarios y Fechas */}
                    <div className="bg-lightgray-to-black p-6 rounded-lg border border-gray-to-yellow/10 hover:scale-[1.01] transition-transform duration-300">
                        <h3 className="text-lg font-bold text-indigo-to-yellow uppercase tracking-wider border-b border-gray-to-yellow/20 pb-3 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faCalendarDays} />
                            ¿Cuándo ocurre?
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <span className="text-xs text-gray-to-yellow uppercase font-semibold">Fecha de Inicio:</span>
                                <p className="text-sm text-black-to-white font-semibold capitalize mt-0.5">{formattedDate(starting_event_date)}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-to-yellow uppercase font-semibold">Fecha de Fin:</span>
                                <p className="text-sm text-black-to-white font-semibold capitalize mt-0.5">{formattedDate(finish_event_date)}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-t border-gray-to-yellow/10 pt-3 mt-1">
                                <div>
                                    <span className="text-xs text-gray-to-yellow uppercase font-semibold flex items-center gap-1">
                                        <FontAwesomeIcon icon={faClock} className="text-indigo-to-yellow text-xs" />
                                        Inicia a las
                                    </span>
                                    <p className="text-lg text-black-to-white font-bold mt-0.5">{start_hour}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-to-yellow uppercase font-semibold flex items-center gap-1">
                                        <FontAwesomeIcon icon={faClock} className="text-indigo-to-yellow text-xs" />
                                        Termina a las
                                    </span>
                                    <p className="text-lg text-black-to-white font-bold mt-0.5">{finish_hour}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ubicación Geográfica */}
                    <div className="bg-lightgray-to-black p-6 rounded-lg border border-gray-to-yellow/10 hover:scale-[1.01] transition-transform duration-300">
                        <h3 className="text-lg font-bold text-indigo-to-yellow uppercase tracking-wider border-b border-gray-to-yellow/20 pb-3 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faMapPin} />
                            ¿Dónde es?
                        </h3>
                        <div className="flex flex-col gap-3">
                            <div>
                                <span className="text-xs text-gray-to-yellow uppercase font-semibold">Calle / Dirección:</span>
                                <p className="text-sm text-black-to-white font-semibold mt-0.5">{direction}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-to-yellow uppercase font-semibold">Ciudad:</span>
                                <p className="text-sm text-black-to-white font-semibold mt-0.5">{city}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-to-yellow uppercase font-semibold">Provincia:</span>
                                <p className="text-sm text-black-to-white font-semibold mt-0.5">{province}</p>
                            </div>
                        </div>
                    </div>

                    {/* Temáticas asociadas */}
                    <div className="bg-lightgray-to-black p-6 rounded-lg border border-gray-to-yellow/10">
                        <h3 className="text-lg font-bold text-indigo-to-yellow uppercase tracking-wider border-b border-gray-to-yellow/20 pb-3 mb-4 flex items-center gap-2">
                            Temáticas indicadas
                        </h3>
                        {interests && interests.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3 pt-2">
                                {interests.map((interestName, index) => (
                                    <StaticInterest key={index} interestName={interestName} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-to-yellow text-center py-4">No se indicaron temáticas específicas.</p>
                        )}
                    </div>



                    {/* Datos de contacto y asistencia */}
                    <div className="bg-lightgray-to-black p-6 rounded-lg border border-gray-to-yellow/10">
                        <h3 className="text-lg font-bold text-indigo-to-yellow uppercase tracking-wider border-b border-gray-to-yellow/20 pb-3 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faPhone} />
                            Contacto y Registro
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <span className="text-xs text-gray-to-yellow uppercase font-semibold">Teléfono de contacto:</span>
                                <a href={`tel:${phone}`} className="flex items-center gap-2 text-indigo-to-yellow font-bold mt-1 text-lg hover:underline transition-all">
                                    {phone}
                                </a>
                            </div>

                            <div className="bg-indigo-to-yellow/5 border border-indigo-to-yellow/10 p-4 rounded-2xl mt-1">
                                <p className="text-xs text-indigo-to-yellow font-medium text-justify">
                                    Este evento se encuentra en revisión. Valida que los datos de contacto y la información general cumplan con los términos de servicio antes de proceder.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default EventManagementDetailPage
