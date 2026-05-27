import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { getIn } from 'formik'
library.add(fas,far)

const EventImage = ({setFieldValue, values, name, setFieldError,setFieldTouched}) => {

  const images = values[name] || []
  /* const [error,setError] = useState(""); */

  /* Recoger imagenes y apilarlas */
  const onDrop = useCallback(acceptedFiles => {
    setFieldTouched(name,true,false)
    setFieldError(name,undefined)

    /* Comprobacion de tamaño de nuevas imagenes añadidas para mostrar errores */
    if(acceptedFiles && acceptedFiles.length > 0){
      
      if((images.length + acceptedFiles.length) > 5){
        setFieldTouched(name,true,false)
        setFieldError(name,"No se pueden añadir más de 5 imágenes")
        return;
      }

      const newImages = [...images,...acceptedFiles].slice(0,5)
      setFieldValue(name,newImages)
    }
  },[images,name,setFieldValue])

  /* Características del ondrop */
  const {getRootProps, getInputProps,isDragActive} = useDropzone({
    onDrop,
    multiple:true,
    disabled: images.length >= 5,
    accept:{
      'image/jpeg':['.jpeg','.jpg'],
      'image/png': ['.png'],
    }
  
  })

  /* Borrar imágenes y cargar el nuevo array */
  const deleteHandler = (idx) => {
    setFieldError(name,undefined)
    const updatedImages = images.filter((_,i)=> i != idx )
    setFieldValue(name,updatedImages)
  }
  
    return (
      <>
        {images && images.length !== 0 ?
          <>
            <p className='italic text-sm my-1'>Imagenes restantes: {5-images.length}</p>
            <div 
              className='bg-white min-h-44 flex flex-wrap border-2 border-dashed border-indigo-to-yellow rounded'>
              {images.map((cur,i) =>(
                <div key={i} className='relative h-30 m-4'>
                  <img 
                    src={URL.createObjectURL(cur)}
                    alt={i+1}
                    className='h-full object-contain'
                  />
                  <button
                    type='button'
                    className='absolute -top-2 -right-2 z-999 text-white-to-black border-2 border-indigo-to-black bg-indigo-to-yellow rounded-full w-6 h-6 flex items-center justify-center hover:cursor-pointer hover:scale-120'
                    onClick={()=>deleteHandler(i)}
                    >
                    <FontAwesomeIcon icon={'fa-solid fa-xmark'}></FontAwesomeIcon>
                  </button>
                </div>
              ))}
            </div>
            {images.length < 5 ?
              <>
              <button 
                className='p-2 my-2 border-2 text-white-to-black border-indigo-to-yellow bg-indigo-to-yellow rounded-2xl hover:cursor-pointer hover:scale-110 transition ease-in-out'
                type='button' {...getRootProps()}
              >
                <input {...getInputProps()} />
                Añadir imágenes
              </button>
              </> :
              null
            }
          </>:
          <div {...getRootProps()} 
            className='w-full min-h-44 bg-white border-2 border-dashed rounded border-indigo-to-yellow flex justify-center items-center '
          >
            <input {...getInputProps()} />
            <div className={`flex flex-col text-center items-center hover:cursor-pointer hover:blur-sm transition ease-in-out ${isDragActive ? 'blur-sm': ''}`} >
              <FontAwesomeIcon icon={"fa-solid fa-images"} className='text-5xl p-2 text-indigo-to-black'></FontAwesomeIcon>
              <p className='italic text-sm m-2 text-indigo-to-black'>
                Arrastra aquí imagenes del evento o clicka aquí para seleccionarlas (Máximo 5 imágenes).
                </p>
            </div>
          </div>
        }
      </>
    )
}

export default EventImage