import React, { useEffect, useState } from 'react'
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
import { GoogleLogin } from '@react-oauth/google'
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
  const [timeLeft, setTimeLeft] = useState(120)

  const [isLoading, setIsLoading] = useState(false)
  const [isHide, setIsHide] = useState(true)
  const navigate = useNavigate()
  const { fetchUserProfile } = useAuthContext()

  const ValidationSchema = yup.object({
    email: yup.string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Introduce un correo electrónico valido (ej: usuario@dominio.com)')
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

  const onGoogleSubmitHandler = async (credentialResponse) => {
    try {
      const response = await axiosClient.post("/auth/google-login", {
        token: credentialResponse.credential
      });

      localStorage.setItem("token", response.data.token);
      await fetchUserProfile();
      navigate("/dashboard");
    }
    catch (e) {
      toast.error(e.response?.data?.detail || e.message || "Error de veríficación de Google")
    }
  }

  useEffect(() => {
    let timer;
    let countdown;

    if (is2FA) {
      timer = setTimeout(() => {
        toast.warn("Tiempo de verificación expirado");
        navigate('/');
      }, 120000);

      countdown = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (countdown) clearInterval(countdown);
    };

  }, [is2FA, navigate])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
      toast.error(e.response?.data?.detail || e.message || e)
    }
  }

  const initialValues = {
    email: '',
    password: ''
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

      <div className='lg:grid grid-cols-1'>

        {/* Texto de presentacion */}
        <div className='flex flex-wrap justify-center col-span-2 my-auto mx-2'>
          <div className=" md:pr-16 lg:pr-0 pr-0 text-center pt-2">
            <h1 className="title-font font-medium text-2xl text-black-to-white font-Bitcount">Encuentra eventos de tu interés y conecta</h1>
            <p className="leading-relaxed text-black-to-white mt-4">Accede a tus eventos publicados, o maneja los eventos a los que estás apuntado.</p>
          </div>
          <div class="m-5">
            <FontAwesomeIcon icon='fa-regular fa-lightbulb' class="w-full max-w-10 max-h-fit text-black-to-white"></FontAwesomeIcon>
          </div>
        </div>


        < Formik
          validationSchema={ValidationSchema}
          onSubmit={onSubmitHandler}
          initialValues={initialValues}
        >
          {({ isSubmitting }) => (
            <Form className="text-gray-600 body-font m-4 lg:w-1/2 sm:mx-auto">


              {/* Crendenciales */}
              <div className=" bg-lightgray-to-yellow rounded-lg p-8 flex flex-col mt-10 md:mt-0">
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
                      <label htmlFor="password" className="leading-7 text-sm text-gray-600">Introduce el código enviado a <span className='font-bold'>{tempEmail}.</span></label> <br />
                      <span className='font-bold'>Expira en: {formatTime(timeLeft)}</span>
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
                {/* <div className='hidden'>
                    <Field as="select" name="role" id="role">
                      <option value="USER"></option>
                      <option value="ADMIN" selected></option>
                    </Field>
                  </div> */}
              </div>
              <div className='flex items-center justify-center content-center flex-col rounded-lg text-center bg-lightgray-to-yellow p-5 my-3'>
                <p className='my-2'><span className='font-bold'>Puedes iniciar sesión con Google:</span><br />(Si no tienes cuenta, podrás crear una):</p>
                <GoogleLogin
                  onSuccess={(response) => onGoogleSubmitHandler(response)}
                  onError={() => toast.error("Error al conectar con Google")}
                />
              </div>
            </Form>
          )}
        </Formik >
      </div>
    </>
  )
}

export default LoginUser