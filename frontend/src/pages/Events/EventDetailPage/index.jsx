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
    faUsers,
    faFileAlt,
    faChevronLeft,
    faChevronRight,
    faInfoCircle,
    faCheckCircle,
    faExclamationTriangle,
    faTicket,
    faCheck,
    faTimes
} from '@fortawesome/free-solid-svg-icons'
import ConfirmationModal from '../../../components/ConfirmationModal'

const EventDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const [tickets, setTickets] = useState([])
    const [ticketsLoading, setTicketsLoading] = useState(false)


    const [isDeleting, setIsDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const token = localStorage.getItem("token")

            const response = await axiosClient.delete(`/events/delete-event/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });

            if (response.data.status == "success") {
                toast.success(response.data.message || "Evento borrado con exito");
                setShowModal(false);
                navigate("/my-events");
            }
        }
        catch (error) {
            toast.error(error.response?.data?.detail || "No se pudo eliminar el evento");
            setShowModal(false);
        }
        finally {
            setIsDeleting(false);
        }
    }

    const fetchEventDetails = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await axiosClient.get(`/events/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            })
            console.log("Detalles del evento:", response.data)
            setEvent(response.data)
            if (response.data.status === "accepted") {
                fetchTickets()
            }
        } catch (err) {
            console.error(err)
            const errMsg = err.response?.data?.detail || err.message || "Error al obtener los detalles del evento"
            setError(errMsg)
            toast.error(errMsg)
        } finally {
            setLoading(false)
        }
    }

    const fetchTickets = async () => {
        try {
            setTicketsLoading(true)
            const response = await axiosClient.get(`/tickets/event/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            })
            setTickets(response.data.tickets || [])
        } catch (error) {
            console.error("Error al obtener tickets:", error)
            toast.error("No se pudo cargar la lista de asistentes")
        } finally {
            setTicketsLoading(false)
        }
    }

    const handleUpdateTicketStatus = async (ticketId, newStatus) => {
        try {
            await axiosClient.put(`/tickets/${ticketId}/status`, { status: newStatus }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            })
            toast.success(`Solicitud ${newStatus === 'accepted' ? 'aceptada' : 'denegada'} correctamente`)
            fetchTickets()
        } catch (error) {
            toast.error("Error al actualizar el estado de la solicitud")
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
            <div className="min-h-screen flex flex-col justify-center items-center bg-white-to-black p-6">
                <div className="bg-lightgray-to-black p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-2 border-red-500/20">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-5xl mb-4" />
                    <h2 className="text-2xl font-bold text-white-to-black mb-2">¡Ups! Algo salió mal</h2>
                    <p className="text-gray-to-yellow mb-6">{error}</p>
                    <Link to="/my-events" className="inline-flex items-center justify-center gap-2 bg-indigo-to-yellow text-white-to-black font-semibold py-3 px-6 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200 w-full shadow-lg">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Volver a mis eventos
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
        max_capacity,
        max_tickets_per_person,
        ticket_price
    } = event

    const {
        direction = "Sin dirección disponible",
        city = "Sin ciudad disponible",
        province = "Sin provincia disponible"
    } = location

    const isPaidEvent = ticket_price !== null && ticket_price !== undefined && ticket_price > 0;
    const pendingTickets = tickets.filter(t => t.status === 'pending');
    const acceptedTickets = tickets.filter(t => t.status === 'accepted');
    const paidTickets = tickets.filter(t => t.status === 'paid');

    return (
        <div className="min-h-screen bg-white-to-black text-white-to-black py-8 px-4 sm:px-6 lg:px-12">
            {/* Header / Botón de retroceso */}
            <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
                <button
                    onClick={() => navigate('/my-events')}
                    className="flex items-center gap-2 text-white-to-black bg-indigo-to-yellow p-2 rounded-lg transition-all font-medium hover:scale-105 hover:cursor-pointer active:scale-95 duration-200"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span>Volver a Tus Eventos</span>
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-xs uppercase text-gray-to-yellow font-semibold">Estado:</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${status === "accepted"
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : "bg-indigo-to-yellow/10 text-indigo-to-yellow border border-indigo-to-yellow/20"
                        }`}>
                        <FontAwesomeIcon icon={status === "accepted" ? faCheckCircle : faInfoCircle} />
                        {status === "accepted" ? "Aceptado" : "Pendiente de Aprobación"}
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
                            /* Fallback si no hay imágenes */
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
                            <h3 className="text-lg font-bold text-indigo-to-yellow uppercase mb-3">
                                Descripción del evento
                            </h3>
                            <p className="text-black-to-white leading-relaxed whitespace-pre-line text-base text-justify">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="bg-lightgray-to-black p-6 rounded-lg border border-gray-to-yellow/10 hover:scale-[1.01] transition-transform duration-300">
                        <h3 className="text-lg font-bold text-indigo-to-yellow uppercase border-b border-gray-to-yellow/20 pb-3 mb-4 flex items-center gap-2">
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



                    <ConfirmationModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        onConfirm={handleDelete}
                        isDeleting={isDeleting}
                    />
                </div>

                {/* COLUMNA DERECHA: Ficha técnica del evento (4 columnas) */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* Cuadro de Horarios y Fechas */}
                    <div className="bg-lightgray-to-black p-6 rounded-lg border border-gray-to-yellow/10 hover:scale-[1.01] transition-transform duration-300">
                        <h3 className="text-lg font-bold text-indigo-to-yellow uppercase border-b border-gray-to-yellow/20 pb-3 mb-4 flex items-center gap-2">
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
                        <h3 className="text-lg font-bold text-indigo-to-yellow uppercase border-b border-gray-to-yellow/20 pb-3 mb-4 flex items-center gap-2">
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
                        <h3 className="text-lg font-bold text-indigo-to-yellow uppercase border-b border-gray-to-yellow/20 pb-3 mb-4 flex items-center gap-2">
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
                        <h3 className="text-lg font-bold text-indigo-to-yellow uppercase border-b border-gray-to-yellow/20 pb-3 mb-4 flex items-center gap-2">
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

                            {status === "accepted" ? (
                                <div className="border-t border-gray-to-yellow/10 pt-3 mt-1 flex flex-col gap-2">
                                    <span className="text-xs text-gray-to-yellow uppercase font-semibold flex items-center gap-1">
                                        <FontAwesomeIcon icon={faUsers} className="text-indigo-to-yellow" />
                                        Asistentes del evento
                                    </span>
                                </div>
                            ) : (
                                <div className="bg-indigo-to-yellow/5 border border-indigo-to-yellow/10 p-4 rounded-2xl mt-1">
                                    <p className="text-xs text-indigo-to-yellow font-medium text-justify">
                                        Este evento se encuentra en revisión. Los detalles completos de asistencia y reservas estarán disponibles en cuanto el administrador valide la publicación.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>



            {/* Asistentes y Solicitudes */}
            {status === "accepted" && (
                <div className="max-w-6xl mx-auto mt-12 bg-lightgray-to-black p-6 sm:p-8 rounded-lg border border-gray-to-yellow/10">
                    <h2 className="text-3xl font-Bitcount text-indigo-to-yellow mb-6 flex items-center gap-3">
                        <FontAwesomeIcon icon={faUsers} />
                        Gestión de Asistentes
                    </h2>

                    {ticketsLoading ? (
                        <p className="text-gray-to-yellow">Cargando datos de asistentes...</p>
                    ) : isPaidEvent ? (
                        <div>
                            <h3 className="text-xl font-bold text-green-500 mb-4 border-b border-gray-to-yellow/20 pb-2">
                                Entradas Pagadas ({paidTickets.length})
                            </h3>
                            {paidTickets.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {paidTickets.map(ticket => (
                                        <div key={ticket.id} className="bg-white-to-black p-4 rounded-xl border border-green-500/30 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-black-to-white">{ticket.user_name}</p>
                                                <p className="text-xs text-gray-to-yellow">{ticket.user_email}</p>
                                                {ticket.ticket_validator && (
                                                    <p className="text-sm text-indigo-to-yellow font-semibold mt-1">
                                                        Comprobante: {ticket.ticket_validator}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded">Pagado</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-to-yellow text-sm">Aún no hay entradas vendidas para este evento.</p>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Solicitudes Pendientes */}
                            <div>
                                <h3 className="text-xl font-bold text-yellow-500 mb-4 border-b border-gray-to-yellow/20 pb-2">
                                    Solicitudes Pendientes ({pendingTickets.length})
                                </h3>
                                {pendingTickets.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {pendingTickets.map(ticket => (
                                            <div key={ticket.id} className="bg-white-to-black p-4 rounded-xl border border-yellow-500/30 flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-black-to-white">{ticket.user_name}</p>
                                                    <p className="text-xs text-gray-to-yellow">{ticket.user_email}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateTicketStatus(ticket.id, 'accepted')}
                                                        className="bg-green-500/20 text-green-500 hover:bg-green-500 hover:cursor-pointer hover:text-white p-2 rounded-lg transition-colors"
                                                        title="Aprobar"
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateTicketStatus(ticket.id, 'rejected')}
                                                        className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:cursor-pointer p-2 rounded-lg transition-colors"
                                                        title="Denegar"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-to-yellow text-sm">No hay solicitudes pendientes.</p>
                                )}
                            </div>

                            {/* Usuarios Aceptados */}
                            <div>
                                <h3 className="text-xl font-bold text-green-500 mb-4 border-b border-gray-to-yellow/20 pb-2">
                                    Usuarios Aceptados ({acceptedTickets.length})
                                </h3>
                                {acceptedTickets.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {acceptedTickets.map(ticket => (
                                            <div key={ticket.id} className="bg-white-to-black p-4 rounded-xl border border-green-500/30">
                                                <p className="font-bold text-black-to-white">{ticket.user_name}</p>
                                                <p className="text-xs text-gray-to-yellow">{ticket.user_email}</p>
                                                {ticket.ticket_validator && (
                                                    <p className="text-sm text-indigo-to-yellow font-semibold mt-1">
                                                        Comprobante: {ticket.ticket_validator}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-to-yellow text-sm">Aún no hay usuarios aceptados.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className=' flex max-w-6xl mx-auto mt-12 bg-lightgray-to-black p-6 sm:p-8 rounded-lg border border-gray-to-yellow/10'>
                <button
                    onClick={() => setShowModal(true)}
                    disabled={isDeleting}
                    className={`bg-red-500 p-6 rounded-lg text-white transition-all ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:scale-110'}`}>Quiero borrar el evento</button>
                <div className='px-4 text-gray-to-yellow text-justify'>
                    <p className='font-bold'>*IMPORTANTE: <br /></p>
                    <p className=''>Si decides cancelar el evento, se eliminará la revisión de la lista de eventos pendientes del administrador. Si el evento estuviera aprobado, se enviará un correo a los asistentes informando del cambio.</p>
                </div>
            </div>
        </div>
    )
}

export default EventDetailPage