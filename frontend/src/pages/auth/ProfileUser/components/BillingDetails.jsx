import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuthContext } from '../../../../context/AuthContext'
import { axiosClient } from '../../../../utils/axiosClient'

const BillingDetails = () => {
    const { user, fetchUserProfile } = useAuthContext()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (window.location.search.includes("stripe_success=true")) {
            fetchUserProfile();
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [fetchUserProfile]);

    const handleStripeConnect = async () => {
        setIsLoading(true)
        try {
            const response = await axiosClient.post("/stripe/create-account-link", {}, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            });
            const data = await response.data;
            if (data.url) {
                if (data.url.includes("stripe_success=true")) {
                    toast.success("¡Modo Simulación! Cuenta vinculada con éxito.");
                    await fetchUserProfile();
                } else {
                    // Redirect to Stripe Onboarding
                    window.location.href = data.url;
                }
            } else {
                toast.error("No se pudo obtener la URL de Stripe.");
            }
        } catch (error) {
            toast.error(error.response?.data?.detail || error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='lg:w-1/2 sm:w-1/3 m-5'>
            <div className='bg-white rounded-lg m-2 p-8 hover:scale-105 ease-in-out duration-150 shadow text-center'>
                <h1 className='font-Bitcount text-indigo-to-black text-2xl mb-4'>Datos de Facturación</h1>

                {user.stripe_account_id ? (
                    <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl">
                        <FontAwesomeIcon icon="fa-solid fa-circle-check" className="text-green-500 text-4xl mb-4" />
                        <h2 className="text-green-800 font-bold text-xl mb-2">¡Cuenta Vinculada!</h2>
                        <p className="text-green-700 mb-4">
                            Ya puedes crear eventos monetizados. Los pagos que recibas serán depositados en tu cuenta bancaria a través de Stripe.
                        </p>
                        <p className="text-sm text-gray-500 mt-4 break-all">
                            ID de Cuenta: {user.stripe_account_id}
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-600 mb-6">
                            Para poder monetizar tus eventos y vender entradas, necesitamos que configures tu cuenta bancaria y verifiques tu identidad mediante Stripe, de forma 100% segura.
                        </p>

                        <button
                            onClick={handleStripeConnect}
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-Bitcount text-xl text-white-to-black transition-all hover:cursor-pointer
                                ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-to-yellow hover:bg-indigo-to-yellow/70'}`}
                        >
                            {isLoading ? (
                                <span>Redirigiendo... <FontAwesomeIcon icon="fa-solid fa-spinner" className="animate-spin ml-2" /></span>
                            ) : (
                                <span>Configurar pagos con Stripe <FontAwesomeIcon icon="fa-solid fa-arrow-right" className="ml-2" /></span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BillingDetails
