import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas, far)

import * as yup from 'yup'
import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../../../context/AuthContext'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { toast } from 'react-toastify'
import { axiosClient } from '../../../../utils/axiosClient'
import Interest from './Interest'
import { INTERESTS_CONFIG } from '../../../../constant/interestsConfig'
import { GetCountries, GetState } from 'react-country-state-city'
import LocationSelect from './LocationSelect'

const Details = () => {

    /* Aparicion de botones */
    const [hoveredId, setHoveredId] = useState(null)
    const handleMouseOver = (id) => setHoveredId(id)
    const handleMouseOut = () => setHoveredId(null)

    /* Botones editables */
    const [editingId, setEditingId] = useState(null)
    const toggleEdit = (id) => {
        if (editingId === id) {
            setEditingId(null)
        } else {
            setEditingId(id)
        }
    }

    /* Obtencion de datos */
    const { user, fetchUserProfile } = useAuthContext()
    const [initialValues, setInitialValues] = useState({
        name: user.name,
        description: user.description,
        interests: user.interests,
        address: {
            province: user.address?.province || "",
            city: user.address?.city || ""
        }
    })

    const validationSchema = yup.object({
        name: yup.string().required("El nombre es obligatorio").max(30, "el nombre no puede tener más de 30 caracteres"),
        description: yup.string().max(500, "La descripción no puede tener más de 500 caracteres"),
        interests: yup.array().of(yup.string()).max(4, "Solo puedes elegir hasta 4 intereses")
    })

    const onSubmitHandler = async (values, helpers) => {

        const cleanValues = {
            ...values,
            name: values.name.trim(),
            description: values.description.trim(),
        }

        try {

            const response = await axiosClient.put("/auth/update-details", cleanValues, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            })
            const data = await response.data
            toast.success(data.msg)
            console.log(values)
            await fetchUserProfile()

        } catch (error) {
            toast.error(error.response.data.detail || error.message)
        }
    }

    useEffect(() => {
        setInitialValues({
            name: user.name,
            email: user.email,
            interests: user.interests,
            description: user.description,
            address: user.address
        })
    }, [user])

    return (
        <>
            <div className='lg:w-1/2 sm:w-1/3 m-5'>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmitHandler}
                >
                    {({ values, setFieldValue, setFieldTouched }) => (


                        <Form>
                            {/* Detalles */}
                            <div
                                onMouseOver={() => handleMouseOver(1)}
                                onMouseOut={handleMouseOut}
                                className='bg-white rounded-lg m-2 p-5 hover:scale-105 ease-in-out duration-150'
                            >

                                {/* Nombre */}
                                <div className='mb-5'>
                                    <h1 htmlFor="name" className='font-Bitcount text-indigo-to-black text-xl'>Nombre:</h1>
                                    <div className='flex justify-between text-black'>
                                        {editingId === 1 ?
                                            <>
                                                <Field
                                                    className="text-2xl bg-slate-100 border-2 border-indigo-to-black p-1 rounded-xl focus:outline-indigo-700 " type="text" name="name" id="name"
                                                    maxLength={30}
                                                />
                                                <ErrorMessage component={'p'} name='name' className='text-red-500'></ErrorMessage>
                                            </> :
                                            <p className='text-2xl'>{user.name}</p>
                                        }

                                        {hoveredId === 1 ?
                                            <>
                                                <button
                                                    type={editingId === 1 ? "button" : "submit"}
                                                    onClick={() => toggleEdit(1)}
                                                    className='animate-bounce'>
                                                    <FontAwesomeIcon
                                                        icon={editingId === 1 ? "fa-solid fa-check" : "fa-solid fa-pencil"}
                                                        className='text-indigo-to-black hover:cursor-pointer hover:text-indigo-700 transition ease-in-out duration-200' />
                                                </button>
                                            </> :
                                            <> </>
                                        }
                                    </div>
                                </div>

                                {/* Ubicacion */}
                                <div className=''>
                                    <h1 className='font-Bitcount text-indigo-to-black text-xl'>Ubicación:</h1>
                                    <div className='flex justify-between text-black'>
                                        {editingId === 2 ?
                                            <>
                                                <div className=''>
                                                    <LocationSelect
                                                        setFieldValue={setFieldValue}
                                                        values={values}
                                                        setFieldTouched={setFieldTouched}
                                                        editingId={editingId}
                                                    />
                                                    <ErrorMessage name="address" component={'p'} className='text-red-500'></ErrorMessage>
                                                    <br />
                                                </div>

                                            </> :
                                            <>
                                                {user.address && (user.address.province || user.address.city) ?
                                                    <>
                                                        <p className='text-xl text-black'>
                                                            {user.address.province && user.address.city ?
                                                                `${user.address.province}, ${user.address.city}`
                                                                : (user.address.province || user.address.city)
                                                            }
                                                        </p>

                                                    </> :
                                                    <>
                                                        <p className='text-2xl text-gray-to-black'>¿Por dónde te das vida?</p>
                                                    </>

                                                }
                                            </>
                                        }
                                        {hoveredId === 1 ?
                                            <>
                                                <button
                                                    type={editingId === 2 ? "button" : "submit"}
                                                    onClick={() => toggleEdit(2)}
                                                    className='animate-bounce'>
                                                    <FontAwesomeIcon
                                                        icon={editingId === 2 ? "fa-solid fa-check" : "fa-solid fa-pencil"}
                                                        className='text-indigo-to-black hover:cursor-pointer hover:text-indigo-700 transition ease-in-out duration-200' />
                                                </button>
                                            </> :
                                            <> </>
                                        }
                                    </div>
                                </div>

                            </div>

                            {/* Descripcion */}
                            <div
                                onMouseOver={() => handleMouseOver(2)}
                                onMouseOut={handleMouseOut}
                                className='bg-white rounded-lg m-2 p-5 hover:scale-105 ease-in-out duration-150'
                            >
                                <div className='flex'>
                                    <p className='font-Bitcount text-indigo-to-black text-xl mr-1'>Sobre mí:</p>
                                    {hoveredId === 2 ?
                                        <>
                                            <button
                                                type={editingId === 3 ? "button" : "submit"}
                                                onClick={() => toggleEdit(3)}
                                                className='animate-bounce'>
                                                <FontAwesomeIcon
                                                    icon={editingId === 3 ? "fa-solid fa-check" : "fa-solid fa-pencil"}
                                                    className='text-indigo-to-black hover:cursor-pointer hover:text-indigo-700 transition ease-in-out duration-200' />
                                            </button>
                                        </> :
                                        <> </>
                                    }
                                </div>
                                {editingId === 3 ?
                                    <>
                                        <Field
                                            as="textarea"
                                            rows="4"
                                            className="text-lg min-w-full bg-slate-100 border-2 text-black border-indigo-to-black p-1 rounded-xl focus:outline-indigo-700"
                                            placeholder="¡Adelante, no te cortes!"
                                            name="description"
                                            maxLength={500}
                                        />
                                        <ErrorMessage name="description" component={'p'} className='text-red-500'></ErrorMessage>
                                    </> :
                                    <>
                                        {user.description ?
                                            <>
                                                <p className='text-lg text-justify text-black'>
                                                    {user.description}
                                                </p>
                                            </> :
                                            <>
                                                <p className='text-lg text-gray-to-black'>
                                                    ¿Qué puedes contar sobre tí?
                                                </p>
                                            </>
                                        }
                                    </>
                                }
                            </div>

                            {/* Intereses */}
                            <div
                                onMouseOver={() => handleMouseOver(3)}
                                onMouseOut={handleMouseOut}
                                className='bg-white rounded-lg m-2 p-5 hover:scale-105 ease-in-out duration-150'
                            >
                                <div className='flex'>
                                    <p className='font-Bitcount text-indigo-to-black text-xl mr-1'>Intereses:</p>
                                    {hoveredId === 3 ?
                                        <>
                                            <button
                                                type={editingId === 4 ? "button" : "submit"}
                                                onClick={() => toggleEdit(4)}
                                                className='animate-bounce'>
                                                <FontAwesomeIcon
                                                    icon={editingId === 4 ? "fa-solid fa-check" : "fa-solid fa-pencil"}
                                                    className='text-indigo-to-black hover:cursor-pointer hover:text-indigo-700 transition ease-in-out duration-200' />
                                            </button>
                                        </> :
                                        <> </>
                                    }
                                </div>
                                {editingId === 4 ?
                                    <>
                                        {/* Se muestra una lista con todos los intereses; seleccionados los que tenga el usuario */}
                                        <p className='text-indigo-to-black italic'>Puedes seleccionar hasta 4 intereses.</p>
                                        <div className='grid grid-cols-2  lg:grid-cols-4 gap-3 p-4'>
                                            {Object.entries(INTERESTS_CONFIG).map(([key, config]) => {
                                                const isSelected = values.interests.includes(key);

                                                return (

                                                    <Interest
                                                        key={key}
                                                        icon={config.icon}
                                                        label={config.label}
                                                        selectable={true}
                                                        isSelected={isSelected}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                const next = values.interests.filter(i => i !== key);
                                                                setFieldValue('interests', next);
                                                            } else if (values.interests.length < 4) {
                                                                setFieldValue('interests', [...values.interests, key]);
                                                            }
                                                        }}
                                                    ></Interest>

                                                )
                                            })}
                                        </div>
                                    </> :
                                    <>
                                        {/* Se muestran los 4 intereses marcados por el usuario */}
                                        {user.interests && user.interests.length > 0 ?
                                            <>
                                                <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 p-4'>
                                                    {user.interests?.map((key) => {
                                                        const config = INTERESTS_CONFIG[key];

                                                        return config ?

                                                            <Interest
                                                                key={key}
                                                                icon={config.icon}
                                                                label={config.label}
                                                                selectable={false}
                                                            />
                                                            : null;
                                                    })}
                                                </div>

                                            </> :
                                            <>
                                                {/* Si no se han seleccionado intereses */}
                                                <p className='text-lg text-gray-to-black'>Elige qué llama tu atención.</p>

                                            </>
                                        }
                                    </>
                                }


                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

        </>
    )
}

export default Details