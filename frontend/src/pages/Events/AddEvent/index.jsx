import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { use, useEffect, useState } from 'react'
import * as yup from 'yup'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { INTERESTS_CONFIG } from '../../../constant/interestsConfig'
import Interest from '../../auth/ProfileUser/components/Interest'
import { data, Link, Navigate, useNavigate } from 'react-router-dom'
import Hourpicker from './components/Hourpicker'
import Datepicker from './components/Datepicker'
import Locationpicker from './components/Locationpicker'
import Phoneinput from './components/Phoneinput'
import EventImage from './components/EventImage'
import { toast } from 'react-toastify'
import { axiosClient } from '../../../utils/axiosClient'
library.add(fas,far)

const addEvent = () => {

    /* Elementos de creación con éxito */
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(()=>{
    
            if(isSuccess){

                const duration = 5000;
                const intervalTime = 50;
                const step = (intervalTime / duration) * 100;

                const timer = setInterval(()=>{
                    setProgress((prev)=>Math.max(prev-step, 0));
                }, intervalTime);
    
                const timeout = setTimeout(() => {
                    navigate('/dashboard');
                }, duration);

                return () => {
                    clearInterval(timer);
                    clearTimeout(timeout);
                };
            }
        },[isSuccess, navigate])

    /* Mostrar información de forma condicional */
    const [focusedId,setFocusedId] = useState(null)
    const handleFocusedId = (id) => {
        if(focusedId === id){
            setFocusedId(null)
        }
        else{
            setFocusedId(id)
        }
    }

    /* Edicion de intereses */
    const [editing,setEditing] = useState(false)
    const toggleEdit = () =>{
        setEditing(!editing)
    }

    /* Valores iniciales de formulario */
    const [initialValues,setInitialValues] = useState({
        title:'',
        phone:'',
        description:'',
        starting_event_date:'',
        finish_event_date:'',
        start_hour:'',
        finish_hour:'',
        location: {
            province: '',
            city: '',
            direction: ''
        },
        interests:[],
        images:[],
        terms:false
    })

    /* Obtener intereses para validación */
    const validInterests = Object.keys(INTERESTS_CONFIG)

    /* Esquema de validacion */
    const validationSchema = yup.object({
        title:yup.string()
        .required("El nombre es obligatorio")
        .min(4,"el título debe tener más de 4 caracteres")
        .max(40,"el título no puede tener más de 40 caracteres"),
        
        phone:yup.string()
        .required("Es obligatorio aportar un número de teléfono de referencia")
        .matches(/^(\+?34)?(6\d{2}|7[1-9]\d{1})\d{6}$/, "el número de teléfono debe contener 9 dígitos únicamente y poseer un formato válido"),

        description:yup.string()
        .required("La descripción es obligatoria")
        .min(10,"La descripción debe tener más de 10 caracteres")
        .max(500,"la descripción debe tener menos de 500 caracteres")
        .trim(),

        starting_event_date:yup.date()
        .required("Es obligatorio indicar una fecha de inicio")
        .min(new Date((new Date().setHours(0,0,0,0))), 'No es posible seleccionar una fecha pasada para la fecha de inicio'),

        finish_event_date:yup.date()
        .required("Es obligatorio indicar una fecha Fin")
        .min(new Date((new Date().setHours(0,0,0,0))), 'No es posible seleccionar una fecha pasada para la fecha de fin'),

        start_hour:yup.string()
        .required("Es obligatorio aportar una hora de inicio")
        .matches(/^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/, "el formato es incorrecto (ej: '12:36' )"),

        finish_hour:yup.string()
        .required("Es obligatorio aportar una hora Fin")
        .matches(/^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/, "el formato es incorrecto (ej: '17:14' )"),

        interests:yup.array()
        .of(yup.string().oneOf(validInterests, "el tema seleccionado no es válido"))
        .min(1, "selecciona al menos un tema")
        .max(3, "Puedes seleccionar como máximo 3 temas")
        .required("Indicar al menos un tema es obligatorio"),

        location: yup.object().shape({
            province: yup.string().required("La provincia es obligatoria"),
            city: yup.string().required("La ciudad es obligatoria"),
            direction: yup.string().required("El lugar es obligatorio").min(5,"la dirección debe tener al menos 5 caracteres")
        }),

        images:yup.array()
        .min(1,"Al menos una imagen es obligatoria")
        .max(5,"No se pueden añadir más de 5 imágenes").required("Añadir imágenes es obligatorio"),

        terms:yup.boolean()
        .oneOf([true], "Debes aceptar los términos y condiciones para publicar eventos.")
        .required("Campo obligatorio")
    }).test(
        'check-hours',
        function (values) {
            const {starting_event_date, finish_event_date} = values
            
            const startDate = new Date(starting_event_date).setHours(0,0,0,0)
            const finishDate = new Date(finish_event_date).setHours(0,0,0,0)
            
            /* Si las fechas están vacias se para */
            if(!starting_event_date || !finish_event_date)
                return true;
            

            /* Valida que la fecha fin no sea anterior a la fecha fin */
            if(finishDate < startDate){
                return this.createError({
                    path:'finish_event_date',
                    message: 'La fecha fin no puede ser anterior a la fecha de inicio'
                })
            }

            const{start_hour, finish_hour} = values
            
            /* Si las horas faltan se para*/
            if(!start_hour || !finish_hour)
                 return true;

            /* Valida que, si las fechas coinciden, la hora fin no sea anterior a la hora inicio */
            if(startDate === finishDate){
                const [startHH, startMM] = start_hour.split(':').map(Number);
                const [finishHH, finishMM] = finish_hour.split(':').map(Number);

                const startMinutes = startHH * 60 + startMM;
                const finishMinutes = finishHH * 60 + finishMM; 

                if(finishMinutes <= startMinutes){
                    return this.createError({
                        path:'finish_hour',
                        message: 'En eventos de 1 día, la hora de inicio debe ser anterior a la hora de fin'
                    })
                }
            }   
        }
    )

    /* Envio de datos */
    const onSubmitHandler = async(values, {setSubmitting}) =>{

        const formData = new FormData();

        const cleanValues = {
                    ...values,
                    title: values.title?.trim(),
                    description: values.title?.trim(),
                    phone: "+34"+values.phone
        }

        const {images, ...eventData} = cleanValues;

        formData.append("data", JSON.stringify(eventData));

        images.forEach((imageFile) => {
            formData.append("images", imageFile)
        });
        
        try {
            
            const response = await axiosClient.post("/events/create-event",formData,{
                headers:{
                    "Content-Type": "multipart/form-data",
                    'Authorization':'Bearer '+localStorage.getItem("token")
                }
            });

            const data = await response.data;
            
            setIsSuccess(true);

        } catch (error) {
            toast.error(error.response?.data?.detail || error.message)
        }
        finally {
            setSubmitting(false);
        }
    }


    /* Renderizado de exito de creacion de evento */
    if(isSuccess){
        return (
        <>
            <div className='fixed top-0 left-0 bg-white w-full h-full items-center justify-center flex'>
                <div className='w-1/3'>
                    <div className='flex items-center my-5 flex-col md:flex-row text-center'>
                        <FontAwesomeIcon icon="fa-regular fa-circle-check" className='text-indigo-to-yellow mx-2 text-3xl'></FontAwesomeIcon>
                        <h1 className='text-xl font-Bitcount text-indigo-to-yellow'>¡Tu evento ha sido registrado correctamente!</h1>
                    </div>
                    <p className='md:text-justify text-center'>Este pasará a disposición de un administrador para verificar su contenido; recibirás una notificación tras la resolución, ¡Ya queda poco!</p>
                    <div className="w-full h-3 bg-gray-200 my-4 rounded-full overflow-hidden">
                        <div 
                        className="h-full bg-indigo-to-yellow transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </>
        )
    }
  
    /* Renderizado por defecto de formulario */
    return (
    <>
        {/* Contenedor principal */}
        <div className='pt-5 pb-20 rounded-xl px-5 bg-white-to-black border-2 border-indigo-to-yellow m-5'>
            
            {/* Volver */}
            <Link to={'/dashboard'}>
                <button className=' font-Bitcount hover:cursor-pointer text-white-to-black bg-indigo-to-yellow border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg'>
                <FontAwesomeIcon icon='fa-solid fa-arrow-left' className='pr-2'></FontAwesomeIcon>
                Volver
                </button>
            </Link>

            <h1 className='text-center m-4 text-6xl text-indigo-to-yellow font-Bitcount'>Crea un evento</h1>      
            
            {/* Separador */}
            <div className='mb-6 mt-6 flex justify-center items-center gap-x-6'>
                <div className='w-1/7 h-[2px] bg-indigo-to-yellow'></div>
                <div>
                <FontAwesomeIcon icon="fa-solid fa-location-dot" className='text-indigo-to-yellow'></FontAwesomeIcon>
                </div>
                <div className='w-1/7 h-[2px] bg-indigo-to-yellow'></div>
            </div>
            
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmitHandler}
            >
            {({values,setFieldValue,setFieldTouched,setFieldError, isSubmitting}) =>(

            
                    <Form className='justify-center flex'>
                        <div className='bg-lightgray-to-black p-6 w-240 rounded border-2 border-indigo-to-yellow'>
                            <span className='p-2 italic text-sm text-indigo-to-yellow'>'*' indica un campo obligatorio.</span>
                            {/* Grupo 1 - titulo y teléfono */}
                            <div className='grid grid-cols-1 md:grid-cols-2 '>
                                {/*1.1. Titulo */}
                                <div className=' p-2 text-center md:text-left'>
                                    <h1 htmlFor="title" className='text-2xl m-1 font-Bitcount text-indigo-to-yellow'>
                                        Título<sup>*</sup>
                                    </h1>
                                    <Field
                                     type="text" 
                                     name="title" 
                                     id="title" 
                                     className="bg-white-to-black rounded border-2 p-1 border-indigo-to-yellow w-full"></Field>
                                    <ErrorMessage component={'p'} name='title' className='text-red-500'></ErrorMessage>
                                </div>
                                
                                {/* 1.2. Teléfono */}
                                <div className=' p-2 text-center md:text-left'>
                                    <h1 htmlFor="phone" className='text-2xl m-1 font-Bitcount text-indigo-to-yellow'>
                                        Número de teléfono<sup>*</sup>
                                    </h1>
                                    <Phoneinput
                                        name="phone"
                                        id="phone"
                                    />
                                    <ErrorMessage component={'p'} name='phone' className='text-red-500'></ErrorMessage>
                                </div>
                            </div>
                            

                            {/* Descripción */}
                            <div className='p-2 text-center md:text-left'>
                                
                                <h1 htmlFor="description" className='text-2xl m-1 font-Bitcount text-indigo-to-yellow'>
                                    Descripción del evento<sup>*</sup>
                                </h1>
                                {focusedId === 1 ? 
                                <h2 className='italic text-sm text-center m-2'>
                                    Añade una pequeña descripción del evento; puedes indicar detalles como para quién va dirigido, qué se va a realizar o cual es el objetivo de este.
                                </h2> : null
                                }
                                <div
                                    onFocus={()=> setFocusedId(1)}
                                    onBlur={()=>setFocusedId(null)}
                                >
                                    <Field 
                                        as="textarea"
                                        rows="4"
                                        className="w-full p-2 bg-white-to-black border-2 border-indigo-to-yellow rounded"
                                        name="description"
                                        id='description'
                                        maxLength={500}
                                    />
                                </div>
                                <ErrorMessage name='description' component={'p'} className='text-red-500'></ErrorMessage>
                            </div>

                            {/* Fecha de creación -> oculto, toma la fecha de ahora */}
                            
                            {/* grupo 2 - fecha e intereses */}
                            <div className='grid grid-cols-1 lg:grid-cols-2'>

                                {/* 2.1. - fecha y hora */}
                                <div className='p-2 text-center'>

                                    {/* 2.1.1. - fecha */}
                                    <div 
                                        onFocus={()=>setFocusedId(2)}
                                    >
                                        <h1 htmlFor="event_date" className='text-2xl m-1 font-Bitcount text-indigo-to-yellow'>
                                            Fecha del evento<sup>*</sup>
                                        </h1>
                                        {focusedId === 2 ? 
                                            <h2 className='italic text-sm text-center m-2'>
                                                Si el evento transcurre durante el día, indique el mismo día para ambos campos.
                                            </h2> : null
                                        }
                                        <div className='flex justify-center flex-col md:flex-row'>

                                            <Datepicker
                                            label="Fecha Inicio"
                                            name="starting_event_date"
                                            id="starting_event_date"
                                            />

                                            {/* separador */}
                                            <div className='mb-1 mt-1 flex md:flex-col justify-center items-center gap-x-6'>
                                                <div className='md:h-1/4 w-1/4 md:w-0.5 h-0.5 bg-indigo-to-yellow'></div>
                                                <div>
                                                <FontAwesomeIcon icon="fa-solid fa-calendar-days" className='text-indigo-to-yellow'></FontAwesomeIcon>
                                                </div>
                                                <div className='md:h-1/4 w-1/4 md:w-0.5 h-0.5 bg-indigo-to-yellow'></div>
                                            </div>

                                            <Datepicker
                                                label="Fecha Fin"
                                                name="finish_event_date"
                                                id="finish_event_date"
                                            />
                                        </div>
                                        <ErrorMessage name="starting_event_date" component={'p'} className='text-red-500'/>
                                        <ErrorMessage name="finish_event_date" component={'p'} className='text-red-500'/>
                                    </div>
                                    

                                    {/* 2.2.2. hora */}
                                    <div className='mt-3'
                                        onFocus={()=>setFocusedId(3)}
                                    >
                                        <h1 htmlFor="event_date" className='text-2xl m-1 font-Bitcount text-indigo-to-yellow'>
                                            Horario del evento<sup>*</sup>
                                        </h1>

                                        {focusedId === 3 ? 
                                            <h2 className='italic text-sm text-center m-2'>
                                                Utilice el formato de 24h.
                                            </h2> : null
                                        }

                                        {/* Hora de inicio y de fin */}
                                        <div className='flex justify-center'

                                        >
                                            <Hourpicker
                                                label="Hora Inicio"
                                                name="start_hour"
                                            />         
                                                                           
                                            {/* separador */}
                                            <div className='mb-1 mt-1 flex flex-col justify-center items-center gap-x-6'>
                                                <div className='h-1/4 w-0.5 bg-indigo-to-yellow'></div>
                                                <div>
                                                <FontAwesomeIcon icon="fa-solid fa-clock" className='text-indigo-to-yellow'></FontAwesomeIcon>
                                                </div>
                                                <div className='h-1/4 w-0.5 bg-indigo-to-yellow'></div>
                                            </div>

                                            <Hourpicker
                                                label="Hora Fin"
                                                name="finish_hour"
                                            />
                                        </div>
                                        <ErrorMessage component={'p'} className='text-red-500 text-sm' name='start_hour'></ErrorMessage>
                                        <ErrorMessage component={'p'} className='text-red-500 text-sm' name='finish_hour'></ErrorMessage>
                                    </div>
                                </div>

                                {/* 2.2. Intereses */}
                                <div className='p-2 text-center md:text-left'>
                                    <h1 htmlFor="event_date" className='text-2xl m-1 font-Bitcount text-indigo-to-yellow'>
                                        Temática<sup>*</sup>
                                    </h1>
                                    {editing ? 
                                        <>
                                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-5 pt-7 sm:grid-cols-3 mb-2 bg-white rounded border-2 border-indigo-to-black'>
                                            {Object.entries(INTERESTS_CONFIG).map(([key,config]) =>{
                                                const isSelected = values.interests.includes(key);

                                                return(
                                                
                                                    <Interest
                                                        key={key}
                                                        icon={config.icon}
                                                        label={config.label}
                                                        selectable={true}
                                                        isSelected={isSelected}
                                                        onClick={ ()=>{
                                                            if(isSelected){
                                                            const next = values.interests.filter(i=> i !== key);
                                                            setFieldValue('interests',next);
                                                            } else if (values.interests.length < 3){
                                                                setFieldValue('interests',[...values.interests, key]);
                                                            }
                                                        }}
                                                    ></Interest>
                                                
                                                )
                                            })}
                                            </div>
                                        </>:
                                        <>
                                            {values.interests && values.interests.length > 0 ?
                                            <>
                                                    <div className='grid grid-cols-2 gap-3 p-5 pt-7 mt-8 sm:grid-cols-3 mb-2 bg-white rounded border-2 border-indigo-to-black'>
                                                        {values.interests?.map((key)=>{
                                                            const config = INTERESTS_CONFIG[key];

                                                            return config ? 
                                                            
                                                                <Interest
                                                                    key={key}
                                                                    icon={config.icon}
                                                                    label={config.label}
                                                                    selectable={false}
                                                                />
                                                            :null;
                                                        })}
                                                    </div>
                                            </>:
                                            null
                                            }
                                        </>
                                    }
                                    <button
                                        onClick={()=>toggleEdit()}
                                        type='button'
                                        className='bg-indigo-to-yellow w-full border text-white-to-black rounded-2xl my-2  p-2 border-indigo-to-yellow hover:cursor-pointer hover:scale-110 transition ease-in-out'
                                    >
                                            {editing? "Confirmar" : "Selecciona los temas" }
                                    </button>

                                    {values.interests && values.interests.length === 0 && !editing ?
                                    <>
                                        <p className='italic p-2 my-4 text-black-to-white text-center'>Puedes seleccionar hasta 3 temas que definan tu evento.</p>
                                    </> :
                                    null   
                                    }
                                    <ErrorMessage name='interests' component={'p'} className='text-red-500 text-center'></ErrorMessage>
                                </div>
                            </div>
                            

                            {/* ubicacion */}
                            <div className='p-2 text-center md:text-left'>
                                <h1 className='font-Bitcount text-2xl text-indigo-to-yellow'>Ubicación<sup>*</sup></h1>
                                {/* calle */}
                                <div>
                                    <Locationpicker
                                        label="ubicacion"
                                        setFieldValue={setFieldValue}
                                        values={values}
                                        setFieldTouched={setFieldTouched}
                                    />
                                    <div className='flex flex-col gap-3'>
                                        <ErrorMessage name='location.province' component={'p'} className='text-red-500'/>
                                        <ErrorMessage name='location.city' component={'p'} className='text-red-500'/>
                                        <ErrorMessage name='location.direction' component={'p'} className='text-red-500'/>
                                    </div>
                                </div>
                            </div>

                            {/* Imágenes */}
                            <div className='p-2'>
                                <h1 className='font-Bitcount text-2xl text-indigo-to-yellow'>Imágenes<sup>*</sup></h1>
                                <EventImage
                                    name="images"
                                    setFieldValue={setFieldValue}
                                    values={values}
                                    setFieldError={setFieldError}
                                    setFieldTouched={setFieldTouched}
                                />
                                <ErrorMessage name='images' component={'p'} className='text-red-500'></ErrorMessage>
                            </div>
                            
                            {/* Terminos y condiciones */}
                            <div className='p-2'>
                                <Field
                                    type="checkbox"
                                    name="terms"
                                    id="terms"
                                    className="mr-2 scale-150"
                                />
                                <label htmlFor="terms">
                                    Acepto los 
                                    <Link to={'/'} target='_blank'> {/* Redirige a una página */}
                                        <span className='underline p-1 text-indigo-to-yellow rounded hover:cursor-pointer hover:text-white-to-black hover:bg-indigo-to-yellow transition ease-in-out'>
                                            terminos y condiciones. <sup>*</sup>
                                        </span>
                                        
                                    </Link>
                                </label>
                                <ErrorMessage name='terms' component={'p'} className='text-red-500'></ErrorMessage>
                            </div>

                            <button type='submit'
                                    className={`bg-indigo-to-yellow text-white-to-black font-Bitcount text-2xl w-full my-5 py-3 rounded-2xl hover:scale-103 transition ease-in-out hover:cursor-pointer ${isSubmitting ? 'opacity-70' : ''}`}
                                    disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creando..." : "Crear Evento"}
                            </button>
                        </div>
                    </Form>
            )}
            </Formik>
        </div>
    </>
  )
}

export default addEvent