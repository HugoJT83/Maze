import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import AuthButton from '../../../components/ui/AuthButton'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { ROLE_TYPE } from '../../../constant/auth.constant'
import { axiosClient } from '../../../utils/axiosClient'
import { toast } from 'react-toastify'
import { useAuthContext } from '../../../context/AuthContext'
import { GoogleLogin } from '@react-oauth/google'

library.add(fas, far)


const RegisterUser = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [isHide, setIsHide] = useState(true)
  const navigate = useNavigate()
  const { fetchUserProfile } = useAuthContext()

  const ValidationSchema = yup.object({
    name: yup.string().required("El nombre y los apellidos son obligatorios"),
    email: yup.string().required('El correo electrónico es obligatorio'),
    password: yup.string().required('La contraseña es obligatoria').min(8, "La contraseña debe tener más de 8 caracteres"),
    role: yup.string().required("Role is Required").oneOf(Object.keys(ROLE_TYPE), "Elige un rol valido")
  })

  const onSubmitHandler = async (values, helpers) => {

    try {
      const response = await axiosClient.post("/auth/register", values)
      const data = response.data

      console.log(data)
      toast.success(data.msg)
      localStorage.setItem("token", data.token)

      await fetchUserProfile()

      helpers.resetForm()
      navigate("/dashboard")
    }
    catch (e) {
      toast.error(e.response.data.detail || e.message)
    }

  }

  const initialValues = {
    name: '',
    email: '',
    password: '',
    role: ROLE_TYPE.USER
  }

  return (
    <>
      {/* Volver */}
      <Link to={'/'}>
        <button className='m-3 font-Bitcount hover:cursor-pointer text-white-to-black bg-indigo-to-yellow border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg'>
          <FontAwesomeIcon icon='fa-solid fa-arrow-left' className='pr-2'></FontAwesomeIcon>
          Volver
        </button>
      </Link>

      <div className=' text-center lg:grid lg:grid-cols-3 lg:my-5 lg:mx-30 mx-5'>

        {/* Texto */}
        <div className="flex flex-col my-auto pr-0 col-span-2">
          <h1 className="title-font font-medium text-3xl text-black-to-white font-Bitcount">Encuentra eventos de tu interés y conecta</h1>
          <p className="leading-relaxed mt-4 text-black-to-white">Regístrate ahora y comienza a buscar; seguro que encuentras algo que llame tu atención.</p>
        </div>

        <Formik
          validationSchema={ValidationSchema}
          onSubmit={onSubmitHandler}
          initialValues={initialValues}
        >
          <Form className="text-gray-600 body-font ">

            <div >
              {/* FORMULARO - CONTENEDOR */}
              <div className=" bg-lightgray-to-yellow rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Introduce tus datos</h2>

                {/* Nombre y apellidos */}
                <div className="relative mb-4">
                  <label htmlFor="name" className="leading-7 text-sm text-gray-600">Nombre y Apellidos</label>
                  <Field type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                  <ErrorMessage name='name' className='text-red-500' component={'p'} />
                </div>

                {/* Correo electrónico */}
                <div className="relative mb-4">
                  <label htmlFor="email" className="leading-7 text-sm text-gray-600">Correo Electrónico</label>
                  <Field type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                  <ErrorMessage name='email' className='text-red-500' component={'p'} />

                </div>

                {/* contraseña */}
                <div className="relative mb-4">
                  <label htmlFor="password" className="leading-7 text-sm text-gray-600">Contraseña</label>
                  <Field type="password" id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                  <ErrorMessage name='password' className='text-red-500' component={'p'} />

                </div>

                <AuthButton text={"Registrarse"}></AuthButton>
                <p className="text-xs text-gray-500 mt-3">Será un momento, no te preocupes.</p>

                <div className='mt-3'>


                  <div className='mb-3 flex justify-center items-center gap-x-6'>
                    <div className='w-full h-[2px] bg-gray-400'></div>
                    <div>
                      <FontAwesomeIcon icon="fa-solid fa-hand-peace"></FontAwesomeIcon>
                    </div>
                    <div className='w-full h-[2px] bg-gray-400'></div>
                  </div>


                  <div className='mb-3 text-center'>
                    <p>
                      <span className='font-bold'>¿Tienes ya una cuenta?</span>  <Link to={'/login'} className='font-Bitcount text-indigo-600 hover:text-indigo-700'>Inicia Sesión Aquí</Link>
                    </p>
                  </div>
                </div>
              </div>
              <div className='w-full justify-items-center text-center bg-lightgray-to-yellow rounded-lg p-5 my-5'>
                <p className='my-2'><span className='font-bold'>Puedes usar tu cuenta de Google:</span></p>
                <GoogleLogin
                  onSuccess={console.log("hola")}
                  onError={() => toast.error("Error al conectar con Google")}
                />
              </div>

            </div>
          </Form>
        </Formik>
      </div >
    </>
  )
}

export default RegisterUser