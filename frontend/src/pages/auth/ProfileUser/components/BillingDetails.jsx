import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuthContext } from '../../../../context/AuthContext'
import { axiosClient } from '../../../../utils/axiosClient'

const BillingDetails = () => {
    /* Aparicion de botones */
    const [hoveredId, setHoveredId] = useState(null)
    const handleMouseOver = (id) => setHoveredId(id)
    const handleMouseOut = () => setHoveredId(null)

    /* Botones editables */
    const [editingId, setEditingId] = useState(null)
    const toggleEdit = (id) => {
        if(editingId === id){
            setEditingId(null)
        } else {
            setEditingId(id)
        }
    }

    /* Obtencion de datos */
    const { user, fetchUserProfile } = useAuthContext()
    
    const [initialValues, setInitialValues] = useState({
        stripe_account_id: user.stripe_account_id || ''
    })

    const validationSchema = yup.object({
        stripe_account_id: yup.string()
            .required("El ID de cuenta es obligatorio")
            .matches(/^acct_[a-zA-Z0-9]+$/, "Debe ser un ID de Stripe válido (ej: acct_1...)")
            .max(50, "El ID de cuenta no puede tener más de 50 caracteres")
    })

    const onSubmitHandler = async (values, helpers) => {
        const cleanValues = {
            ...user, // include existing user data to avoid wiping it out
            name: user.name, // necessary for the update endpoint
            stripe_account_id: values.stripe_account_id.trim()
        }

        try {
            const response = await axiosClient.put("/auth/update-details", cleanValues, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            })
            const data = await response.data
            toast.success(data.msg || "Datos de facturación actualizados correctamente")
            await fetchUserProfile()
            setEditingId(null)
        } catch (error) {
            toast.error(error.response?.data?.detail || error.message)
        }
    }

    useEffect(() => {
        setInitialValues({
            stripe_account_id: user.stripe_account_id || ''
        })
    }, [user])

    return (
        <div className='lg:w-1/2 sm:w-1/3 m-5'>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmitHandler}
                enableReinitialize={true}
            >
            {({ isSubmitting }) => (
                <Form>
                    <div 
                        onMouseOver={() => handleMouseOver(1)} 
                        onMouseOut={handleMouseOut} 
                        className='bg-slate-50 rounded-2xl m-2 p-5 hover:scale-105 ease-in-out duration-150 shadow'
                    >
                        <div className='mb-2'>
                            <h1 className='font-Bitcount text-indigo-to-black text-xl mb-4 text-center'>Datos de Facturación (Stripe)</h1>
                            <p className="text-gray-600 mb-4 text-sm text-center">
                                Introduce tu identificador de cuenta conectada de Stripe para habilitar la creación de eventos monetizables.
                            </p>
                            
                            <div className='flex justify-between items-center text-black mt-6'>
                                <div className="w-full">
                                    <h2 className='font-bold text-sm text-gray-500 uppercase'>Stripe Account ID:</h2>
                                    {editingId === 1 ? 
                                        <div className="mt-2">
                                            <Field 
                                                className="w-full text-lg bg-slate-100 border-2 border-indigo-to-black p-2 rounded-xl focus:outline-indigo-700" 
                                                type="text" 
                                                name="stripe_account_id" 
                                                placeholder="acct_1..."
                                                maxLength={50}
                                            />
                                            <ErrorMessage component={'p'} name='stripe_account_id' className='text-red-500 mt-1 text-sm'></ErrorMessage>
                                        </div>
                                        :
                                        <p className={`text-xl mt-1 ${user.stripe_account_id ? 'text-black' : 'text-gray-400 italic'}`}>
                                            {user.stripe_account_id || "No configurado"}
                                        </p>
                                    }
                                </div>
                                
                                {hoveredId === 1 && !editingId && (
                                    <button 
                                        type="button"
                                        onClick={() => toggleEdit(1)} 
                                        className='animate-bounce ml-4'
                                    >
                                        <FontAwesomeIcon
                                            icon="fa-solid fa-pencil"
                                            className='text-indigo-to-black hover:cursor-pointer hover:text-indigo-700 transition ease-in-out duration-200'
                                        />
                                    </button>
                                )}
                            </div> 
                            
                            {editingId === 1 && (
                                <div className="flex gap-2 mt-4 justify-end">
                                    <button 
                                        type="button" 
                                        onClick={() => setEditingId(null)}
                                        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-xl transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition"
                                    >
                                        {isSubmitting ? "Guardando..." : "Guardar"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </Form>
            )}
            </Formik>
        </div>
    )
}

export default BillingDetails
