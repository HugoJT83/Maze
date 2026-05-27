import React, { useEffect, useState } from 'react'
import { useAccessibility } from '../../../context/AccessibilityContext';
import PublicDetails from './components/PublicDetails';
import PublicHistoricEventDetails from './components/PublicHistoricEventDetails';
import PublicAvatarComponent from './components/PublicAvatarComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosClient } from '../../../utils/axiosClient';
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
import LoaderComponent from '../../../components/ui/LoaderComponent';

const PublicProfile = () => {

    const { config, setConfig } = useAccessibility();
    const [activeTab, setActiveTab] = useState('informacion');

    const [profileData, setProfileData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { id } = useParams()
    const navigate = useNavigate()


    const fetchPublicProfileDetails = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await axiosClient.get(`auth/public-profile/${id}`, {
                headers: {
                    Authorization: 'Bearer' + localStorage.getItem("token")
                }
            })
            console.log("Detalles del perfil", response.data);
            setProfileData(response.data)
        }
        catch (e) {
            console.log(e);
            const errMsg = err.response?.data?.detail || err.message || "Error al obtener los detalles de perfil"
            setError(errMsg)
            toast.error(errMsg)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchPublicProfileDetails()
        } else {
            setError("ID de perfil de usuario no encontrado")
            setLoading(false)
        }
    }, [id])

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
            </div>);
    }
    if (!profileData) return null;

    return (
        <>
            <div className={
                `flex flex-col min-h-120 min-w-full items-center justify-start
        ${config.highContrast ? 'bg-white-to-black' : 'bg-linear-180 from-slate-200 to-indigo-500'}
        `}>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mt-8 mb-4">
                    <button
                        className={`px-4 py-2 rounded-lg font-Bitcount text-xl transition-all hover:scale-105 hover:cursor-pointer ${activeTab === 'informacion' ? 'bg-indigo-to-yellow text-white-to-black  scale-105' : 'bg-white-to-black text-indigo-to-yellow border-2 border-indigo-to-yellow hover:bg-indigo-50'}`}
                        onClick={() => setActiveTab('informacion')}
                    >
                        Información
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg font-Bitcount text-xl transition-all hover:scale-105 hover:cursor-pointer ${activeTab === 'historial' ? 'bg-indigo-to-yellow text-white-to-black scale-105' : 'bg-white-to-black text-indigo-to-yellow border-2 border-indigo-to-yellow hover:bg-indigo-50'}`}
                        onClick={() => setActiveTab('historial')}
                    >
                        Historial de eventos
                    </button>
                </div>

                <div className="flex flex-wrap w-full items-start justify-center pb-8">
                    <PublicAvatarComponent avatar={profileData.avatar} />
                    {activeTab === 'informacion' && <PublicDetails name={profileData.name} description={profileData.description} address={profileData.address} interests={profileData.interests} />}
                    {activeTab === 'historial' && <PublicHistoricEventDetails created_events={profileData.created_events} />}
                </div>

            </div>

        </>
    )
}

export default PublicProfile