import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthButton from '../../../components/ui/AuthButton'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'

/* FontAwesome */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { ROLE_TYPE } from '../../../constant/auth.constant'
import { axiosClient } from '../../../utils/axiosClient'
import { toast } from 'react-toastify'
import { useAuthContext } from '../../../context/AuthContext'
library.add(fas, far)
/* 
Para añadir un fontawesome:
<FontAwesomeIcon icon="fa-solid fa-house"></FontAwesomeIcon>
*/

const LoginUser = () => {

  /* verificacion 2FA para admins */
  const [is2FA, setIs2FA] = useState(false)
  const [tempEmail, setTempEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [isHide, setIsHide] = useState(true)
  const navigate = useNavigate()
  const { fetchUserProfile } = useAuthContext()

  const ValidationSchema = yup.object({
    email: yup.string()
      .matches(/^[a-zA-Z0-0._%+-]+@[a-zA-Z0-0.-]+\.[a-zA-Z]{2,}$/, 'Introduce un correo electrónico valido (ej: usuario@dominio.com)')
      .required('El correo electrónico es obligatorio'),
    password: yup.string().required('La contraseña es obligatoria').min(8, "La contraseña debe tener más de 8 caracteres"),
  })


  const onSubmitHandler = async (values, helpers) => {
    try {
      const response = await axiosClient.post("/auth/login", values)
      const data = response.data

      if (data.status === "2FA_REQUIRED") {
        setTempEmail(data.email)
        setIs2FA(true)
        toast.info(data.msg)
        return
      }

      console.log(data)
      toast.success(data.msg)


      localStorage.setItem("token", data.token)
      helpers.resetForm()
      await fetchUserProfile()
      navigate("/dashboard")


    }
    catch (e) {
      toast.error(e.response.data.detail || e.message)
    }

  }

  const handleVerify2FA = async () => {

    try {
      const response = await axiosClient.post("/auth/verify-2fa", {
        email: tempEmail,
        code: otpCode
      })

      localStorage.setItem("token", response.data.token)
      toast.success(response.data.msg)
      await fetchUserProfile()
      navigate("/dashboard")
    }
    catch (e) {
      toast.error(e.response.data.detail || e.message)
    }
  }

  const initialValues = {
    email: '',
    password: ''
  }

  return (
    <>
      <Formik
        validationSchema={ValidationSchema}
        onSubmit={onSubmitHandler}
        initialValues={initialValues}
      >
        {({ isSubmitting }) => (
          <Form className="text-gray-600 body-font">

            {/* Volver */}
            <Link to={'/'}>
              <button className='m-3 font-Bitcount hover:cursor-pointer text-white-to-black bg-indigo-to-yellow border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg'>
                <FontAwesomeIcon icon='fa-solid fa-arrow-left' className='pr-2'></FontAwesomeIcon>
                Volver
              </button>
            </Link>

            <div className="container px-5 py-2 mx-auto flex flex-wrap items-center flex-col">

              {/* Texto de presentacion */}
              <div className='lg:w-3/5 md:w-1/2 flex justify-center'>
                <div className=" md:pr-16 lg:pr-0 pr-0 text-center mb-10 pt-2">
                  <h1 className="title-font font-medium text-2xl text-black-to-white font-Bitcount">Encuentra eventos de tu interés y conecta</h1>
                  <p className="leading-relaxed text-black-to-white mt-4">Accede a tus eventos publicados, o maneja los eventos a los que estás apuntado.</p>
                </div>
                <div class="m-5">
                  <FontAwesomeIcon icon='fa-regular fa-lightbulb' class="w-full max-w-10 max-h-fit text-black-to-white"></FontAwesomeIcon>
                </div>
              </div>

              {/* Crendenciales */}
              <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col w-full mt-10 mb-10 md:mt-0">
                <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
                  {!is2FA ? "Datos de usuario" : "Verificacion de Seguridad en 2 pasos"}
                </h2>

                {!is2FA ? (
                  <>
                    {/* Correo electrónico */}
                    <div className="relative mb-4">
                      <label htmlFor="email" className="leading-7 text-sm text-gray-600">Correo Electrónico</label>
                      <Field type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                      <ErrorMessage name='email' className='text-red-500' component={'p'} />
                    </div>

                    {/* Contraseña */}
                    <div className="relative mb-4">
                      <label htmlFor="password" className="leading-7 text-sm text-gray-600">Contraseña</label>
                      <Field type="password" id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                      <ErrorMessage name='password' className='text-red-500' component={'p'} />

                    </div>

                    {/* <AuthButton text={"Iniciar Sesión"}></AuthButton> */}
                    <button type="submit" className="font-Bitcount hover:cursor-pointer text-white-to-black bg-indigo-to-yellow border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                      <span>Iniciar Sesión</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-3">¡Dale, sin miedo!</p>

                    <div>
                      <div className='mb-3 flex justify-center items-center gap-x-6'>
                        <div className='w-full h-[2px] bg-gray-400'></div>
                        <div>
                          <FontAwesomeIcon icon="fa-solid fa-hand-peace"></FontAwesomeIcon>
                        </div>
                        <div className='w-full h-[2px] bg-gray-400'></div>
                      </div>
                      <div className='mb-3 text-center'>
                        <p>
                          <span className='font-bold'>¿No tienes una cuenta?</span>  <Link to={'/register'} className='font-Bitcount text-indigo-700 hover:text-indigo-700'>Regístrate Aquí</Link>
                        </p>
                      </div>
                    </div>
                  </>) : (
                  <>
                    {/* Código de verificación */}
                    <div className="relative mb-4">
                      <label htmlFor="password" className="leading-7 text-sm text-gray-600">Introduce el código enviado a <span className='font-bold'>{tempEmail}.</span></label>
                      <input
                        type="text"
                        maxLength={6}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder='000000'
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                    </div>

                    <button
                      type="button"
                      className="font-Bitcount hover:cursor-pointer text-white-to-black bg-indigo-to-yellow border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                      onClick={(e) => {
                        e.preventDefault();
                        handleVerify2FA();
                      }}
                    >
                      <span>Verificar código</span>
                    </button>
                  </>
                )}

                {/* Rol (testing) */}
                <div className='hidden'>
                  <Field as="select" name="role" id="role">
                    <option value="USER"></option>
                    <option value="ADMIN" selected></option>
                  </Field>
                </div>
              </div>
            </div>
          </Form>
        )}

      </Formik>
    </>
  )
}

export default LoginUser